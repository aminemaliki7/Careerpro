// src/app/api/applications/save/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';
import { runATSAnalysis } from '@/lib/ats';

const ELIGIBLE_AUTOMATION_STAGES = ['application', 'review'];
const VALID_AUTOMATION_RULE_TYPES = ['auto_shortlist', 'auto_review'];

async function logApplicationEvent({
  applicationId,
  recruiterId,
  eventType,
  body,
}: {
  applicationId: string;
  recruiterId: string;
  eventType: 'application_submitted' | 'ats_analyzed' | 'stage_changed';
  body: string;
}) {
  try {
    if (!applicationId || !recruiterId) {
      return;
    }

    const { data: existingEvent, error: lookupError } = await supabaseAdmin
      .from('candidate_communications')
      .select('id')
      .eq('application_id', applicationId)
      .eq('event_type', eventType)
      .limit(1)
      .maybeSingle();

    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error('Communication lookup error (non-blocking):', lookupError);
      return;
    }

    if (existingEvent) {
      return;
    }

    const { error: insertError } = await supabaseAdmin
      .from('candidate_communications')
      .insert({
        application_id: applicationId,
        recruiter_id: recruiterId,
        event_type: eventType,
        body,
      });

    if (insertError) {
      console.error('Application activity log error (non-blocking):', insertError);
    }
  } catch (error) {
    console.error('Application event logging failed (non-blocking):', error);
  }
}

async function applyAutomationToSavedApplication({
  applicationId,
  jobId,
  ownerId,
  atsScore,
}: {
  applicationId: string;
  jobId: number;
  ownerId: string;
  atsScore: number | null;
}) {
  try {
    if (!applicationId || !jobId || !ownerId) {
      return;
    }

    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('automation_config')
      .select('id, rule_type, threshold, action, enabled')
      .eq('job_id', jobId)
      .eq('enabled', true);

    if (rulesError) {
      console.error('Automation config lookup error (non-blocking):', rulesError);
      return;
    }

    const enabledRules = (rules || []).filter((rule) =>
      VALID_AUTOMATION_RULE_TYPES.includes(rule.rule_type as string)
    );

    if (!enabledRules.length) {
      return;
    }

    const { data: application, error: applicationError } = await supabaseAdmin
      .from('applications')
      .select('id, pipeline_stage')
      .eq('id', applicationId)
      .maybeSingle();

    if (applicationError) {
      console.error('Application fetch for automation error (non-blocking):', applicationError);
      return;
    }

    if (!application || !application.pipeline_stage) {
      return;
    }

    if (!ELIGIBLE_AUTOMATION_STAGES.includes(application.pipeline_stage)) {
      return;
    }

    const effectiveScore = Number(atsScore ?? 0);
    const shortlistRule = enabledRules.find(
      (rule) => rule.rule_type === 'auto_shortlist' && effectiveScore >= Number(rule.threshold)
    );
    const reviewRule = enabledRules.find(
      (rule) => rule.rule_type === 'auto_review' && effectiveScore < Number(rule.threshold)
    );
    const targetStage = shortlistRule ? 'shortlisted' : reviewRule ? 'review' : null;

    if (!targetStage || application.pipeline_stage === targetStage) {
      return;
    }

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        pipeline_stage: targetStage,
        last_activity_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Application automation update error (non-blocking):', updateError);
      return;
    }

    const { error: communicationError } = await supabaseAdmin
      .from('candidate_communications')
      .insert({
        application_id: applicationId,
        recruiter_id: ownerId,
        event_type: 'stage_changed',
        body: `Automation moved candidate from ${application.pipeline_stage} to ${targetStage}`,
      });

    if (communicationError) {
      console.error('Candidate communication insert error (non-blocking):', communicationError);
    }
  } catch (error) {
    console.error('Automation follow-up failed (non-blocking):', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to apply' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      job_id,
      job_title,
      company,
      location,
      salary_range,
      cv_text,
      cv_url,
      cv_file_name,
      generated_email,
    } = body;

    // Validate required fields
    if (!job_id || !job_title || !company || !cv_text || !generated_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Resolve the listing on the server so company dashboards can always
    // match the application to the authoritative job record. Select '*' so
    // whatever the requirements/skills/description columns are actually
    // called on your jobs table, they're available below for scoring.
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', job_id)
      .maybeSingle();

    if (jobError) {
      console.error('Job lookup error:', jobError);
      return NextResponse.json(
        { error: 'Failed to verify job listing' },
        { status: 500 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job listing not found' },
        { status: 404 }
      );
    }

    // Compute the ATS match score once, at apply-time, so the company
    // dashboard never has to recompute it on every load.
    let atsScore: number | null = null;
    try {
      const analysis = runATSAnalysis({
        cvText: cv_text,
        jobTitle: job.title,
        company: job.company,
        requirements: Array.isArray(job.requirements) ? job.requirements : undefined,
        skills: Array.isArray(job.skills) ? job.skills : undefined,
        description: typeof job.description === 'string' ? job.description : undefined,
      });
      atsScore = analysis.matchScore;
    } catch (scoreError) {
      // Don't block the application if scoring fails for any reason -
      // the candidate's submission still matters more than the score.
      console.error('ATS scoring error (non-blocking):', scoreError);
    }

    const insertPayload = {
      user_id: userId,
      job_id: String(job.id),
      job_title: job.title,
      company: job.company,
      location: job.location || location || null,
      salary_range: job.salary_range || salary_range || null,
      cv_text,
      generated_email,
      ai_applied: true,
      status: 'pending',
      ats_score: atsScore,
    } as Record<string, unknown>;

    if (cv_url) {
      insertPayload.cv_url = cv_url;
    }

    if (cv_file_name) {
      insertPayload.cv_file_name = cv_file_name;
    }

    // Save to Supabase using service role key (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([insertPayload])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      );
    }

    const savedApplication = data?.[0];

    if (savedApplication?.id) {
      void logApplicationEvent({
        applicationId: savedApplication.id,
        recruiterId: job.owner_id,
        eventType: 'application_submitted',
        body: 'Application submitted',
      });

      if (atsScore !== null && atsScore !== undefined) {
        void logApplicationEvent({
          applicationId: savedApplication.id,
          recruiterId: job.owner_id,
          eventType: 'ats_analyzed',
          body: `ATS analysis completed with score ${atsScore}`,
        });
      }

      void applyAutomationToSavedApplication({
        applicationId: savedApplication.id,
        jobId: Number(job.id),
        ownerId: job.owner_id,
        atsScore,
      });
    }

    return NextResponse.json(
      {
        message: 'Application saved successfully',
        application: savedApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}