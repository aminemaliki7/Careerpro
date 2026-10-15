'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, useUser } from '@clerk/nextjs';
import {
  Search, Filter, X, Check, Building2,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
} from 'lucide-react';
import type { Startup, IndustryType } from '@/types/startup';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Filters {
  search?: string;
  industry?: IndustryType;
  location?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRIES: IndustryType[] = [
  'AI/ML','FinTech','HealthTech','EdTech','E-commerce',
  'SaaS','Cybersecurity','DevTools','CleanTech','Blockchain','Other',
];

const COUNTRIES = [
  { name: 'Morocco',        flag: '🇲🇦' },
  { name: 'France',         flag: '🇫🇷' },
  { name: 'United States',  flag: '🇺🇸' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Germany',        flag: '🇩🇪' },
  { name: 'UAE',            flag: '🇦🇪' },
  { name: 'Canada',         flag: '🇨🇦' },
  { name: 'Netherlands',    flag: '🇳🇱' },
  { name: 'Spain',          flag: '🇪🇸' },
  { name: 'Tunisia',        flag: '🇹🇳' },
  { name: 'Egypt',          flag: '🇪🇬' },
  { name: 'Senegal',        flag: '🇸🇳' },
];

// flat, text-only funding tags — no colored pill backgrounds (matches TrustMRR's plain-text metric style)
const FUNDING_COLORS: Record<string, string> = {
  'Pre-Seed': 'text-slate-500',
  'Seed':     'text-emerald-600',
  'Series A': 'text-indigo-600',
  'Series B': 'text-purple-600',
  'Series C': 'text-amber-600',
  'Series D+':'text-rose-600',
  'Acquired': 'text-amber-700',
  'Public':   'text-sky-600',
};

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-100 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-slate-100 rounded w-1/3" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
      <div className="hidden sm:block h-3 bg-slate-100 rounded w-16" />
      <div className="h-3 bg-slate-100 rounded w-10" />
    </div>
  );
}

// ─── Startup row ──────────────────────────────────────────────────────────────

