'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Filter, X, Check, Building2,
  ChevronLeft, ChevronRight,
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

function StartupRow({ startup, rank }: { startup: Startup; rank: number }) {
  const [imgError, setImgError] = useState(false);
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

  return (
    <Link
      href={`/startups/${startup.slug}`}
      className="group flex items-center gap-4 py-4 border-b border-slate-100 hover:bg-slate-50/70 transition-colors -mx-3 px-3 rounded-lg"
    >
      {/* Rank */}
      <span className="hidden sm:block w-5 text-xs font-mono text-slate-400 flex-shrink-0 text-right">
        {rank}
      </span>

      {/* Logo */}
      <div className="w-10 h-10 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
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
      <div className="w-16 flex-shrink-0 text-right">
        <span className="text-sm font-mono font-semibold text-slate-900">
          {startup.jobCount}
        </span>
        <span className="block text-[10px] text-slate-400 -mt-0.5">roles</span>
      </div>
    </Link>
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
      <div className="flex gap-2 pb-4 border-b border-slate-200">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filter button */}
        <button
          onClick={openModal}
          className="relative flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-all"
        >
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Filters</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-bold bg-slate-900 text-white rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Active tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-3">
          {active.industry && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
              {active.industry}
              <button onClick={() => removeTag('industry')} className="hover:text-rose-600 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {active.location && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
              {COUNTRIES.find(c => c.name === active.location)?.flag} {active.location}
              <button onClick={() => removeTag('location')} className="hover:text-rose-600 transition-colors">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-xl flex flex-col overflow-hidden"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Filter Companies</h3>
                  {activeCount > 0 && (
                    <p className="text-xs text-slate-500 mt-0.5">{activeCount} active filter{activeCount > 1 ? 's' : ''}</p>
                  )}
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                  <select
                    value={temp.industry}
                    onChange={(e) => setTemp({ ...temp, industry: e.target.value as IndustryType })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white appearance-none text-slate-900"
                  >
                    <option value="">All Industries</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <select
                    value={temp.location}
                    onChange={(e) => setTemp({ ...temp, location: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white appearance-none text-slate-900"
                  >
                    <option value="">🌍 All Countries</option>
                    {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 p-5 border-t border-slate-100">
                <button
                  onClick={clearFilters}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
                <button
                  onClick={applyFilters}
                  disabled={!changed}
                  className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all"
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
  const [startups, setStartups]       = useState<Startup[]>(initialStartups);
  const [total, setTotal]             = useState(initialTotal);
  const [totalPages, setTotalPages]   = useState(initialTotalPages);
  const [page, setPage]               = useState(1);
  const [filters, setFilters]         = useState<Filters>({});
  const [loading, setLoading]         = useState(initialStartups.length === 0);
  const [error, setError]             = useState<string | null>(null);

  useEffect(() => {
    if (initialStartups.length > 0 && page === 1 && Object.keys(filters).length === 0) {
      setLoading(false);
      return;
    }
    fetchStartups();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  async function fetchStartups() {
    setLoading(true);
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
      setLoading(false);
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
              onClick={fetchStartups}
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
                <StartupRow startup={startup} rank={startRank + i} />
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