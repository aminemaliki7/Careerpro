// app/api/auth/set-role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { role } = await request.json();

    // Validate role
    if (!role || !['candidate', 'founder', 'company'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "candidate", "founder", or "company".' },
        { status: 400 }
      );
    }

    // Check if user profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_id', userId)
      .maybeSingle();

    let result;

    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('user_profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('clerk_id', userId)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('user_profiles')
        .insert({
          clerk_id: userId,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Supabase error:', result.error);
      return NextResponse.json(
        { error: 'Failed to save role' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Role saved successfully',
        profile: result.data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch user role
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, created_at')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch role' },
        { status: 500 }
      );
    }

    // User doesn't have a role yet
    if (!data) {
      return NextResponse.json(
        { role: null, message: 'User role not set' },
        { status: 200 }
      );
    }

    return NextResponse.json({ role: data.role }, { status: 200 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}