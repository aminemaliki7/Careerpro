'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Plus,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import StartupLogo from '@/components/startups/StartupLogo';
import { createJobSlug } from '@/lib/utils/format';
import type { OpportunityCompensationType, StartupOpportunityType } from '@/types/job';
import FounderOpportunityManager from './FounderOpportunityManager';

type StartupStatus = 'pending' | 'approved' | 'rejected';

type PublishedOpportunity = {
  id: string;
  title: string;
  location: string | null;
  type: StartupOpportunityType;
  slug: string | null;
  posted_date: string | null;
  compensation_type: OpportunityCompensationType | null;
  description: string;
  requirements: string[] | null;
  skills: string[] | null;
  remote: boolean;
  salary_range: string | null;
  status: StartupStatus | 'closed';
};

type OwnedStartup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  industry: string | null;
  location: string | null;
  websiteUrl: string | null;
  logoUrl: string;
  status: StartupStatus;
  publishedOpportunityCount: number | null;
  opportunities: PublishedOpportunity[];
};

const statusDetails: Record<StartupStatus, {
  label: string;
  description: string;
  className: string;
  icon: typeof CheckCircle2;
}> = {
  approved: {
    label: 'Approved',
    description: 'Your startup profile is visible in the directory.',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending review',
    description: 'Your submission is being reviewed before publication.',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
    icon: Clock3,
  },
  rejected: {
    label: 'Changes requested',
    description: 'Update your profile and submit it again for review.',
    className: 'border-rose-200 bg-rose-50 text-rose-800',
    icon: XCircle,
  },
};

function getSafeWebsiteUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : null;
  } catch {
    return null;
  }
}

function formatPostedDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function FounderDashboard() {
  const [startups, setStartups] = useState<OwnedStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStartups = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/startups/mine', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to load your startup profiles.');
      }

      setStartups(result.startups ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your startup profiles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStartups();
  }, [loadStartups]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#4F46E5]">Founder workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Your startups
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Manage the startup profiles linked to your account and keep track of their published opportunities.
            </p>
          </div>
          <Link
            href="/startups/submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Showcase a startup
          </Link>
        </div>

        {loading ? (
          <section aria-label="Loading startup profiles" aria-busy="true" className="space-y-4">
            {[0, 1].map((item) => (
              <div key={item} className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-slate-100" />
                  <div className="min-w-0 flex-1 space-y-3 py-1">
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
            <p className="sr-only" role="status">Loading your startup profiles…</p>
          </section>
        ) : error ? (
          <section role="alert" className="rounded-xl border border-rose-200 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div>
                <h2 className="font-semibold text-slate-900">We couldn&apos;t load your dashboard</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadStartups()}
                  className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            </div>
          </section>
        ) : startups.length === 0 ? (
          <section className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center sm:px-10">
            <Building2 className="mx-auto h-9 w-9 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No startup profiles yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Submit a profile to introduce your startup to the Hirely community. Submissions are reviewed before they are published.
            </p>
            <Link
              href="/startups/submit"
              className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Submit your startup
            </Link>
          </section>
        ) : (
          <section aria-label="Your startup profiles" className="space-y-4">
            <p className="text-sm text-slate-600" role="status">
              {startups.length} {startups.length === 1 ? 'startup profile' : 'startup profiles'} linked to your account.
            </p>
            {startups.map((startup) => {
              const status = statusDetails[startup.status] ?? statusDetails.pending;
              const StatusIcon = status.icon;
              const websiteUrl = getSafeWebsiteUrl(startup.websiteUrl);

              return (
                <article key={startup.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <StartupLogo logoUrl={startup.logoUrl} name={startup.name} size="sm" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="break-words text-lg font-semibold text-slate-950">{startup.name}</h2>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{status.description}</p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{startup.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        {startup.industry && <span>{startup.industry}</span>}
                        {startup.location && <span>{startup.location}</span>}
                        {websiteUrl && (
                          <a
                            href={websiteUrl.toString()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-[#4F46E5] hover:text-[#3730A3] hover:underline"
                          >
                            {websiteUrl.host}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <BriefcaseBusiness className="h-4 w-4 text-[#4F46E5]" />
                            Published opportunities
                          </h3>
                          {startup.publishedOpportunityCount !== null ? (
                            <span className="text-sm font-medium text-slate-600">
                              {startup.publishedOpportunityCount}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">Available after approval</span>
                          )}
                        </div>

                            {startup.opportunities.filter((opportunity) => opportunity.status === 'approved').length > 0 ? (
                          <ul className="mt-3 divide-y divide-slate-100">
                                {startup.opportunities.filter((opportunity) => opportunity.status === 'approved').slice(0, 3).map((opportunity) => {
                              const jobSlug = opportunity.slug || createJobSlug(opportunity.title);
                              const postedDate = formatPostedDate(opportunity.posted_date);
                              return (
                                <li key={opportunity.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                                  <Link
                                    href={`/jobs/${opportunity.id}/${jobSlug}`}
                                    className="min-w-0 break-words text-sm font-medium text-slate-800 hover:text-[#4F46E5]"
                                  >
                                    {opportunity.title}
                                  </Link>
                                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                    {opportunity.location && <span>{opportunity.location}</span>}
                                    {postedDate && <span>Posted {postedDate}</span>}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : startup.publishedOpportunityCount === 0 ? (
                          <p className="mt-3 text-sm text-slate-500">No published opportunities for this startup yet.</p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <FounderOpportunityManager
                    startupId={startup.id}
                    startupName={startup.name}
                    startupApproved={startup.status === 'approved'}
                    initialOpportunities={startup.opportunities}
                    onChanged={() => void loadStartups()}
                  />

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    <Link
                      href={`/startups/submit?edit=${encodeURIComponent(startup.slug)}`}
                      className="inline-flex min-h-9 items-center justify-center rounded-lg border border-[#4F46E5]/25 px-3 py-2 text-sm font-semibold text-[#4F46E5] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                    >
                      Edit profile
                    </Link>
                    {startup.status === 'approved' && (
                      <Link
                        href={`/startups/${encodeURIComponent(startup.slug)}`}
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                      >
                        View public profile
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => void loadStartups()}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh profiles
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
