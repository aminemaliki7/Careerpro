
// components/startups/StartupFilters.tsx
'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<IndustryType | ''>('');
  const [size, setSize] = useState<CompanySize | ''>('');
  const [fundingStage, setFundingStage] = useState<FundingStage | ''>('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      industry: industry || undefined,
      size: size || undefined,
      fundingStage: fundingStage || undefined,
      location: location || undefined,
      search: search || undefined
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setIndustry('');
    setSize('');
    setFundingStage('');
    setLocation('');
    onFilterChange({});
  };

  const hasActiveFilters = industry || size || fundingStage || location || search;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyFilters()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          <Filter className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
              •
            </span>
          )}
        </button>

        <button
          onClick={handleApplyFilters}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryType)}
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
                value={size}
                onChange={(e) => setSize(e.target.value as CompanySize)}
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
                value={fundingStage}
                onChange={(e) => setFundingStage(e.target.value as FundingStage)}
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
