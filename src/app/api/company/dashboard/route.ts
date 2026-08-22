import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: jobs, error: jobsError } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('owner_id', userId)
    .order('posted_date', { ascending: false });

  if (jobsError) {
    console.error('Company jobs error:', jobsError);
    return NextResponse.json({ error: 'Failed to load company jobs' }, { status: 500 });
  }

  const jobIds = (jobs || []).map((job) => String(job.id));
  const { data: applications, error: applicationsError } = jobIds.length
    ? await supabaseAdmin
        .from('applications')
        .select('id, job_id, job_title, company, location, status, applied_date, cv_file_url, cv_url, cv_file_name, cv_filename, generated_email')
        .in('job_id', jobIds)
        .order('applied_date', { ascending: false })
    : { data: [], error: null };

  if (applicationsError) {
    console.error('Company applications error:', applicationsError);
    return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
  }

  return NextResponse.json({ jobs: jobs || [], applications: applications || [] });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { applicationId, status } = await request.json();
  if (!applicationId || !['pending', 'interview', 'accepted', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid application update' }, { status: 400 });
  }

  const { data: ownedJobs, error: jobsError } = await supabaseAdmin
    .from('jobs')
    .select('id')
    .eq('owner_id', userId);
  if (jobsError) return NextResponse.json({ error: 'Failed to verify job ownership' }, { status: 500 });

  const ownedJobIds = (ownedJobs || []).map((job) => String(job.id));
  const { data: application } = await supabaseAdmin
    .from('applications')
    .select('id, job_id')
    .eq('id', applicationId)
    .maybeSingle();

  if (!application || !ownedJobIds.includes(String(application.job_id))) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  return NextResponse.json({ application: data });
}