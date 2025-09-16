// src/app/jobs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  Briefcase,
  Building,
  Users,
  ChevronDown,
  X
} from 'lucide-react';
import { searchJobs, getUniqueValues } from '@/lib/jobs';
import { Job, JobFilters } from '@/types/job';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const uniqueValues = getUniqueValues();

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, filters, page]);

  const fetchJobs = () => {
    setLoading(true);
    const result = searchJobs({
      query: searchQuery,
      filters,
      page,
      limit: 12,
      sortBy: 'relevance'
    });
    setJobs(result.jobs);
    setTotal(result.total);
    setLoading(false);
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  const clearFilter = (key: keyof JobFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  const formatSalary = (min: number, max: number, currency: string = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (min === max) {
      return formatter.format(min);
    }
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Next <span className="text-blue-600">Opportunity</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Hand-picked job opportunities from top tech companies worldwide
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Active Filters */}
              {Object.keys(filters).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value || (Array.isArray(value) && value.length === 0)) return null;
                      
                      const displayValue = Array.isArray(value) ? value.join(', ') : 
                                         typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                                         String(value);
                      
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {key}: {displayValue}
                          <button
                            onClick={() => clearFilter(key as keyof JobFilters)}
                            className="hover:text-blue-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Job Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Job Type</h3>
                <div className="space-y-2">
                  {uniqueValues.types.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type) || false}
                        onChange={(e) => {
                          const currentTypes = filters.type || [];
                          if (e.target.checked) {
                            handleFilterChange('type', [...currentTypes, type]);
                          } else {
                            handleFilterChange('type', currentTypes.filter(t => t !== type));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Experience Level</h3>
                <div className="space-y-2">
                  {uniqueValues.experienceLevels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.experienceLevel?.includes(level) || false}
                        onChange={(e) => {
                          const currentLevels = filters.experienceLevel || [];
                          if (e.target.checked) {
                            handleFilterChange('experienceLevel', [...currentLevels, level]);
                          } else {
                            handleFilterChange('experienceLevel', currentLevels.filter(l => l !== level));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Department Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Department</h3>
                <div className="space-y-2">
                  {uniqueValues.departments.map((dept) => (
                    <label key={dept} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.department?.includes(dept) || false}
                        onChange={(e) => {
                          const currentDepts = filters.department || [];
                          if (e.target.checked) {
                            handleFilterChange('department', [...currentDepts, dept]);
                          } else {
                            handleFilterChange('department', currentDepts.filter(d => d !== dept));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Work Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Work Arrangement</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.remote === true}
                    onChange={(e) => handleFilterChange('remote', e.target.checked ? true : undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remote Work Available</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Job Listings */}
          <main className="flex-1">
            
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Job Opportunities</h2>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${total} jobs found`}
                </p>
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
                  <button
                    onClick={clearAllFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {job.logo && (
                            <img 
                              src={job.logo} 
                              alt={`${job.company} logo`} 
                              className="w-12 h-12 rounded-lg object-contain flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-blue-600 font-semibold text-lg">
                                {job.company}
                              </span>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.type}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {job.experienceLevel}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {job.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 5 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                                  +{job.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 text-right flex-shrink-0">
                        {job.salary && (
                          <div className="text-green-600 font-semibold mb-2">
                            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                            {job.salary.period && <div className="text-sm text-gray-500">/ {job.salary.period}</div>}
                          </div>
                        )}
                        <div className="text-sm text-gray-500 mb-3">
                          Posted {formatDate(job.postedDate)}
                        </div>
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          page === pageNum
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
  );
}