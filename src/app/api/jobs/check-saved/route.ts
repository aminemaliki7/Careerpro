// /src/app/api/jobs/check-saved/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { saved: false },
        { status: 200 }
      );
    }

    const { job_id } = await req.json();

    if (!job_id) {
      return NextResponse.json(
        { error: 'Missing job_id' },
        { status: 400 }
      );
    }

    // Check if job is saved by user
    const { data, error } = await supabaseAdmin
      .from('saved_jobs')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', String(job_id))
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { saved: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { saved: !!data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking saved status:', error);
    return NextResponse.json(
      { saved: false },
      { status: 200 }
    );
  }
}