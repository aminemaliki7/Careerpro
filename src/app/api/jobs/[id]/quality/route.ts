import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { analyzeJobQuality } from '@/lib/job-quality';
import type { Job } from '@/types/job';
import type { Startup } from '@/types/startup';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // ASSUMPTION: table is named "jobs", looked up by "id". Adjust if different.
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (jobError || !job) {
      if (jobError?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      console.error('Supabase error fetching job:', jobError);
      return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
    }

    const { data: startups, error: startupsError } = await supabase
      .from('startups')
      .select('*')
      .eq('status', 'approved');

    if (startupsError) {
      console.error('Supabase error fetching startups:', startupsError);
    }

    const quality = analyzeJobQuality(job as Job, (startups ?? []) as Startup[]);

    return NextResponse.json({ quality });
  } catch (err) {
    console.error('Error analyzing job quality:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}