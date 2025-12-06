// app/startups/StartupsClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartupCard from '@/components/startups/StartupCard';
import StartupFilters from '@/components/startups/StartupFilters';
import { Startup, StartupFilters as Filters } from '@/types/startup';
import { Loader2, TrendingUp, Sparkles, Building2 } from 'lucide-react';

export default function StartupsClient() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    fetchStartups();
  }, [page, filters]);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (filters.industry) params.append('industry', filters.industry);
      if (filters.size) params.append('size', filters.size);
      if (filters.fundingStage) params.append('fundingStage', filters.fundingStage);
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/startups?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch startups');
      }

      const data = await response.json();
      setStartups(data.startups);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-semibold text-lg mb-2">Error loading startups</p>
          <p className="text-red-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchStartups}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header with Badge */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-x-1.5 px-4 py-1.5 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Discover Innovative Startups
        </span>
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-gray-900">
          Explore <span className="text-[#0A66C2]">Tech Startups</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse curated startups across industries, funding stages, and locations
        </p>
      </motion.div>

      <StartupFilters onFilterChange={handleFilterChange} />

      {/* Results Stats with Enhanced Design */}
      <motion.div 
        className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0A66C2] rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="block text-2xl font-bold text-gray-900">
              {loading ? '...' : total.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              {total === 1 ? 'Startup Found' : 'Startups Found'}
            </span>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </p>
            <p className="text-xs text-gray-500">
              {((page - 1) * 20 + 1).toLocaleString()} - {Math.min(page * 20, total).toLocaleString()} results
            </p>
          </div>
        )}
      </motion.div>

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            className="flex flex-col justify-center items-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#0A66C2]/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#0A66C2]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              
              <Loader2 className="w-12 h-12 text-[#0A66C2] animate-spin relative" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading startups...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Startups Grid */}
            {startups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {startups.map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <StartupCard startup={startup} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">No startups found</p>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your filters or search query to discover more opportunities
                  </p>
                  <button
                    onClick={() => handleFilterChange({})}
                    className="px-6 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div 
                className="flex justify-center items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-[#0A66C2] hover:text-[#0A66C2] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-inherit transition-all duration-300"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <motion.button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-11 h-11 rounded-lg font-medium transition-all duration-300 ${
                          page === pageNum
                            ? 'bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/30'
                            : 'border border-gray-300 hover:bg-gray-50 hover:border-[#0A66C2] hover:text-[#0A66C2]'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-[#0A66C2] hover:text-[#0A66C2] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-inherit transition-all duration-300"
                >
                  Next
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}