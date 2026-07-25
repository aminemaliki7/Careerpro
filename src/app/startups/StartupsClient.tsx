'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search, Filter, X, Check, Loader2, Building2,
  MapPin, Users, Calendar, Briefcase, ChevronLeft, ChevronRight,
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

const FUNDING_COLORS: Record<string, string> = {
  'Pre-Seed': 'bg-gray-100 text-gray-600',
  'Seed':     'bg-green-50 text-green-700',
  'Series A': 'bg-blue-50 text-blue-700',
  'Series B': 'bg-purple-50 text-purple-700',
  'Series C': 'bg-orange-50 text-orange-700',
  'Series D+':'bg-red-50 text-red-700',
  'Acquired': 'bg-yellow-50 text-yellow-700',
  'Public':   'bg-indigo-50 text-indigo-700',
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="flex gap-2 mt-auto">
        <div className="h-6 bg-gray-100 rounded-full w-20" />
        <div className="h-6 bg-gray-100 rounded-full w-16" />
      </div>
    </div>
  );
}

// ─── Startup card ─────────────────────────────────────────────────────────────

function StartupCard({ startup }: { startup: Startup }) {
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
  const fundingClass = FUNDING_COLORS[startup.fundingStage] ?? 'bg-gray-100 text-gray-600';

  return (
    <Link
      href={`/startups/${startup.slug}`}
      className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#0A66C2]/40 hover:shadow-lg hover:shadow-[#0A66C2]/5 transition-all duration-200 h-full"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
          {logoUrl && !imgError ? (
            <Image
              src={logoUrl}
              alt={startup.name}
              width={48}
              height={48}
              className="object-contain w-full h-full"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-lg font-bold text-[#0A66C2]">
              {startup.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h2 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-1 group-hover:text-[#0A66C2] transition-colors">
              {startup.name}
            </h2>
            {startup.featured && (
              <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                ✦ Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[11px] text-gray-500">{startup.industry}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
        {startup.description}
      </p>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {startup.location && (
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
            <MapPin className="w-3 h-3" />
            {startup.location}
          </span>
        )}
        {startup.size && (
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
            <Users className="w-3 h-3" />
            {startup.size}
          </span>
        )}
        {foundedYear && (
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
            <Calendar className="w-3 h-3" />
            {foundedYear}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${fundingClass}`}>
          {startup.fundingStage}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0A66C2] group-hover:gap-2 transition-all">
          <Briefcase className="w-3 h-3" />
          View roles →
        </span>
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

  // Debounced search
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

  // ESC + scroll lock
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
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex gap-2">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search startups by name or description…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] transition-all"
            />
          </div>

          {/* Filter button */}
          <button
            onClick={openModal}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 text-[10px] font-bold bg-[#0A66C2] text-white rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Active tags */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {active.industry && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A66C2]/5 text-[#0A66C2] text-xs rounded-full border border-[#0A66C2]/20">
                {active.industry}
                <button onClick={() => removeTag('industry')} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {active.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A66C2]/5 text-[#0A66C2] text-xs rounded-full border border-[#0A66C2]/20">
                {COUNTRIES.find(c => c.name === active.location)?.flag} {active.location}
                <button onClick={() => removeTag('location')} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Filter Startups</h3>
                  {activeCount > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">{activeCount} active filter{activeCount > 1 ? 's' : ''}</p>
                  )}
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={temp.industry}
                    onChange={(e) => setTemp({ ...temp, industry: e.target.value as IndustryType })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] bg-white appearance-none"
                  >
                    <option value="">All Industries</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={temp.location}
                    onChange={(e) => setTemp({ ...temp, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] bg-white appearance-none"
                  >
                    <option value="">🌍 All Countries</option>
                    {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-5 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
                <button
                  onClick={applyFilters}
                  disabled={!changed}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 bg-[#0A66C2] hover:bg-[#004182] disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
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
    <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-100">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-[#0A66C2] hover:text-[#0A66C2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
            p === page
              ? 'bg-[#0A66C2] text-white'
              : 'border border-gray-200 text-gray-600 hover:border-[#0A66C2] hover:text-[#0A66C2]'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:border-[#0A66C2] hover:text-[#0A66C2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
    // Skip initial fetch if we got SSR data and no filters yet
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
      const params = new URLSearchParams({ page: String(page), limit: '20' });
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

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8">
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Result count */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-6">
          {total > 0 ? (
            <><span className="font-semibold text-gray-900">{total}</span> startup{total > 1 ? 's' : ''} found</>
          ) : 'No startups match your filters'}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Something went wrong</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchStartups}
              className="px-5 py-2.5 bg-[#0A66C2] text-white text-sm font-medium rounded-xl hover:bg-[#004182] transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </motion.div>
        ) : !error && startups.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {startups.map((startup, i) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <StartupCard startup={startup} />
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
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">No startups found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
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