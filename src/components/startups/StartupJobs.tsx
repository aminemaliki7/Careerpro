// src/components/startups/StartupJobs.tsx
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, Wifi } from 'lucide-react';
import { createJobSlug } from '@/lib/utils/format';

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  experience_level: string;
  salary_range?: string;
  remote: boolean;
  posted_date: string;
  slug?: string;
}

interface StartupJobsProps {
  slug: string;
  startupName: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays}d ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function getStartupJobs(slug: string): Promise<Job[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/startups/${slug}/jobs`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.jobs ?? [];
  } catch {
    return [];
  }
}

export default async function StartupJobs({ slug, startupName }: StartupJobsProps) {
  const jobs = await getStartupJobs(slug);

  if (jobs.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-8 text-center">
        <Briefcase className="mx-auto mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">No open positions at {startupName} right now</p>
        <p className="mt-1 text-xs text-gray-400">Check back soon or browse all jobs</p>
        <Link
          href="/jobs"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#0A66C2] hover:underline"
        >
          Browse all jobs <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Briefcase className="h-5 w-5 text-[#0A66C2]" />
          Open positions
          <span className="ml-1 rounded-full bg-[#0A66C2]/10 px-2 py-0.5 text-xs font-semibold text-[#0A66C2]">
            {jobs.length}
          </span>
        </h2>
        <Link
          href={`/jobs?company=${encodeURIComponent(startupName)}`}
          className="text-xs text-gray-400 hover:text-[#0A66C2] transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Job list */}
      <div className="flex flex-col gap-3">
        {jobs.map((job) => {
          const jobSlug = job.slug ?? createJobSlug(job.title);
          return (
            <Link
              key={job.id}
              href={`/jobs/${job.id}/${jobSlug}`}
              className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 hover:border-[#0A66C2]/30 hover:shadow-sm transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#0A66C2] transition-colors truncate">
                  {job.title}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  {/* Location */}
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>

                  {/* Type */}
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {job.type}
                  </span>

                  {/* Remote badge */}
                  {job.remote && (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      <Wifi className="h-3 w-3" />
                      Remote
                    </span>
                  )}

                  {/* Salary */}
                  {job.salary_range && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {job.salary_range}
                    </span>
                  )}
                </div>
              </div>

              {/* Date + arrow */}
              <div className="ml-4 flex flex-shrink-0 flex-col items-end gap-1.5">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {formatDate(job.posted_date)}
                </span>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#0A66C2] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}