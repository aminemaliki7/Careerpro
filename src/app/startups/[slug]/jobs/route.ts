// src/app/api/startups/[slug]/jobs/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. Résoudre le slug → nom de la startup
  const { data: startup, error: startupError } = await supabase
    .from('startups')
    .select('name')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();

  if (startupError || !startup) {
    return NextResponse.json({ jobs: [] });
  }

  // 2. Fetch les jobs qui matchent ce nom (case-insensitive)
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('id, title, location, type, experience_level, salary_range, remote, posted_date, slug')
    .ilike('company', startup.name)
    .eq('status', 'approved')
    .order('posted_date', { ascending: false });

  if (jobsError) {
    return NextResponse.json({ jobs: [] });
  }

  return NextResponse.json({ jobs: jobs ?? [], startupName: startup.name });
}