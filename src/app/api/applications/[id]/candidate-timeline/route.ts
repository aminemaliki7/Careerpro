// src/app/api/applications/[id]/candidate-timeline/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: applicationId } = await context.params;

    // 1. Fetch application to verify it exists and get job_id
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, user_id, job_id')
      .eq('id', applicationId)
      .maybeSingle();

    if (appError) {
      console.error('Application fetch error:', appError);
      return NextResponse.json(
        { error: 'Failed to fetch application' },
        { status: 500 }
      );
    }

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // 2. Verify authorization
    // Recruiter (owns the job) OR candidate (owns the application)
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('owner_id')
      .eq('id', application.job_id)
      .maybeSingle();

    if (jobError) {
      console.error('Job fetch error:', jobError);
      return NextResponse.json(
        { error: 'Failed to verify access' },
        { status: 500 }
      );
    }

    const isRecruiter = job && job.owner_id === userId;
    const isCandidate = application.user_id === userId;

    if (!isRecruiter && !isCandidate) {
      return NextResponse.json(
        { error: 'You do not have permission to view this timeline' },
        { status: 403 }
      );
    }

    // 3. Fetch all communications for this application, ordered by creation date (newest first)
    const { data: communications, error: commError } = await supabaseAdmin
      .from('candidate_communications')
      .select('id, recruiter_id, event_type, subject, body, created_at')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (commError) {
      console.error('Communications fetch error:', commError);
      return NextResponse.json(
        { error: 'Failed to fetch timeline' },
        { status: 500 }
      );
    }

    // 4. Return timeline
    return NextResponse.json(
      {
        application_id: applicationId,
        timeline: communications || [],
        count: (communications || []).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching candidate timeline:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
