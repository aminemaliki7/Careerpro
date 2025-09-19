import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import the Supabase client

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
  const jobData = await request.json();

  const { data, error } = await supabase
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