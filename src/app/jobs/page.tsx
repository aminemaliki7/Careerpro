import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase/client';
import type { Job } from '@/types/job';
import JobsClient from './JobsClient';

// Re-generate at most every 10 minutes so new jobs show up without a redeploy.
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Tech Jobs: Find Roles That Match Your CV',
  description:
    'Browse tech jobs in engineering, data, DevOps, QA and product. See how well your CV matches each role before you apply.',
  alternates: { canonical: '/jobs' },
  openGraph: {
    url: '/jobs',
    title: 'Tech Jobs: Find Roles That Match Your CV | Hirely',
    description:
      'Browse tech jobs and see your CV match score before you apply.',
  },
};

export default async function JobsPage() {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .order('posted_date', { ascending: false });

  return <JobsClient initialJobs={(data ?? []) as Job[]} />;
}
