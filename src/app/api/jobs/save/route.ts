// /src/app/api/jobs/save/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to save jobs' },
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

    // Save to saved_jobs table using service role
    const { data, error } = await supabaseAdmin
      .from('saved_jobs')
      .insert([
        {
          user_id: userId,
          job_id: String(job_id),
        }
      ])
      .select();

    if (error) {
      // If duplicate, it's not really an error - job is already saved
      if (error.code === '23505') {
        return NextResponse.json(
          { message: 'Job already saved', saved: true },
          { status: 200 }
        );
      }
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save job' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Job saved successfully', saved: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}