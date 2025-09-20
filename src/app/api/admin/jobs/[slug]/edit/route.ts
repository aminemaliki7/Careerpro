import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase'; // Import the Supabase client

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const jobData = await request.json();

  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('slug', slug)
    .select();

  if (error) {
    console.error('Error updating job:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (data.length === 0) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({ 
    message: 'Job updated successfully', 
    data: data[0]
  }, { status: 200 });
}
