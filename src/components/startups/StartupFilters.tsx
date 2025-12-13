// components/startups/StartupFilters.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Check } from 'lucide-react';
import { IndustryType } from '@/types/startup';

interface StartupFiltersProps {
  onFilterChange: (filters: {
    industry?: IndustryType;
    location?: string;
    search?: string;
  }) => void;
}

const industries: IndustryType[] = [
  'AI/ML',
  'FinTech',
  'HealthTech',
  'EdTech',
  'E-commerce',
  'SaaS',
  'Cybersecurity',
  'DevTools',
  'CleanTech',
  'Blockchain',
  'Other'
];

// Countries list with flag emojis
const countries = [
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Mexico', flag: '🇲🇽' },
  { name: 'Morocco', flag: '🇲🇦' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'New Zealand', flag: '🇳🇿' },
  { name: 'Norway', flag: '🇳🇴' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
  { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Other', flag: '🌍' }
];

export default function StartupFilters({ onFilterChange }: StartupFiltersProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Active filters (what's currently applied)
  const [activeFilters, setActiveFilters] = useState<{
    search?: string;
    industry?: IndustryType;
    location?: string;
  }>({});

  // Temporary filters (modal state before applying)
  const [tempFilters, setTempFilters] = useState<{
    industry: IndustryType | '';
    location: string;
  }>({
    industry: '',
    location: ''
  });

  // Debounced search (300ms delay)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const newFilters = {
        ...activeFilters,
        search: searchValue || undefined
      };
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue]);

  const handleOpenModal = () => {
    setTempFilters({
      industry: activeFilters.industry || '',
      location: activeFilters.location || ''
    });
    setShowFiltersModal(true);
  };

  const handleApplyFilters = () => {
    const newFilters = {
      search: activeFilters.search,
      industry: tempFilters.industry || undefined,
      location: tempFilters.location || undefined
    };
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
    setShowFiltersModal(false);
  };

  const handleClearFilters = () => {
    setTempFilters({
      industry: '',
      location: ''
    });
    
    const newFilters = { search: activeFilters.search };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
    setShowFiltersModal(false);
  };

  const removeFilter = (filterKey: keyof typeof activeFilters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey];
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const isFilterPanelChanged = 
    tempFilters.industry !== (activeFilters.industry || '') ||
    tempFilters.location !== (activeFilters.location || '');

  const activeFilterCount = [
    activeFilters.industry,
    activeFilters.location
  ].filter(Boolean).length;

  // Close modal on ESC key & prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showFiltersModal) {
        setShowFiltersModal(false);
      }
    };

    if (showFiltersModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showFiltersModal]);

  return (
    <>
      {/* Main Search Bar with Filter Button */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-shadow"
              aria-label="Search startups"
            />
          </div>
          
          {/* Filter Button with Badge */}
          <button
            onClick={handleOpenModal}
            className="relative flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-medium transition-all min-w-[44px]"
            aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Tags (Desktop Only) */}
        {activeFilterCount > 0 && (
          <div className="hidden sm:flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {activeFilters.industry && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                <span className="font-medium">Industry:</span> {activeFilters.industry}
                <button 
                  onClick={() => removeFilter('industry')}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label="Remove Industry filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {activeFilters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                <span className="font-medium">Country:</span>
                <span>{countries.find(c => c.name === activeFilters.location)?.flag || '🌍'} {activeFilters.location}</span>
                <button 
                  onClick={() => removeFilter('location')}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  aria-label="Remove Country filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mobile-First Filter Modal */}
      {showFiltersModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center sm:justify-center transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowFiltersModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
        >
          
          {/* Modal Container */}
          <div className="bg-white w-full max-h-[90vh] sm:max-w-md sm:rounded-xl shadow-2xl flex flex-col rounded-t-2xl sm:rounded-t-xl transform transition-transform duration-300 ease-out">
            
            {/* Header - Sticky */}
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-2xl sm:rounded-t-xl">
              <div>
                <h2 id="filter-modal-title" className="text-lg sm:text-xl font-semibold text-gray-900">
                  Filter Startups
                </h2>
                {activeFilterCount > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowFiltersModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                
                {/* Industry */}
                <div>
                  <label htmlFor="filter-industry" className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Industry
                  </label>
                  <select
                    id="filter-industry"
                    value={tempFilters.industry}
                    onChange={(e) => setTempFilters({ ...tempFilters, industry: e.target.value as IndustryType })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base appearance-none bg-white cursor-pointer transition-shadow"
                  >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="filter-country" className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Country
                  </label>
                  <select
                    id="filter-country"
                    value={tempFilters.location}
                    onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base appearance-none bg-white cursor-pointer transition-shadow"
                  >
                    <option value="">🌍 All Countries</option>
                    {countries.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer - Sticky Action Buttons */}
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white sticky bottom-0 z-10">
              <div className="flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors border border-gray-300 font-medium text-sm sm:text-base min-h-[44px] flex-1"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={handleApplyFilters}
                  disabled={!isFilterPanelChanged}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all text-sm sm:text-base min-h-[44px] flex-[2] shadow-lg shadow-blue-600/20 disabled:shadow-none"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Apply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}