// src/app/api/applications/save/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { runATSAnalysis } from '@/lib/ats';

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

    return NextResponse.json(
      {
        message: 'Application saved successfully',
        application: data?.[0],
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