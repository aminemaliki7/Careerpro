// /src/app/api/jobs/unsave/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    const { job_id } = await req.json();

    if (!job_id) {
      return NextResponse.json(
        { error: 'Missing job_id' },
        { status: 400 }
      );
    }

    // Delete from saved_jobs using service role
    const { error } = await supabaseAdmin
      .from('saved_jobs')
      .delete()
      .eq('user_id', userId)
      .eq('job_id', String(job_id));

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to unsave job' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Job unsaved successfully', saved: false },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unsaving job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}