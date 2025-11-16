"use client";
import { useState } from 'react';
import { Roadmap } from '@/types/roadmap';
import Link from 'next/link';

interface RoadmapsGridProps {
  initialRoadmaps: Roadmap[];
}

export default function RoadmapsGrid({ initialRoadmaps }: RoadmapsGridProps) {
  console.log('RoadmapsGrid received:', initialRoadmaps.map(r => r.id)); // Debug: Log received roadmaps
  const categories = [...new Set(initialRoadmaps.map(r => r.category))];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRoadmaps = initialRoadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || roadmap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Career Roadmaps
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Step by step guides and paths to learn different tools or technologies
            </p>
          </div>

          {/* Debug Info */}
          {initialRoadmaps.length === 0 && (
            <div className="mb-8 text-center text-gray-500">
              <p>No roadmap data loaded. Check if JSON files exist in src/content/roadmaps/.</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoadmaps.length > 0 ? (
            filteredRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} className="block group">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5 transition-all hover:border-gray-900 hover:shadow-lg">
                  {/* Badge and Arrow */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                      roadmap.demandLevel === 'Very High' 
                        ? 'bg-green-100 text-green-800' 
                        : roadmap.demandLevel === 'High' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        roadmap.demandLevel === 'Very High' 
                          ? 'bg-green-600' 
                          : roadmap.demandLevel === 'High' 
                          ? 'bg-blue-600' 
                          : 'bg-gray-600'
                      }`}></span>
                      {roadmap.demandLevel}
                    </span>
                    
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {roadmap.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {roadmap.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{roadmap.totalDuration}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">{roadmap.level}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No roadmaps found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}