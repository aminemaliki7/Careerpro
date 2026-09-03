import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

const ELIGIBLE_STAGES = ['application', 'review'];
const VALID_RULE_TYPES = ['auto_shortlist', 'auto_review'];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { job_id } = body;

    const jobId = Number(job_id);
    if (!Number.isInteger(jobId) || jobId <= 0) {
      return NextResponse.json(
        { error: 'Valid job_id is required' },
        { status: 400 }
      );
    }

    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('id, owner_id')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError) {
      console.error('Job ownership lookup error:', jobError);
      return NextResponse.json(
        { error: 'Failed to verify job ownership' },
        { status: 500 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.owner_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to apply automation rules for this job' },
        { status: 403 }
      );
    }

    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('automation_config')
      .select('id, rule_type, threshold, action, enabled')
      .eq('job_id', jobId)
      .eq('enabled', true);

    if (rulesError) {
      console.error('Automation config fetch error:', rulesError);
      return NextResponse.json(
        { error: 'Failed to fetch automation rules' },
        { status: 500 }
      );
    }

    const enabledRules = (rules || []).filter((rule) => {
      return VALID_RULE_TYPES.includes(rule.rule_type as string);
    });

    const { data: applications, error: applicationsError } = await supabaseAdmin
      .from('applications')
      .select('id, job_id, pipeline_stage, ats_score')
      .eq('job_id', jobId);

    if (applicationsError) {
      console.error('Applications fetch error:', applicationsError);
      return NextResponse.json(
        { error: 'Failed to fetch applications for this job' },
        { status: 500 }
      );
    }

    const processed = { updated: 0, skipped: 0, errors: 0 };

    for (const application of applications || []) {
      const currentStage = application.pipeline_stage;

      if (!currentStage || !ELIGIBLE_STAGES.includes(currentStage)) {
        processed.skipped += 1;
        continue;
      }

      const atsScore = Number(application.ats_score ?? 0);
      const shortlistRule = enabledRules.find(
        (rule) => rule.rule_type === 'auto_shortlist' && atsScore >= Number(rule.threshold)
      );
      const reviewRule = enabledRules.find(
        (rule) => rule.rule_type === 'auto_review' && atsScore < Number(rule.threshold)
      );

      const targetStage = shortlistRule ? 'shortlisted' : reviewRule ? 'review' : null;

      if (!targetStage || currentStage === targetStage) {
        processed.skipped += 1;
        continue;
      }

      try {
        const { error: updateError } = await supabaseAdmin
          .from('applications')
          .update({
            pipeline_stage: targetStage,
            last_activity_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', application.id);

        if (updateError) {
          console.error('Application automation update failed:', updateError);
          processed.errors += 1;
          continue;
        }

        const { error: communicationError } = await supabaseAdmin
          .from('candidate_communications')
          .insert({
            application_id: application.id,
            recruiter_id: job.owner_id,
            event_type: 'stage_changed',
            body: `Automation moved candidate from ${currentStage} to ${targetStage}`,
          });

        if (communicationError) {
          console.error('Candidate communication insert failed:', communicationError);
        }

        processed.updated += 1;
      } catch (error) {
        console.error('Application automation processing error:', error);
        processed.errors += 1;
      }
    }

    return NextResponse.json(
      {
        job_id: jobId,
        updated: processed.updated,
        skipped: processed.skipped,
        errors: processed.errors,
        message: 'Automation rules applied successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected automation execution error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
