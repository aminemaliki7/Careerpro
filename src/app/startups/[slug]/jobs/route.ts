import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: startup, error: startupError } = await supabaseAdmin
    .from('startups')
    .select('id,name')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle();

  if (startupError) {
    console.error('Error loading startup opportunities profile:', startupError);
    return NextResponse.json({ error: 'Unable to load startup opportunities' }, { status: 500 });
  }
  if (!startup) return NextResponse.json({ error: 'Startup not found' }, { status: 404 });

  const columns = 'id,title,location,type,experience_level,salary_range,compensation_type,remote,posted_date,slug,startup_id,company';
  const [linkedResult, legacyResult] = await Promise.all([
    supabaseAdmin
      .from('jobs')
      .select(columns)
      .eq('startup_id', startup.id)
      .eq('status', 'approved')
      .order('posted_date', { ascending: false }),
    supabaseAdmin
      .from('jobs')
      .select(columns)
      .ilike('company', startup.name.replace(/[\\%_]/g, '\\$&'))
      .is('startup_id', null)
      .eq('status', 'approved')
      .order('posted_date', { ascending: false }),
  ]);

  if (linkedResult.error || legacyResult.error) {
    console.error('Error fetching published startup opportunities:', linkedResult.error || legacyResult.error);
    return NextResponse.json({ error: 'Unable to load startup opportunities' }, { status: 500 });
  }

  const legacyJobs = (legacyResult.data ?? []).filter(
    (job) => job.company?.toLocaleLowerCase() === startup.name.toLocaleLowerCase()
  );
  const seenIds = new Set((linkedResult.data ?? []).map((job) => String(job.id)));
  const jobs = [
    ...(linkedResult.data ?? []),
    ...legacyJobs.filter((job) => !seenIds.has(String(job.id))),
  ].sort((left, right) => new Date(right.posted_date ?? 0).getTime() - new Date(left.posted_date ?? 0).getTime());

  return NextResponse.json(
    { jobs, startupName: startup.name },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}