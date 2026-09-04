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

export async function getPendingJobs(): Promise<Job[]> {
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

  return (data ?? []) as Job[];
}

export async function setJobStatus(
  jobId: number | string,
  status: 'approved' | 'rejected'
): Promise<void> {
  const authResult = await requireAdmin();
  if (authResult.response) redirect('/');

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