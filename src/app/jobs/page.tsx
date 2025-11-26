'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Job, getJobRegion, formatExperienceLevel, GLOBAL_REGIONS } from '@/types/job';
import { createJobSlug } from '@/lib/utils/format';



// Custom Icons
const GlobeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 919-9" />
  </svg>
);

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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.75m-.75 3h.75m-.75 3h.75m-3.75-16.5h.75m-.75 3h.75m-.75 3h.75m-.75 3h.75" />
  </svg>
);

const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const StarIcon = ({ className, filled = false }: { className: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5Z" />
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

   const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 15;

  useEffect(() => {
    fetchJobs();
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
          <p className="text-lg text-gray-600 mb-6">Discover {jobs.length} career opportunities</p>
          {/* Search */}
          <div className="max-w-2xl mx-auto relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, company or keyword..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border p-4 sticky top-12 space-y-4">
            <h2 className="text-md font-semibold text-gray-900 flex items-center"><FilterIcon className="h-4 w-4 mr-2"/>Filters</h2>
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500">
                <option value="">All types</option>
                {[...new Set(jobs.map(job => job.type))].filter(Boolean).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
              <select value={selectedLocation} onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500">
                <option value="">All cities</option>
                {[...new Set(jobs.map(job => job.location))].filter(Boolean).map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">🌍 Global Region</label>
              <select value={selectedRegion} onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500">
                <option value="">All regions</option>
                {GLOBAL_REGIONS.map(region => <option key={region.value} value={region.value}>{region.label}</option>)}
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select value={selectedExperience} onChange={(e) => { setSelectedExperience(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500">
                <option value="">All levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Expert</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <select value={selectedSalaryRange} onChange={(e) => { setSelectedSalaryRange(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500">
                <option value="">All salaries</option>
                <option value="< 30k">Less than $30k</option>
                <option value="30k - 40k">$30k - $40k</option>
                <option value="40k - 50k">$40k - $50k</option>
                <option value="50k - 60k">$50k - $60k</option>
                <option value="60k - 80k">$60k - $80k</option>
                <option value="80k - 100k">$80k - $100k</option>
                <option value="> 100k">More than $100k</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" checked={remoteOnly} onChange={(e) => { setRemoteOnly(e.target.checked); setCurrentPage(1); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <span className="ml-2">Remote only</span>
              </label>
              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" checked={featuredOnly} onChange={(e) => { setFeaturedOnly(e.target.checked); setCurrentPage(1); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                <span className="ml-2">Featured jobs</span>
              </label>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }} className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500">
                <option value="posted_date">Most recent</option>
                <option value="title">Title A-Z</option>
                <option value="company">Company A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-3 space-y-6">
{paginatedJobs.map((job: Job) => (
  <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
    <div className="p-4 sm:p-6 flex flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.company}</p>
        <div className="flex flex-wrap text-xs text-gray-400 mt-2 gap-2">
          <div className="flex items-center gap-1"><BuildingOfficeIcon className="w-3 h-3"/> {job.type}</div>
          <div className="flex items-center gap-1"><MapPinIcon className="w-3 h-3"/> {job.location}</div>
          <div className="flex items-center gap-1"><ClockIcon className="w-3 h-3"/> {formatDate(job.posted_date)}</div>
        </div>
      </div>

      <div className="flex items-center flex-shrink-0">
        <a
          href={`/jobs/${job.id}/${createJobSlug(job.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
        >
          Apply
        </a>
      </div>
    </div>
  </div>
))}


        {/* Pagination */}
<div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
  <button
    onClick={() => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
      scrollToTop(); // ✅ call the function
    }}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
  >
    Prev
  </button>

  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      onClick={() => {
        setCurrentPage(i + 1);
        scrollToTop(); // ✅ call the function
      }}
      className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
    >
      {i + 1}
    </button>
  ))}

  <button
    onClick={() => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
      scrollToTop(); // ✅ call the function
    }}
    disabled={currentPage === totalPages}
    className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
  >
    Next
  </button>
</div>

        </div>
      </div>
    </div>
  );
}
