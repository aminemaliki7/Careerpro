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

// Data definitions remain the same
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
  // Use "Temp" states for filters inside the modal, only applying them on "Apply"
  const [tempSearch, setTempSearch] = useState('');
  const [tempIndustry, setTempIndustry] = useState<IndustryType | ''>('');
  const [tempSize, setTempSize] = useState<CompanySize | ''>('');
  const [tempFundingStage, setTempFundingStage] = useState<FundingStage | ''>('');
  const [tempLocation, setTempLocation] = useState('');

  // The actual state used for filtering the data
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
      // Apply search from the main input, but ensure it's synced to tempSearch first
      search: activeFilters.search || undefined 
    };
    
    // Merge new filter settings with the current search term
    setActiveFilters(prev => ({ 
      ...prev, 
      ...newFilters, 
      search: prev.search 
    }));
    onFilterChange({ 
      ...newFilters, 
      search: activeFilters.search || undefined 
    });
    setShowFiltersModal(false); // Close modal after applying
  }, [tempIndustry, tempSize, tempFundingStage, tempLocation, activeFilters.search, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setTempSearch('');
    setTempIndustry('');
    setTempSize('');
    setTempFundingStage('');
    setTempLocation('');

    // Clear active filters but preserve search from the main input if present
    setActiveFilters(prev => ({ 
      search: prev.search || undefined 
    }));
    onFilterChange({ search: activeFilters.search || undefined });
    setShowFiltersModal(false);
  }, [activeFilters.search, onFilterChange]);

  const handleOpenModal = () => {
    // Sync active filters back to temp state when opening the modal
    // IMPORTANT: We only sync filtering parameters, not search, as search is handled directly on the main bar.
    setTempIndustry(activeFilters.industry || '');
    setTempSize(activeFilters.size || '');
    setTempFundingStage(activeFilters.fundingStage || '');
    setTempLocation(activeFilters.location || '');
    setShowFiltersModal(true);
  };

  const handleSearchChange = (value: string) => {
    setActiveFilters(prev => ({ ...prev, search: value || undefined }));
    // Trigger filter change immediately on search input, as it's the main function
    onFilterChange({ ...activeFilters, search: value || undefined });
  };


  const hasActiveFilters = 
    activeFilters.industry || 
    activeFilters.size || 
    activeFilters.fundingStage || 
    activeFilters.location || 
    activeFilters.search;
    
  // Check if any filter setting in the modal changed compared to the active filters
  const isFilterPanelChanged = 
    tempIndustry !== activeFilters.industry ||
    tempSize !== activeFilters.size ||
    tempFundingStage !== activeFilters.fundingStage ||
    tempLocation !== activeFilters.location;


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-8">
      {/* 1. Primary Search and Filter Button (Visible on all sizes) */}
      <div className="flex gap-2 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups by name or description..."
            value={activeFilters.search || ''} 
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onFilterChange(activeFilters)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
        
        {/* Filter Button (Opens Modal on Mobile/Small Screens) */}
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center sm:gap-2 px-3 py-3 sm:px-4 sm:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors w-12 h-12 sm:w-auto relative"
          aria-label="Open advanced filters"
        >
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">Filters</span>
          {/* Badge for active filters (excluding search) */}
          {(activeFilters.industry || activeFilters.size || activeFilters.fundingStage || activeFilters.location) && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>

        {/* Dedicated Search Button (Desktop Only) */}
        <button
          onClick={() => onFilterChange(activeFilters)}
          className="hidden sm:block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* 2. Mobile Filter Modal/Drawer */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-white sm:bg-black/50 sm:flex sm:items-center sm:justify-center">
          
          <div className="bg-white w-full h-full sm:max-w-xl sm:max-h-[90vh] sm:rounded-xl shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
              <button onClick={() => setShowFiltersModal(false)} aria-label="Close filters">
                <X className="w-6 h-6 text-gray-500 hover:text-gray-900" />
              </button>
            </div>

            {/* Modal Body (Scrollable Filters) */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
              
              {/* Filter Grid - uses a single column on mobile for optimal stacking */}
              <div className="grid grid-cols-1 gap-4">
                
                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={tempIndustry}
                    onChange={(e) => setTempIndustry(e.target.value as IndustryType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Industries</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={tempSize}
                    onChange={(e) => setTempSize(e.target.value as CompanySize)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Sizes</option>
                    {companySizes.map((s) => (
                      <option key={s} value={s}>
                        {s} employees
                      </option>
                    ))}
                  </select>
                </div>

                {/* Funding Stage Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Stage
                  </label>
                  <select
                    value={tempFundingStage}
                    onChange={(e) => setTempFundingStage(e.target.value as FundingStage)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Stages</option>
                    {fundingStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., San Francisco"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-4 sm:p-6 border-t border-gray-200 sticky bottom-0 bg-white flex justify-between gap-3">
               <button
                 onClick={handleClearFilters}
                 className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-1/3 justify-center border border-gray-300"
               >
                 <X className="w-5 h-5" />
                 <span className="hidden sm:inline">Clear</span>
               </button>

              <button
                onClick={handleApplyFilters}
                disabled={!isFilterPanelChanged} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-2/3 disabled:bg-gray-400"
              >
                <Check className="w-5 h-5" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}