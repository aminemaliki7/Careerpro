'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Job, getJobRegion, formatExperienceLevel, GLOBAL_REGIONS } from '@/types/job';

// Add globe icon for regions
const GlobeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

// Custom SVG Icons
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      setError('Erreur lors du chargement des offres d\'emploi');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const jobTypes = useMemo(() => {
    const types = [...new Set(jobs.map(job => job.type))];
    return types.filter(Boolean);
  }, [jobs]);

  const locations = useMemo(() => {
    const locs = [...new Set(jobs.map(job => job.location))];
    return locs.filter(Boolean);
  }, [jobs]);

  const experienceLevels = useMemo(() => {
    const levels = [...new Set(jobs.map(job => job.experience_level))];
    return levels.filter(Boolean);
  }, [jobs]);

  const salaryRanges = useMemo(() => {
    const ranges = [...new Set(jobs.map(job => job.salary_range))];
    return ranges.filter(Boolean).sort();
  }, [jobs]);

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

    // Sort jobs
    filtered.sort((a, b) => {
      if (sortBy === 'posted_date') {
        return new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

    return filtered;
  }, [jobs, searchTerm, selectedType, selectedLocation, selectedRegion, selectedExperience, selectedSalaryRange, remoteOnly, featuredOnly, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium">{error}</div>
            <button 
              onClick={fetchJobs}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Trouvez votre emploi idéal
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Découvrez {jobs.length} opportunités professionnelles
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, entreprise ou mot-clé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FilterIcon className="h-5 w-5 mr-2" />
                Filtres
              </h2>
              
              <div className="space-y-6">
                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de contrat
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tous les types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville / Localisation
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Toutes les villes</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Global Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🌍 Région mondiale
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Toutes les régions</option>
                    {GLOBAL_REGIONS.map(region => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                  {selectedRegion && (
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Pays inclus:</strong> {GLOBAL_REGIONS.find(r => r.value === selectedRegion)?.countries.join(', ')}
                    </div>
                  )}
                </div>

                {/* Experience Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d&apos;expérience
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="Entry Level">Débutant / Entry Level</option>
                    <option value="Junior">Junior (1-3 ans)</option>
                    <option value="Mid-Level">Intermédiaire (3-5 ans)</option>
                    <option value="Senior">Senior (5+ ans)</option>
                    <option value="Lead">Lead / Expert (8+ ans)</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Directeur</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Salary Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fourchette salariale
                  </label>
                  <select
                    value={selectedSalaryRange}
                    onChange={(e) => setSelectedSalaryRange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tous les salaires</option>
                    <option value="< 30k">Moins de 30k€</option>
                    <option value="30k - 40k">30k€ - 40k€</option>
                    <option value="40k - 50k">40k€ - 50k€</option>
                    <option value="50k - 60k">50k€ - 60k€</option>
                    <option value="60k - 80k">60k€ - 80k€</option>
                    <option value="80k - 100k">80k€ - 100k€</option>
                    <option value="> 100k">Plus de 100k€</option>
                    {salaryRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Remote Work Filter */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Télétravail uniquement</span>
                  </label>
                </div>

                {/* Featured Jobs Filter */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Offres mises en avant</span>
                  </label>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="posted_date">Date de publication</option>
                    <option value="title">Titre</option>
                    <option value="company">Entreprise</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedLocation('');
                    setSelectedRegion('');
                    setSelectedExperience('');
                    setSelectedSalaryRange('');
                    setRemoteOnly(false);
                    setFeaturedOnly(false);
                    setSortBy('posted_date');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Effacer les filtres
                </button>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredAndSortedJobs.length} offre{filteredAndSortedJobs.length !== 1 ? 's' : ''} trouvée{filteredAndSortedJobs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredAndSortedJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  Aucune offre d&apos;emploi ne correspond à vos critères.
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedLocation('');
                    setSelectedRegion('');
                    setSelectedExperience('');
                    setSelectedSalaryRange('');
                    setRemoteOnly(false);
                    setFeaturedOnly(false);
                  }}
                  className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedJobs.map((job: Job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Link 
                              href={`/jobs/${job.id}`}
                              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mr-3"
                            >
                              {job.title}
                            </Link>
                            {job.featured && (
                              <StarIcon className="h-5 w-5 text-yellow-400" filled />
                            )}
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-3">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-3">{job.company}</span>
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span className="mr-3">{job.location}</span>
                            <GlobeIcon className="h-4 w-4 mr-1" />
                            <span className="mr-3">
                              {GLOBAL_REGIONS.find(region => region.value === getJobRegion(job.location))?.label || 'Autre région'}
                            </span>
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm">{formatDate(job.posted_date)}</span>
                          </div>

                          {job.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {job.description.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.type}
                          </span>
                          {job.remote && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Télétravail
                            </span>
                          )}
                          {job.featured && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Mis en avant
                            </span>
                          )}
                          {job.experience_level && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {formatExperienceLevel(job.experience_level)}
                            </span>
                          )}
                          {job.salary_range && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              {job.salary_range}
                            </span>
                          )}
                        </div>
                        
                        <Link 
                          href={`/jobs/${job.id}`}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Voir l&apos;offre
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}