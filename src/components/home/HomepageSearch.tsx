'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import StartupLogo from '@/components/startups/StartupLogo';
import type { Startup } from '@/types/startup';
import type { HomepageOpportunity } from '@/components/home/HirelyHomepage';

type SearchStartup = Pick<
  Startup,
  'id' | 'name' | 'slug' | 'description' | 'industry' | 'location' | 'logoUrl'
>;

export default function HomepageSearch({
  industries,
  opportunities,
}: {
  industries: string[];
  opportunities: HomepageOpportunity[];
}) {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const [results, setResults] = useState<SearchStartup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const searchTerm = query.trim().toLocaleLowerCase();
  const opportunityMatches = searchTerm
    ? opportunities.filter((opportunity) => [
        opportunity.title,
        opportunity.type,
        opportunity.location,
        opportunity.startup.name,
      ].some((value) => value?.toLocaleLowerCase().includes(searchTerm))).slice(0, 3)
    : [];

  useEffect(() => {
    const search = query.trim();
    if (!search && !industry) {
      setResults([]);
      setError('');
      setLoading(false);
      return;
    }

    const currentRequestId = ++requestId.current;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({ limit: '5' });
      if (search) params.set('search', search);
      if (industry) params.set('industry', industry);

      try {
        const response = await fetch(`/api/startups?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Unable to search startups right now.');
        const data = (await response.json()) as { startups: SearchStartup[] };

        if (requestId.current === currentRequestId) {
          setResults(data.startups);
        }
      } catch (searchError) {
        if (searchError instanceof Error && searchError.name === 'AbortError') return;
        if (requestId.current === currentRequestId) {
          setResults([]);
          setError(
            searchError instanceof Error
              ? searchError.message
              : 'Unable to search startups right now.'
          );
        }
      } finally {
        if (requestId.current === currentRequestId) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [industry, query]);

  function chooseIndustry(value: string) {
    setIndustry((current) => current === value ? '' : value);
    setQuery('');
  }

  return (
    <div className="relative max-w-3xl">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-2 shadow-sm transition-shadow focus-within:border-[#4F46E5] focus-within:ring-4 focus-within:ring-blue-100"
      >
        <Search className="ml-2 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
        <label htmlFor="homepage-startup-search" className="sr-only">
          Search startups, industries, opportunities
        </label>
        <input
          id="homepage-startup-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIndustry('');
          }}
          placeholder="Search startups, industries, opportunities..."
          autoComplete="off"
          aria-controls="homepage-search-results"
          aria-busy={loading}
          className="h-10 min-w-0 flex-1 bg-transparent px-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
        />
        <button
          type="submit"
          aria-label="Search startups"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
        >
          <span className="hidden sm:inline">Search</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-slate-500">Explore:</span>
        {industries.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={industry === item}
            onClick={() => chooseIndustry(item)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 ${
              industry === item
                ? 'border-blue-200 bg-blue-50 text-[#3730A3]'
                : 'border-slate-200 bg-white/80 text-slate-600 hover:border-blue-200 hover:text-[#3730A3]'
            }`}
          >
            {item}
          </button>
        ))}
        {industries.length === 0 && (
          <Link
            href="/startups"
            className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-200 hover:text-[#3730A3]"
          >
            Browse startup categories
          </Link>
        )}
      </div>

      {(query.trim() || industry) && (
        <div
          id="homepage-search-results"
          aria-live="polite"
          className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700">
              {industry ? `${industry} startups` : 'Search results'}
            </p>
            {loading && <span className="text-xs text-slate-500">Searching...</span>}
          </div>
          {error ? (
            <p role="alert" className="px-4 py-4 text-sm text-rose-700">{error}</p>
          ) : !loading && results.length === 0 && opportunityMatches.length === 0 ? (
            <p className="px-4 py-4 text-sm text-slate-600">
              No matching approved startups or recent opportunities found. Try another search or browse the directory.
            </p>
          ) : (
            <div>
              {results.length > 0 && (
                <ul className="divide-y divide-slate-100">
                  {results.map((startup) => (
                    <li key={startup.id}>
                      <Link
                        href={`/startups/${encodeURIComponent(startup.slug)}`}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                      >
                        <StartupLogo
                          logoUrl={startup.logoUrl}
                          name={startup.name}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900">
                            {startup.name}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-slate-500">
                            {[startup.industry, startup.location].filter(Boolean).join(' · ') ||
                              startup.description}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {opportunityMatches.length > 0 && (
                <div className="border-t border-slate-100">
                  <p className="px-4 pb-1 pt-3 text-xs font-semibold text-slate-500">
                    Recent opportunity matches
                  </p>
                  <ul className="divide-y divide-slate-100">
                    {opportunityMatches.map((opportunity) => (
                      <li key={opportunity.id}>
                        <Link
                          href={`/jobs/${opportunity.id}/${encodeURIComponent(opportunity.slug)}`}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                        >
                          <StartupLogo
                            logoUrl={opportunity.startup.logo_url ?? undefined}
                            name={opportunity.startup.name}
                            size="sm"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-slate-900">
                              {opportunity.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-slate-500">
                              {opportunity.startup.name}
                              {opportunity.type ? ` · ${opportunity.type}` : ''}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-5 border-t border-slate-100 px-4 py-3">
            <Link
              href="/startups"
              className="text-sm font-semibold text-[#4F46E5] hover:text-[#3730A3]"
            >
              Browse all startups
            </Link>
            {!industry && (
              <Link
                href="/jobs"
                className="text-sm font-semibold text-[#4F46E5] hover:text-[#3730A3]"
              >
                Explore all opportunities
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
