// src/app/api/applications/[id]/update-stage/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

const VALID_STAGES = ['application', 'review', 'shortlisted', 'interview', 'offer', 'hired', 'rejected'];

export async function POST(
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
    const body = await req.json();
    const { pipeline_stage } = body;

    // Validate pipeline_stage
    if (!pipeline_stage || !VALID_STAGES.includes(pipeline_stage)) {
      return NextResponse.json(
        { error: `Invalid pipeline stage. Must be one of: ${VALID_STAGES.join(', ')}` },
        { status: 400 }
      );
    }

    // 1. Fetch application to verify it exists
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, job_id, pipeline_stage')
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

    // 2. Verify recruiter owns the job
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('owner_id')
      .eq('id', application.job_id)
      .maybeSingle();

    if (jobError) {
      console.error('Job fetch error:', jobError);
      return NextResponse.json(
        { error: 'Failed to verify job ownership' },
        { status: 500 }
      );
    }

    if (!job || job.owner_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this application' },
        { status: 403 }
      );
    }

    // 3. Skip if already in the same stage
    if (application.pipeline_stage === pipeline_stage) {
      return NextResponse.json(
        { message: 'Application is already in this stage', application },
        { status: 200 }
      );
    }

    // 4. Update application pipeline_stage and last_activity_date
    const { data: updatedApp, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        pipeline_stage,
        last_activity_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (updateError) {
      console.error('Application update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    // 5. Create communication record for audit trail
    const { error: commError } = await supabaseAdmin
      .from('candidate_communications')
      .insert({
        application_id: applicationId,
        recruiter_id: userId,
        event_type: 'stage_changed',
        body: `Candidate moved from ${application.pipeline_stage} to ${pipeline_stage}`,
      });

    if (commError) {
      console.error('Communication record error (non-blocking):', commError);
      // Don't fail the entire request if communication logging fails
    }

    return NextResponse.json(
      {
        message: `Application moved to ${pipeline_stage}`,
        application: updatedApp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating application stage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
