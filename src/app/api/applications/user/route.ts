// src/app/api/applications/user/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Fetch applications from Supabase using service role (bypasses RLS).
    // Explicit allowlist only - candidates must NEVER see internal_notes or
    // the full cv_text extracted by the recruiter-side pipeline.
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select(
        'id, job_id, job_title, company, location, salary_range, generated_email, status, pipeline_stage, ai_applied, applied_date, contacted_date, created_at, updated_at, cv_url, cv_file_name'
      )
      .eq('user_id', userId)
      .order('applied_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        applications: data || [],
        count: data?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}