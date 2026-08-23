import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function hasCompanyAccess(userId: string) {
  const { data: profile, error } = await supabaseAdmin
    .from('user_profiles')
    .select('role')
    .eq('clerk_id', userId)
    .maybeSingle();

  return !error && Boolean(profile && ['company', 'recruiter', 'founder'].includes(profile.role));
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await hasCompanyAccess(userId))) {
    return NextResponse.json({ error: 'Company access required' }, { status: 403 });
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
        .select('id, user_id, job_id, job_title, company, location, status, applied_date, cv_url, cv_file_name, ats_score')
        .in('job_id', jobIds)
        .order('applied_date', { ascending: false })
    : { data: [], error: null };

  if (applicationsError) {
    console.error('Company applications error:', applicationsError);
    return NextResponse.json({ error: 'Failed to load applications' }, { status: 500 });
  }

  // Attach each candidate's email from Clerk. Batched into a single
  // getUserList call for all unique applicants instead of one call per row.
  const uniqueUserIds = [...new Set((applications || []).map((application) => application.user_id).filter(Boolean))];

  let emailByUserId: Record<string, string | undefined> = {};
  if (uniqueUserIds.length) {
    try {
      const client = await clerkClient();
      const { data: users } = await client.users.getUserList({
        userId: uniqueUserIds,
        limit: uniqueUserIds.length,
      });
      emailByUserId = Object.fromEntries(
        users.map((user) => [user.id, user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress])
      );
    } catch (clerkError) {
      // Don't fail the whole dashboard if Clerk lookup has an issue -
      // applications are still more important than the email column.
      console.error('Clerk email lookup error:', clerkError);
    }
  }

  const applicationsWithEmail = (applications || []).map((application) => ({
    ...application,
    candidate_email: emailByUserId[application.user_id],
  }));

  return NextResponse.json({ jobs: jobs || [], applications: applicationsWithEmail });
}

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!(await hasCompanyAccess(userId))) {
    return NextResponse.json({ error: 'Company access required' }, { status: 403 });
  }

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