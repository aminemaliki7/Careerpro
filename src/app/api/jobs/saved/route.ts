// /src/app/api/jobs/saved/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 1: Fetch saved job entries for the user
    const { data: savedRows, error: savedError } = await supabaseAdmin
      .from('saved_jobs')
      .select('id, job_id, saved_at')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false });

    if (savedError) {
      console.error('Error fetching saved_jobs:', savedError);
      return NextResponse.json(
        { error: 'Failed to fetch saved job entries', details: savedError.message },
        { status: 500 }
      );
    }

    if (!savedRows || savedRows.length === 0) {
      return NextResponse.json({ success: true, jobs: [], saved_jobs: [] }, { status: 200 });
    }

    // Step 2: Extract job_id strings
    const jobIds = savedRows.map((item) => item.job_id).filter(Boolean);

    // Step 3: Query jobs table using .in()
    const { data: jobDetails, error: jobsError } = await supabaseAdmin
      .from('jobs')
      .select('id, title, company, location, type, salary_range, posted_date')
      .in('id', jobIds);

    if (jobsError) {
      console.error('Error fetching job details:', jobsError);
      return NextResponse.json(
        { error: 'Failed to fetch job details', details: jobsError.message },
        { status: 500 }
      );
    }

    // Step 4: Map details onto saved items
    const jobsMap = new Map((jobDetails || []).map((j) => [String(j.id), j]));

    const formattedJobs = savedRows.map((saved) => {
      const details = jobsMap.get(String(saved.job_id)) || {};
      return {
        saved_id: saved.id,
        saved_at: saved.saved_at,
        job_id: saved.job_id,
        ...details,
      };
    });

    return NextResponse.json(
      {
        success: true,
        jobs: formattedJobs,
        saved_jobs: savedRows,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error ', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}