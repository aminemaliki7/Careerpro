import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import the Supabase client
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { data: jobs, error } = await supabase
    .from('jobs') // Your Supabase table name
    .select('*')
    .order('posted_date', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return NextResponse.json(jobs);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('role')
    .eq('clerk_id', userId)
    .maybeSingle();

  if (profileError || !profile || !['company', 'recruiter', 'founder'].includes(profile.role)) {
    return NextResponse.json({ error: 'Only company accounts can post jobs' }, { status: 403 });
  }

  const jobData = { ...(await request.json()), owner_id: userId };

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .insert([jobData])
    .select();

  if (error) {
    console.error('Error creating job:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return NextResponse.json({ 
    message: 'Job created successfully', 
    data: data[0] 
  }, { status: 201 });
}
