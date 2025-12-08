'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartupCard from '@/components/startups/StartupCard';
import StartupFilters from '@/components/startups/StartupFilters';
import { Startup, StartupFilters as Filters } from '@/types/startup';
import { Loader2, Search } from 'lucide-react';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const contentTop = document.getElementById('browse')?.offsetTop || 0;
    window.scrollTo({ top: contentTop - 50, behavior: 'smooth' }); 
  };

  if (error) {
    return (
      <motion.div 
        // FIX: Ensure white background is kept in dark mode
        className="min-h-[60vh] flex items-center justify-center py-8 sm:py-12 !bg-white dark:!bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0A66C2] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-white text-xl sm:text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold !text-gray-900 mb-2 sm:mb-3">Something went wrong</h2>
          <p className="text-sm sm:text-base !text-gray-600 mb-6 sm:mb-8">{error}</p>
          <button
            onClick={fetchStartups}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#0A66C2] text-white rounded-lg font-medium hover:bg-[#004182] active:bg-[#003366] transition-colors shadow-lg shadow-[#0A66C2]/20"
          >
            Try again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    // FIX: Main container background fixed to white in all modes
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 !bg-white dark:!bg-white">
      {/* Filters (Assuming StartupFilters internally handles its own background/text colors) */}
      <div className="mb-8 sm:mb-16">
        <StartupFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            className="flex flex-col justify-center items-center py-20 sm:py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#0A66C2] animate-spin mb-4" />
            <p className="text-base sm:text-lg !text-gray-600">Loading startups...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            
            {startups.length > 0 ? (
              <>
                {/* STARTUP GRID - 4 CARDS PER LINE ON LARGE SCREENS */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-10 sm:mb-16 lg:mb-20">
                  {startups.map((startup, index) => (
                    <motion.div
                      key={startup.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                    >
                      <StartupCard startup={startup} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    // FIX: Ensure border and background are static colors
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex w-full sm:w-auto justify-between sm:justify-start items-center gap-4">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        // FIX: Ensure button background is white in dark mode
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-medium !text-gray-700 hover:text-[#0A66C2] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-700 transition-colors !bg-white dark:!bg-white border border-gray-300 dark:border-gray-300 rounded-lg hover:border-[#0A66C2] disabled:hover:border-gray-300 min-h-[44px]"
                      >
                        <span className="text-lg">←</span>
                        <span className="hidden sm:inline">Previous</span>
                      </button>
                      
                      {/* Page Info */}
                      <div className="flex items-center justify-center sm:order-none order-last">
                        <span className="text-xs sm:text-sm !text-gray-600 font-medium">
                          Page {page} of {totalPages}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        // FIX: Ensure button background is white in dark mode
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 text-sm font-medium !text-gray-700 hover:text-[#0A66C2] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-700 transition-colors !bg-white dark:!bg-white border border-gray-300 dark:border-gray-300 rounded-lg hover:border-[#0A66C2] disabled:hover:border-gray-300 min-h-[44px]"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="text-lg">→</span>
                      </button>
                    </div>

                    {/* Desktop: Quick page jump */}
                    <div className="hidden lg:flex items-center gap-2">
                      {totalPages <= 7 ? (
                        Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                              page === pageNum
                                ? 'bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/30'
                                // FIX: Ensure pagination button background is white in dark mode
                                : '!bg-white dark:!bg-white !text-gray-700 border border-gray-300 dark:border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))
                      ) : (
                        // Ellipsis pagination logic
                        <>
                          {page > 2 && (
                            <button
                              onClick={() => handlePageChange(1)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium !bg-white dark:!bg-white !text-gray-700 border border-gray-300 dark:border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all"
                            >
                              1
                            </button>
                          )}
                          {page > 3 && <span className="!text-gray-400">...</span>}
                          {page > 1 && (
                            <button
                              onClick={() => handlePageChange(page - 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium !bg-white dark:!bg-white !text-gray-700 border border-gray-300 dark:border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all"
                            >
                              {page - 1}
                            </button>
                          )}
                          <button
                            className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-[#0A66C2] text-white shadow-lg shadow-[#0A66C2]/30"
                          >
                            {page}
                          </button>
                          {page < totalPages && (
                            <button
                              onClick={() => handlePageChange(page + 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium !bg-white dark:!bg-white !text-gray-700 border border-gray-300 dark:border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all"
                            >
                              {page + 1}
                            </button>
                          )}
                          {page < totalPages - 2 && <span className="!text-gray-400">...</span>}
                          {page < totalPages - 1 && (
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium !bg-white dark:!bg-white !text-gray-700 border border-gray-300 dark:border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all"
                            >
                              {totalPages}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div 
                className="text-center py-20 sm:py-32"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-7 h-7 sm:w-9 sm:h-9 text-[#0A66C2]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold !text-gray-900 mb-3">No startups found</h2>
                <p className="text-sm sm:text-base !text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0A66C2] text-white rounded-lg font-medium hover:bg-[#004182] active:bg-[#003366] transition-colors shadow-lg shadow-[#0A66C2]/20"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}