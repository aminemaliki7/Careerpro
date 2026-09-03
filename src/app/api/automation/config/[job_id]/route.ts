// src/app/api/automation/config/[job_id]/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ job_id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { job_id } = await context.params;

    // Parse job_id as integer
    const jobId = parseInt(job_id, 10);
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'Invalid job_id format' },
        { status: 400 }
      );
    }

    // 1. Verify recruiter owns the job
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('owner_id')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError) {
      console.error('Job fetch error:', jobError);
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
        { error: 'You do not have permission to view automation rules for this job' },
        { status: 403 }
      );
    }

    // 2. Fetch all automation rules for this job
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('automation_config')
      .select('id, job_id, rule_type, threshold, action, enabled, created_at, updated_at')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (rulesError) {
      console.error('Rules fetch error:', rulesError);
      return NextResponse.json(
        { error: 'Failed to fetch automation rules' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        job_id: jobId,
        rules: rules || [],
        count: (rules || []).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching automation config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
