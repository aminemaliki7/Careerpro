// src/app/admin/jobs/pending/actions.ts
// Server actions backing the pending-jobs moderation UI. Each action re-verifies
// admin authorization server-side (defense in depth on top of the admin layout
// gate) and writes through the service-role client, never the anonymous one.
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/authorization';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Job } from '@/types/job';

export async function getPendingJobs(): Promise<Array<Job & { canApprove: boolean }>> {
  const authResult = await requireAdmin();
  if (authResult.response) redirect('/');

  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('status', 'pending')
    .order('posted_date', { ascending: false });

  if (error) {
    console.error('Error fetching pending jobs:', error);
    return [];
  }

  return ((data ?? []) as Job[]).map((job) => ({
    ...job,
    canApprove: !(job.startup_id && job.owner_id === authResult.userId),
  }));
}

export async function setJobStatus(
  jobId: number | string,
  status: 'approved' | 'rejected'
): Promise<void> {
  const authResult = await requireAdmin();
  if (authResult.response) redirect('/');

  if (status === 'approved') {
    const { data: job, error: lookupError } = await supabaseAdmin
      .from('jobs')
      .select('owner_id,startup_id')
      .eq('id', jobId)
      .maybeSingle();

    if (lookupError) {
      console.error('Error checking job ownership before approval:', lookupError);
      throw new Error('Unable to verify job ownership before approval.');
    }
    if (!job) throw new Error('Job not found.');
    if (job.startup_id && job.owner_id === authResult.userId) {
      throw new Error('You cannot approve your own startup opportunity.');
    }
  }

  const { error } = await supabaseAdmin
    .from('jobs')
    .update({ status, updated_date: new Date().toISOString() })
    .eq('id', jobId);

  if (error) {
    console.error(`Error ${status}ing job:`, error);
    return;
  }

  revalidatePath('/admin/jobs/pending');
}