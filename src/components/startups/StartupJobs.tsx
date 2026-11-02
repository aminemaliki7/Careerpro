// src/components/startups/StartupJobs.tsx
import StartupOpportunityList from './StartupOpportunityList';
import type { OpportunityCompensationType } from '@/types/job';

interface Job {
  id: string | number;
  title: string;
  location: string | null;
  type: string | null;
  experience_level: string | null;
  salary_range: string | null;
  compensation_type: OpportunityCompensationType | null;
  remote: boolean;
  posted_date: string | null;
  slug: string | null;
  startup_id: string | null;
}

interface StartupJobsProps {
  slug: string;
  startupName: string;
}

async function getStartupJobs(slug: string): Promise<Job[] | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/startups/${encodeURIComponent(slug)}/jobs`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.jobs ?? [];
  } catch (error) {
    console.error('Error loading published startup opportunities:', error);
    return null;
  }
}

export default async function StartupJobs({ slug, startupName }: StartupJobsProps) {
  const jobs = await getStartupJobs(slug);
  return (
    <div className="mt-8">
      <StartupOpportunityList
        opportunities={jobs ?? []}
        startupName={startupName}
        loadError={jobs === null}
      />
    </div>
  );
}
