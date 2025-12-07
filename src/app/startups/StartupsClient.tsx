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
        className="min-h-[60vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={fetchStartups}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Simple Header */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold text-black mb-4">Discover startups</h1>
        <p className="text-xl text-gray-600">
          {loading ? 'Loading...' : `${total.toLocaleString()} ${total === 1 ? 'startup' : 'startups'} to explore`}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mb-12">
        <StartupFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            className="flex flex-col justify-center items-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-8 h-8 text-black animate-spin mb-4" />
            <p className="text-gray-600">Loading startups...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Startups Grid */}
            {startups.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

                {/* Minimalist Pagination */}
                {totalPages > 1 && (
                  <motion.div 
                    className="flex justify-center items-center gap-3 pt-8 border-t border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-700 transition-colors"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex items-center gap-2 px-4">
                      <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-700 transition-colors"
                    >
                      Next →
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div 
                className="text-center py-32"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-9 h-9 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-3">No startups found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you&lsquo;re looking for.
                </p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
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