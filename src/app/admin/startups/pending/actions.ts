'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/authorization';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

const startupIdSchema = z.string().uuid();
const startupStatusSchema = z.enum(['approved', 'rejected']);

export async function getPendingStartups() {
  const authResult = await requireAdmin();
  if (authResult.response) redirect('/');

  const { data, error } = await supabaseAdmin
    .from('startups')
    .select('id,name,slug,description,full_description,industry,location,website_url,logo_url,contact_name,contact_email,created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending startups:', error);
    throw new Error('Unable to load pending startup submissions.');
  }

  return data ?? [];
}

export async function setStartupStatus(
  startupId: string,
  status: 'approved' | 'rejected'
) {
  const authResult = await requireAdmin();
  if (authResult.response) redirect('/');

  const parsedId = startupIdSchema.safeParse(startupId);
  const parsedStatus = startupStatusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) {
    throw new Error('Invalid startup review request.');
  }

  const { data, error } = await supabaseAdmin
    .from('startups')
    .update({ status: parsedStatus.data, updated_at: new Date().toISOString() })
    .eq('id', parsedId.data)
    .eq('status', 'pending')
    .select('slug')
    .maybeSingle();

  if (error) {
    console.error(`Error ${parsedStatus.data}ing startup:`, error);
    throw new Error('Unable to update startup review status.');
  }
  if (!data) {
    throw new Error('This startup is no longer awaiting review.');
  }

  revalidatePath('/admin/startups/pending');
  revalidatePath('/startups');
  revalidatePath('/sitemap.xml');
  revalidatePath(`/startups/${data.slug}`);
}
