// src/app/api/applications/save/route.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get user from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to apply' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      job_id,
      job_title,
      company,
      location,
      salary_range,
      cv_text,
      generated_email,
    } = body;

    // Validate required fields
    if (!job_id || !job_title || !company || !cv_text || !generated_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Supabase using service role key (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          user_id: userId,
          job_id: String(job_id),
          job_title,
          company,
          location: location || null,
          salary_range: salary_range || null,
          cv_text,
          generated_email,
          ai_applied: true,
          status: 'pending',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Application saved successfully',
        application: data?.[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}