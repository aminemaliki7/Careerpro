// src/app/api/applications/[id]/cv/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

const SIGNED_URL_EXPIRY_SECONDS = 3600;

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

    // 1. Fetch application to verify it exists
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, user_id, job_id, cv_url, cv_file_url')
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

    // 2. Verify authorization: candidate (owns the application) OR
    // recruiter (owns the job)
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
        { error: 'You do not have permission to view this application' },
        { status: 403 }
      );
    }

    // 3. Resolve the CV reference. Legacy rows store a full public URL;
    // new rows store a storage path inside the private application-cvs bucket.
    const cvRef = application.cv_file_url || application.cv_url;

    if (!cvRef) {
      return NextResponse.json(
        { error: 'No CV attached to this application' },
        { status: 404 }
      );
    }

    if (/^https?:\/\//i.test(cvRef)) {
      return NextResponse.redirect(cvRef);
    }

    const { data: signed, error: signedError } = await supabaseAdmin.storage
      .from('application-cvs')
      .createSignedUrl(cvRef, SIGNED_URL_EXPIRY_SECONDS);

    if (signedError || !signed?.signedUrl) {
      console.error('Signed URL error:', signedError);
      return NextResponse.json(
        { error: 'CV could not be retrieved' },
        { status: 404 }
      );
    }

    return NextResponse.redirect(signed.signedUrl);
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}