function StartupRow({
  startup,
  rank,
  onVoteChanged,
}: {
  startup: Startup;
  rank: number;
  onVoteChanged: () => void;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const [imgError, setImgError] = useState(false);
  const [vote, setVote] = useState<-1 | 0 | 1>(startup.userVote || 0);
  const [voteScore, setVoteScore] = useState(startup.voteScore || 0);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState('');
  const foundedYear = startup.foundedDate
    ? new Date(startup.foundedDate).getFullYear()
    : null;

  const getLogoUrl = (): string | null => {
    const url = startup.logoUrl;
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('logos/'))
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/startup-logos/${url}`;
    if (!url.startsWith('/logos/'))
      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/startup-logos/logos/${url}`;
    return null;
  };

  const logoUrl = getLogoUrl();
  const fundingClass = FUNDING_COLORS[startup.fundingStage] ?? 'text-slate-500';

  useEffect(() => {
    setVote(startup.userVote || 0);
    setVoteScore(startup.voteScore || 0);
  }, [startup.userVote, startup.voteScore]);

  async function submitVote(value: -1 | 1) {
    if (!isSignedIn || isVoting) return;
    setIsVoting(true);
    setVoteError('');

    try {
      const response = await fetch('/api/startups/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: startup.id,
          value: vote === value ? 0 : value,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save vote');

      setVote(result.vote);
      setVoteScore(result.voteScore);
      onVoteChanged();
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : 'Could not save vote');
    } finally {
      setIsVoting(false);
    }
  }

 

function renderVoteButton(
  value: -1 | 1,
  Icon: typeof ChevronUp,
  label: string
) {
  const button = (
    <button
      type="button"
      onClick={() => submitVote(value)}
      disabled={!isLoaded || isVoting}
      aria-label={label}
      aria-pressed={vote === value}
      title={isSignedIn ? label : 'Sign in to vote'}
      className={`flex items-center justify-center
        h-5 w-6 sm:h-5 sm:w-6
        rounded transition-colors
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          vote === value
            ? value === 1
              ? 'text-orange-500'
              : 'text-blue-600'
            : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
        }`}
    >
      <Icon
        className="h-3.5 w-3.5 sm:h-4 sm:w-4"
        strokeWidth={2.5}
      />
    </button>
  );

  return isSignedIn ? button : (
    <SignInButton mode="modal">{button}</SignInButton>
  );
}


  return (
    <div className="-mx-2 flex items-center gap-1.5
  rounded-lg border-b border-slate-100 px-2
  sm:-mx-3 sm:gap-2 sm:px-3
  transition-colors hover:bg-slate-50/70">
      <Link
        href={`/startups/${startup.slug}`}
        className="group flex min-w-0 flex-1 items-center
  gap-2 py-3 sm:gap-4 sm:py-4"
      >
      {/* Rank */}
      <span className="hidden sm:block w-5 text-xs font-mono text-slate-400 flex-shrink-0 text-right">
        {rank}
      </span>

      {/* Logo */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center
  overflow-hidden rounded-lg border border-slate-200 bg-slate-50
  sm:h-10 sm:w-10">
        {logoUrl && !imgError ? (
          <Image
            src={logoUrl}
            alt={startup.name}
            width={40}
            height={40}
            className="object-contain w-full h-full"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm font-bold text-slate-400">
            {startup.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900 leading-tight truncate group-hover:text-slate-600 transition-colors">
            {startup.name}
          </h2>
          {startup.featured && (
            <span className="flex-shrink-0 text-[10px] font-semibold text-amber-600">
              ★ Featured
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {startup.description}
        </p>
      </div>

      {/* Meta: industry / location / founded — plain text, mono-ish, no pill chrome */}
      <div className="hidden md:flex flex-col items-end gap-0.5 text-right w-28 flex-shrink-0">
        <span className="text-xs text-slate-600">{startup.industry}</span>
        <span className="text-[11px] text-slate-400 truncate max-w-full">
          {[startup.location, foundedYear].filter(Boolean).join(' · ')}
        </span>
      </div>

      {/* Funding stage */}
      <div className="hidden sm:block w-20 flex-shrink-0 text-right">
        <span className={`text-xs font-semibold ${fundingClass}`}>
          {startup.fundingStage}
        </span>
      </div>

      {/* Open roles — the "metric" column, TrustMRR-style */}
      {Boolean(startup.jobCount) && (
        <div className="w-16 flex-shrink-0 text-right">
          <span className="text-sm font-mono font-semibold text-slate-900">
            {startup.jobCount}
          </span>
          <span className="block text-[10px] text-slate-400 -mt-0.5">roles</span>
        </div>
      )}
      </Link>

      <div
  className="flex flex-shrink-0 flex-col items-center justify-center
    gap-0 rounded-md bg-slate-50 px-0 py-0"
  title={voteError || 'Community votes'}
>
  {renderVoteButton(1, ChevronUp, 'Upvote startup')}

  <span
    className={`min-w-0 px-0.5 text-center text-[10px]
      leading-3 font-bold tabular-nums sm:text-[11px] sm:leading-4 ${
        vote > 0
          ? 'text-orange-500'
          : vote < 0
            ? 'text-blue-600'
            : 'text-slate-600'
      }`}
  >
    {voteScore}
  </span>

  {renderVoteButton(-1, ChevronDown, 'Downvote startup')}
</div>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  onFilterChange,
}: {
  onFilterChange: (f: Filters) => void;
}) {
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [active, setActive]           = useState<Filters>({});
  const [temp, setTemp]               = useState({ industry: '' as IndustryType | '', location: '' });
  const timerRef                      = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const next = { ...active, search: search || undefined };
      setActive(next);
      onFilterChange(next);
    }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false); };
    if (showModal) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const activeCount = [active.industry, active.location].filter(Boolean).length;

  function openModal() {
    setTemp({ industry: active.industry || '', location: active.location || '' });
    setShowModal(true);
  }

  function applyFilters() {
    const next: Filters = {
      search: active.search,
      industry:  temp.industry  || undefined,
      location:  temp.location  || undefined,
    };
    setActive(next);
    onFilterChange(next);
    setShowModal(false);
  }

  function clearFilters() {
    setTemp({ industry: '', location: '' });
    const next: Filters = { search: active.search };
    setActive(next);
    onFilterChange(next);
    setShowModal(false);
  }

  function removeTag(key: keyof Filters) {
    const next = { ...active };
    delete next[key];
    setActive(next);
    onFilterChange(next);
  }

  const changed =
    temp.industry !== (active.industry || '') ||
    temp.location !== (active.location || '');

  return (
    <>
      <div className="flex gap-2 border-b border-slate-200 pb-4">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
          />
        </div>

        {/* Filter button */}
        <button
          onClick={openModal}
          aria-expanded={showModal}
          aria-haspopup="dialog"
          className={`relative flex h-10 flex-shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
            activeCount > 0
              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-50'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Filter className="h-4 w-4 text-current" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-3">
          {active.industry && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800">
              {active.industry}
              <button aria-label={`Remove ${active.industry} filter`} onClick={() => removeTag('industry')} className="transition-colors hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {active.location && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800">
              {COUNTRIES.find(c => c.name === active.location)?.flag} {active.location}
              <button aria-label={`Remove ${active.location} filter`} onClick={() => removeTag('location')} className="transition-colors hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-slate-900/40 backdrop-blur-sm"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="startup-filter-title"
              className="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-xl sm:max-w-md sm:rounded-xl"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 id="startup-filter-title" className="text-base font-semibold text-slate-900">Filter companies</h3>
                  {activeCount > 0 && (
                    <p className="mt-0.5 text-xs text-slate-500">{activeCount} active filter{activeCount > 1 ? 's' : ''}</p>
                  )}
                </div>
                <button aria-label="Close filters" onClick={() => setShowModal(false)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Industry</label>
                  <div className="relative">
                    <select
                      value={temp.industry}
                      onChange={(e) => setTemp({ ...temp, industry: e.target.value as IndustryType })}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                    >
                      <option value="">All industries</option>
                      {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Country</label>
                  <div className="relative">
                    <select
                      value={temp.location}
                      onChange={(e) => setTemp({ ...temp, location: e.target.value })}
                      className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 transition-colors hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
                    >
                      <option value="">All countries</option>
                      {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                    </select>
                    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-slate-100 bg-slate-50/60 p-5">
                <button
                  onClick={clearFilters}
                  className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
                <button
                  onClick={applyFilters}
                  disabled={!changed}
                  className="flex min-h-10 flex-[2] items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <Check className="w-4 h-4" /> Apply filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-100">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium font-mono transition-all ${
            p === page
              ? 'bg-slate-900 text-white'
              : 'border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StartupsClient({
  initialStartups = [],
  initialTotal = 0,
  initialTotalPages = 1,
}: {
  initialStartups?: Startup[];
  initialTotal?: number;
  initialTotalPages?: number;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const [startups, setStartups]       = useState<Startup[]>(initialStartups);
  const [total, setTotal]             = useState(initialTotal);
  const [totalPages, setTotalPages]   = useState(initialTotalPages);
  const [page, setPage]               = useState(1);
  const [filters, setFilters]         = useState<Filters>({});
  const [loading, setLoading]         = useState(initialStartups.length === 0);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (initialStartups.length > 0 && page === 1 && Object.keys(filters).length === 0) {
      setLoading(false);
      void fetchStartups(false);
      return;
    }
    fetchStartups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, isLoaded, isSignedIn]);

  async function fetchStartups(showLoading = true) {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '18' });
      if (filters.industry)  params.append('industry',  filters.industry);
      if (filters.location)  params.append('location',  filters.location);
      if (filters.search)    params.append('search',    filters.search);

      const res  = await fetch(`/api/startups?${params}`);
      if (!res.ok) throw new Error('Failed to fetch startups');
      const data = await res.json();

      setStartups(data.startups);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  function handleFilterChange(f: Filters) {
    setFilters(f);
    setPage(1);
  }

  function handlePageChange(p: number) {
    setPage(p);
    document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const startRank = (page - 1) * 18 + 1;
  const refreshAfterVote = () => fetchStartups(false);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-6">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">
          {total > 0 ? (
            <>{total} compan{total > 1 ? 'ies' : 'y'} found</>
          ) : 'No companies match your filters'}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-1">Something went wrong</p>
            <p className="text-sm text-slate-500 mb-4">{error}</p>
            <button
              onClick={() => fetchStartups()}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
          </motion.div>
        ) : !error && startups.length > 0 ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {startups.map((startup, i) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
              >
                <StartupRow
                  startup={startup}
                  rank={startRank + i}
                  onVoteChanged={refreshAfterVote}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : !error && !loading && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-1">No companies found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      )}
    </div>
  );
}