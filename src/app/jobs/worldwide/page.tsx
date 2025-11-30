'use client';

import { useState, useCallback } from 'react';
import { CareerjetJob, formatCareerjetSalary, parseCareerjetDate } from '@/types/careerjet';
import Link from 'next/link';

// Custom Icons
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

const GlobeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const ArrowTopRightIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export default function WorldwideJobsPage() {
  const [jobs, setJobs] = useState<CareerjetJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalHits, setTotalHits] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Location selection state
  const [locationChoices, setLocationChoices] = useState<string[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Search params
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const searchJobs = async (selectedLocation?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        sort: sortBy,
      });

      if (keywords) params.append('keywords', keywords);
      if (selectedLocation || location) params.append('location', selectedLocation || location);
      if (contractType) params.append('contract_type', contractType);
      if (workHours) params.append('work_hours', workHours);

      const response = await fetch(`/api/jobs/external?${params.toString()}`);
      const data = await response.json();

      if (data.type === 'JOBS') {
        setJobs(data.jobs);
        setTotalHits(data.hits);
        setTotalPages(data.pages);
        setLocationChoices([]);
        setShowLocationModal(false);
      } else if (data.type === 'LOCATIONS') {
        setLocationChoices(data.locations);
        setShowLocationModal(true);
        setJobs([]);
      } else if (data.type === 'ERROR') {
        setError(data.message);
        setJobs([]);
      }
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    searchJobs();
  };

  const handleLocationSelect = (selectedLoc: string) => {
    searchJobs(selectedLoc);
  };

  const formatDate = (dateString: string) => {
    const date = parseCareerjetDate(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <GlobeIcon className="h-10 w-10 text-blue-600" />
                Worldwide Jobs
              </h1>
              <p className="text-lg text-gray-600">
                {totalHits > 0 ? `${totalHits.toLocaleString()} opportunities found` : 'Search jobs worldwide'}
              </p>
            </div>
            <Link
              href="/jobs"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Morocco Jobs →
            </Link>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Keywords (e.g. Software Engineer)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location (e.g. London, Paris)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border p-4 sticky top-12 space-y-4">
            <h2 className="text-md font-semibold text-gray-900 flex items-center">
              <FilterIcon className="h-4 w-4 mr-2"/>Filters
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
              <select 
                value={contractType} 
                onChange={(e) => setContractType(e.target.value)} 
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All types</option>
                <option value="p">Permanent</option>
                <option value="c">Contract</option>
                <option value="t">Temporary</option>
                <option value="i">Internship</option>
                <option value="v">Volunteer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Hours</label>
              <select 
                value={workHours} 
                onChange={(e) => setWorkHours(e.target.value)} 
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All hours</option>
                <option value="f">Full-time</option>
                <option value="p">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'salary')} 
                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Most Recent</option>
                <option value="salary">Salary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className="bg-white rounded-lg border p-12 text-center">
              <GlobeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Start your search to discover jobs worldwide</p>
            </div>
          )}

          {jobs.map((job, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    
                    <div className="flex flex-wrap text-xs text-gray-400 mt-2 gap-2">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3"/> {job.locations}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3"/> {formatDate(job.date)}
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1 text-green-600 font-medium">
                          💰 {formatCareerjetSalary(job) || job.salary}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex items-center flex-shrink-0">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap flex items-center gap-2"
                    >
                      Apply <ArrowTopRightIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  scrollToTop();
                  searchJobs();
                }}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  scrollToTop();
                  searchJobs();
                }}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Location Selection Modal */}
      {showLocationModal && locationChoices.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Select a location</h3>
            <p className="text-sm text-gray-600 mb-4">Multiple locations found. Please choose one:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {locationChoices.map((loc, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(loc)}
                  className="w-full text-left px-4 py-2 border rounded hover:bg-blue-50 hover:border-blue-500 transition"
                >
                  {loc}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowLocationModal(false);
                setLocationChoices([]);
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}