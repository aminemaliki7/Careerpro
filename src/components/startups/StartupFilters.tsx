// components/startups/StartupFilters.tsx

import { useState, useCallback } from 'react';
import { Search, Filter, X, Check } from 'lucide-react';
import { IndustryType, CompanySize, FundingStage } from '@/types/startup';

interface StartupFiltersProps {
  onFilterChange: (filters: {
    industry?: IndustryType;
    size?: CompanySize;
    fundingStage?: FundingStage;
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

const companySizes: CompanySize[] = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+'
];

const fundingStages: FundingStage[] = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Acquired',
  'Public'
];

export default function StartupFilters({ onFilterChange }: StartupFiltersProps) {
  const [tempIndustry, setTempIndustry] = useState<IndustryType | ''>('');
  const [tempSize, setTempSize] = useState<CompanySize | ''>('');
  const [tempFundingStage, setTempFundingStage] = useState<FundingStage | ''>('');
  const [tempLocation, setTempLocation] = useState('');

  const [activeFilters, setActiveFilters] = useState<{
      search?: string;
      industry?: IndustryType;
      size?: CompanySize;
      fundingStage?: FundingStage;
      location?: string;
  }>({});

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const handleApplyFilters = useCallback(() => {
    const newFilters = {
      industry: tempIndustry || undefined,
      size: tempSize || undefined,
      fundingStage: tempFundingStage || undefined,
      location: tempLocation || undefined,
      search: activeFilters.search || undefined 
    };
    
    setActiveFilters(prev => ({ 
      ...prev, 
      ...newFilters, 
      search: prev.search 
    }));
    onFilterChange({ 
      ...newFilters, 
      search: activeFilters.search || undefined 
    });
    setShowFiltersModal(false);
  }, [tempIndustry, tempSize, tempFundingStage, tempLocation, activeFilters.search, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setTempIndustry('');
    setTempSize('');
    setTempFundingStage('');
    setTempLocation('');

    setActiveFilters(prev => ({ 
      search: prev.search || undefined 
    }));
    onFilterChange({ search: activeFilters.search || undefined });
    setShowFiltersModal(false);
  }, [activeFilters.search, onFilterChange]);

  const handleOpenModal = () => {
    setTempIndustry(activeFilters.industry || '');
    setTempSize(activeFilters.size || '');
    setTempFundingStage(activeFilters.fundingStage || '');
    setTempLocation(activeFilters.location || '');
    setShowFiltersModal(true);
  };

  const handleSearchChange = (value: string) => {
    setActiveFilters(prev => ({ ...prev, search: value || undefined }));
    onFilterChange({ ...activeFilters, search: value || undefined });
  };

  const isFilterPanelChanged = 
    tempIndustry !== (activeFilters.industry || '') ||
    tempSize !== (activeFilters.size || '') ||
    tempFundingStage !== (activeFilters.fundingStage || '') ||
    tempLocation !== (activeFilters.location || '');

  const activeFilterCount = [
    activeFilters.industry,
    activeFilters.size,
    activeFilters.fundingStage,
    activeFilters.location
  ].filter(Boolean).length;

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
              value={activeFilters.search || ''} 
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onFilterChange(activeFilters)}
              className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-shadow"
            />
          </div>
          
          {/* Filter Button with Badge */}
          <button
            onClick={handleOpenModal}
            className="relative flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg font-medium transition-all min-w-[44px]"
            aria-label="Open filters"
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
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, industry: undefined }));
                    onFilterChange({ ...activeFilters, industry: undefined });
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {activeFilters.size && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                <span className="font-medium">Size:</span> {activeFilters.size}
                <button 
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, size: undefined }));
                    onFilterChange({ ...activeFilters, size: undefined });
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {activeFilters.fundingStage && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                <span className="font-medium">Stage:</span> {activeFilters.fundingStage}
                <button 
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, fundingStage: undefined }));
                    onFilterChange({ ...activeFilters, fundingStage: undefined });
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {activeFilters.location && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                <span className="font-medium">Location:</span> {activeFilters.location}
                <button 
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, location: undefined }));
                    onFilterChange({ ...activeFilters, location: undefined });
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center sm:justify-center animate-fadeIn">
          
          {/* Modal Container - Slides up on mobile, centered on desktop */}
          <div className="bg-white w-full max-h-[90vh] sm:max-w-2xl sm:rounded-xl shadow-2xl flex flex-col animate-slideUp sm:animate-none rounded-t-2xl sm:rounded-t-xl">
            
            {/* Header - Sticky */}
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200 bg-white sticky top-0 z-10 rounded-t-2xl sm:rounded-t-xl">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Filter Startups</h2>
                {activeFilterCount > 0 && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowFiltersModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                
                {/* Industry */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Industry
                  </label>
                  <select
                    value={tempIndustry}
                    onChange={(e) => setTempIndustry(e.target.value as IndustryType)}
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

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Company Size
                  </label>
                  <select
                    value={tempSize}
                    onChange={(e) => setTempSize(e.target.value as CompanySize)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base appearance-none bg-white cursor-pointer transition-shadow"
                  >
                    <option value="">All Sizes</option>
                    {companySizes.map((s) => (
                      <option key={s} value={s}>
                        {s} employees
                      </option>
                    ))}
                  </select>
                </div>

                {/* Funding Stage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Funding Stage
                  </label>
                  <select
                    value={tempFundingStage}
                    onChange={(e) => setTempFundingStage(e.target.value as FundingStage)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base appearance-none bg-white cursor-pointer transition-shadow"
                  >
                    <option value="">All Stages</option>
                    {fundingStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-shadow"
                  />
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
                  <span>Clear All</span>
                </button>

                <button
                  onClick={handleApplyFilters}
                  disabled={!isFilterPanelChanged}
                  className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all text-sm sm:text-base min-h-[44px] flex-[2] shadow-lg shadow-blue-600/20 disabled:shadow-none"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}