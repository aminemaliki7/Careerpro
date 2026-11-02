import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase/client';
import type { Job } from '@/types/job';
import JobsClient from './JobsClient';

// Re-generate at most every 10 minutes so new jobs show up without a redeploy.
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Opportunities',
  description:
    'Explore published roles and startup opportunities, and find ways to contribute to teams building what comes next.',
  alternates: { canonical: '/jobs' },
  openGraph: {
    url: '/jobs',
    title: 'Opportunities | Hirely',
    description:
      'Explore published roles and startup opportunities on Hirely.',
  },
};

export default async function JobsPage() {
  const { data } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
    .order('posted_date', { ascending: false });

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Explore opportunities
        </h1>
      </div>
      <JobsClient initialJobs={(data ?? []) as Job[]} />
    </>
  );
}
