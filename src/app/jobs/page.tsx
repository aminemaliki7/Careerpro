'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Job, getJobRegion, GLOBAL_REGIONS } from '@/types/job';
import { createJobSlug } from '@/lib/utils/format';
import HirelyLogo from '@/components/ui/CircuitLogo';
import BookmarkButton from '@/components/jobs/BookmarkButton';
import EasyApplyButton from '@/components/jobs/EasyApplyButton';
import { Startup } from '@/types/startup';



// Icons
const SearchIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const FilterIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
  </svg>
);

const MapPinIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const BuildingOfficeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.75m-.75 3h.75m-.75 3h.75m-3.75-16.5h.75m-.75 3h.75m-.75 3h.75" />
  </svg>
);

const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const RocketIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.24a6 6 0 0 0-2.12 4.13h4.13a6 6 0 0 0 4.13-2.12" />
  </svg>
);

const SparklesIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('posted_date');

  const [startups, setStartups] = useState<Startup[]>([]);
const [startupsLoading, setStartupsLoading] = useState(true);

  const fetchStartups = async () => {
  try {
    setStartupsLoading(true);

    const response = await fetch('/api/startups?limit=20');

    if (!response.ok) {
      throw new Error('Failed to fetch startups');
    }

    const data = await response.json();

    // Use the latest startups returned by the existing API
    setStartups((data.startups || []).slice(0, 4));
  } catch (error) {
    console.error('Error fetching startups:', error);
    setStartups([]);
  } finally {
    setStartupsLoading(false);
  }
};

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  useEffect(() => {
    fetchJobs();
  fetchStartups();

  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'approved')
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      setError('Error loading job listings');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === '' || job.type === selectedType;
      const matchesLocation = selectedLocation === '' || job.location === selectedLocation;
      const matchesRegion = selectedRegion === '' || getJobRegion(job.location) === selectedRegion;
      const matchesExperience = selectedExperience === '' || job.experience_level === selectedExperience;
      const matchesSalary = selectedSalaryRange === '' || job.salary_range === selectedSalaryRange;
      const matchesRemote = !remoteOnly || job.remote;
      const matchesFeatured = !featuredOnly || job.featured;

      return matchesSearch && matchesType && matchesLocation && matchesRegion && matchesExperience && matchesSalary && matchesRemote && matchesFeatured;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'posted_date') return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      return 0;
    });

    return filtered;
  }, [jobs, searchTerm, selectedType, selectedLocation, selectedRegion, selectedExperience, selectedSalaryRange, remoteOnly, featuredOnly, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage;
    return filteredAndSortedJobs.slice(start, start + jobsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <HirelyLogo size="lg" />
        <span className="mt-4 text-sm text-gray-500 font-medium">Loading opportunities...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-medium">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 3-Column Dashboard Layout with Sticky Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"> 

        {/* GRID 1: Sticky Filters Sidebar (Span 3) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-6">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-3.5 backdrop-blur-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <h2 className="text-xs font-bold text-gray-900 tracking-wide uppercase flex items-center gap-1.5">
                <FilterIcon className="h-3.5 w-3.5 text-blue-600" />
                Filters
              </h2>
              <button 
                onClick={() => {
                  setSelectedType('');
                  setSelectedLocation('');
                  setSelectedRegion('');
                  setSelectedExperience('');
                  setSelectedSalaryRange('');
                  setRemoteOnly(false);
                  setFeaturedOnly(false);
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="text-[11px] text-gray-400 hover:text-blue-600 font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search title, tech, company..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50/80 border border-gray-200/80 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Sort & Job Type Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Sort By</label>
                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} 
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 text-gray-700 rounded-lg pr-7 pl-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all truncate"
                  >
                    <option value="posted_date">Most recent</option>
                    <option value="title">Title A-Z</option>
                    <option value="company">Company A-Z</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Job Type</label>
                <div className="relative">
                  <select 
                    value={selectedType} 
                    onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }} 
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 text-gray-700 rounded-lg pr-7 pl-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all truncate"
                  >
                    <option value="">All Types</option>
                    {[...new Set(jobs.map(job => job.type))].filter(Boolean).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Location & Region Grid */}
        <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Location</label>
                <div className="relative">
                  <select 
                    value={selectedLocation} 
                    onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }} 
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 text-gray-700 rounded-lg pr-7 pl-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all truncate"
                  >
                    <option value="">All Cities</option>
                    {[...new Set(jobs.map(job => job.location))]
                      .filter((loc): loc is string => Boolean(loc))
                      .map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Region</label>
                <div className="relative">
                  <select 
                    value={selectedRegion} 
                    onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }} 
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 text-gray-700 rounded-lg pr-7 pl-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all truncate"
                  >
                    <option value="">All Regions</option>
                    {GLOBAL_REGIONS.map(region => (
                      <option key={region.value} value={region.value}>{region.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Experience & Salary Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Experience</label>
                <div className="relative">
                  <select 
                    value={selectedExperience} 
                    onChange={(e) => { setSelectedExperience(e.target.value); setCurrentPage(1); }} 
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 text-gray-700 rounded-lg pr-7 pl-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all truncate"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Expert</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Salary</label>
                <div className="relative">
                  <select 
                    value={selectedSalaryRange} 
                    onChange={(e) => { setSelectedSalaryRange(e.target.value); setCurrentPage(1); }} 
                    className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 text-gray-700 rounded-lg pr-7 pl-2.5 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all truncate"
                  >
                    <option value="">All Salaries</option>
                    <option value="< 30k">&lt; $30k</option>
                    <option value="30k - 40k">$30k - $40k</option>
                    <option value="40k - 50k">$40k - $50k</option>
                    <option value="50k - 60k">$50k - $60k</option>
                    <option value="60k - 80k">$60k - $80k</option>
                    <option value="80k - 100k">$80k - $100k</option>
                    <option value="> 100k">&gt; $100k</option>
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="pt-2.5 border-t border-gray-100/80 space-y-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remote Only</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={remoteOnly}
                  onClick={() => { setRemoteOnly(!remoteOnly); setCurrentPage(1); }}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    remoteOnly ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      remoteOnly ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Featured Jobs</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={featuredOnly}
                  onClick={() => { setFeaturedOnly(!featuredOnly); setCurrentPage(1); }}
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    featuredOnly ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      featuredOnly ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>

        {/* GRID 2: Main Content Feed (Span 6) */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 px-1">
            <span>Showing {filteredAndSortedJobs.length} {filteredAndSortedJobs.length === 1 ? 'Job' : 'Jobs'}</span>
            <span>Page {currentPage} of {totalPages || 1}</span>
          </div>

          {paginatedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 shadow-xs">
              No matching opportunities found. Try adjusting your filter parameters.
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedJobs.map((job: Job) => {
                const jobHref = `/jobs/${job.id}/${createJobSlug(job.title)}`;

                return (
                  <div 
                    key={job.id} 
                    className="bg-white rounded-xl border border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-md transition-all duration-150 p-4 flex flex-col justify-between"
                  >
                    <Link href={jobHref} className="block space-y-2 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <p className="text-xs font-medium text-gray-500">{job.company}</p>
                        </div>
                        {job.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1.5 truncate">
                          <BuildingOfficeIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" /> 
                          <span className="truncate">{job.type}</span>
                        </span>
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" /> 
                          <span className="truncate">{job.location}</span>
                        </span>
                      </div>
                    </Link>

                    <div className="pt-3 mt-3 border-t border-gray-100/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <ClockIcon className="w-3 h-3" /> 
                          {formatDate(job.posted_date)}
                        </span>
                        {job.remote && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                            Remote
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <BookmarkButton jobId={job.id} />
                        <EasyApplyButton
                          jobId={job.id}
                          jobTitle={job.title}
                          company={job.company}
                          description={job.description}
                          requirements={job.requirements}
                          contactEmail={job.contact_email}
                          skills={job.skills}
                          location={job.location ?? ''}
                          salaryRange={job.salary_range}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compact Pagination (Prev and Next only) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-2 pb-2">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  scrollToTop();
                }}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  scrollToTop();
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* GRID 3: Sticky Spotlight Sidebar (Span 3) */}
<div className="hidden lg:block lg:col-span-3 sticky top-6">
  <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-4">

    {/* Header */}
    <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
      <h2 className="text-xs font-bold text-gray-900 tracking-wide uppercase flex items-center gap-1.5">
        <RocketIcon className="h-3.5 w-3.5 text-blue-600" />
        Latest Companies
      </h2>

      <Link
        href="/startups"
        className="text-[11px] text-blue-600 hover:underline font-medium"
      >
        View all
      </Link>
    </div>

  <div className="space-y-3">
  {startupsLoading ? (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 p-2 rounded-xl animate-pulse"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-2 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ))}
    </>
  ) : startups.length > 0 ? (
    startups.map((startup) => (
      <Link
        key={startup.id}
        href={`/startups/${startup.slug}`}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200/60"
      >
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {startup.logoUrl ? (
            <img
              src={startup.logoUrl}
              alt={`${startup.name} logo`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-xs font-bold text-blue-600">
              {startup.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Company information */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {startup.name}
          </p>

          <p className="text-[10px] text-gray-500 truncate">
            {startup.description}
          </p>
        </div>
      </Link>
    ))
  ) : (
    <div className="py-4 text-center">
      <p className="text-[11px] text-gray-400">
        No companies available yet.
      </p>
    </div>
  )}
</div> 

    {/* Trending Stacks */}
    <div className="pt-3 border-t border-gray-100/80 space-y-2">
      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
        <SparklesIcon className="w-3 h-3 text-amber-500" />
        Trending Stacks
      </div>

      <div className="flex flex-wrap gap-1.5">
        {['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Python'].map((tech) => (
          <button
            key={tech}
            onClick={() => {
              setSearchTerm(tech);
              setCurrentPage(1);
            }}
            className="px-2 py-0.5 bg-gray-50 border border-gray-200/80 rounded-md text-[10px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer"
          >
            {tech}
          </button>
        ))}
      </div>
    </div>

  </div>
</div>

      </div>
    </div>
  );
}