// src/app/api/applications/[id]/add-note/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

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
    const { note } = body;

    // Validate note
    if (!note || typeof note !== 'string' || note.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note cannot be empty' },
        { status: 400 }
      );
    }

    const trimmedNote = note.trim();
    if (trimmedNote.length > 5000) {
      return NextResponse.json(
        { error: 'Note cannot exceed 5000 characters' },
        { status: 400 }
      );
    }

    // 1. Fetch application to verify it exists
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, job_id, internal_notes')
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
        { error: 'You do not have permission to add notes to this application' },
        { status: 403 }
      );
    }

    // 3. Update application internal_notes and last_activity_date
    // Note: This replaces the entire notes field. For V1, this is sufficient.
    // In future, we could store notes with timestamps/history.
    const { data: updatedApp, error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        internal_notes: trimmedNote,
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

    // 4. Create communication record for audit trail
    const { data: communication, error: commError } = await supabaseAdmin
      .from('candidate_communications')
      .insert({
        application_id: applicationId,
        recruiter_id: userId,
        event_type: 'note_added',
        body: trimmedNote,
      })
      .select()
      .single();

    if (commError) {
      console.error('Communication record error (non-blocking):', commError);
      // Don't fail the entire request if communication logging fails
    }

    return NextResponse.json(
      {
        message: 'Note added successfully',
        application: updatedApp,
        communication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
