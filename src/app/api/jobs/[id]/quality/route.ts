import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { analyzeJobQuality } from '@/lib/job-quality';
import type { Job } from '@/types/job';

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

    const { data: startups, error: startupsError } = await supabaseAdmin
      .from('startups')
      .select('id,name,slug,funding_stage,size,founded_date,job_count,owner_id')
      .eq('status', 'approved');

    if (startupsError) {
      console.error('Supabase error fetching startups:', startupsError);
    }

    const quality = analyzeJobQuality(
      job as Job,
      (startups ?? []).map((startup) => ({
        id: startup.id,
        name: startup.name,
        slug: startup.slug,
        fundingStage: startup.funding_stage,
        size: startup.size,
        foundedDate: startup.founded_date,
        jobCount: startup.job_count ?? undefined,
        ownerId: startup.owner_id ?? undefined,
      }))
    );

    return NextResponse.json({ quality });
  } catch (err) {
    console.error('Error analyzing job quality:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}