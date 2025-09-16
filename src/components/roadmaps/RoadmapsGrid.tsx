"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Roadmap } from '@/types/roadmap';
import Link from 'next/link';

interface RoadmapsGridProps {
  initialRoadmaps: Roadmap[];
}

export default function RoadmapsGrid({ initialRoadmaps }: RoadmapsGridProps) {
  console.log('RoadmapsGrid received:', initialRoadmaps.map(r => r.id)); // Debug: Log received roadmaps
  const router = useRouter();
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Career Roadmaps</h1>
          <p className="text-xl text-gray-600">Find your ideal career path and get started today</p>
        </div>
        {/* Debug Info */}
        {initialRoadmaps.length === 0 && (
          <div className="mb-8 text-center text-gray-500">
            <p>No roadmap data loaded. Check if JSON files exist in src/content/roadmaps/.</p>
          </div>
        )}
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Search for a roadmap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.length > 0 ? (
            filteredRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} className="block">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                      roadmap.demandLevel === 'Very High' ? 'bg-green-100 text-green-800' :
                      roadmap.demandLevel === 'High' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                    {roadmap.demandLevel} Demand
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{roadmap.description}</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {roadmap.totalDuration}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.417c-.367-.275-.824-.417-1.31-.417-.571 0-1.1.208-1.55.625-.45.417-.675.983-.675 1.7.008.825.292 1.5.85 2.05.558.558 1.25.842 2.05.85.875 0 1.625-.333 2.25-1 .625-.667.933-1.625.933-2.933h-1c0 .875-.258 1.483-.775 1.825-.517.342-1.15.517-1.9.517-.6 0-1.125-.167-1.575-.5-.45-.333-.675-.75-.675-1.25s.225-.917.675-1.25c.45-.333 1.05-.5 1.8-.5.583 0 1.133.125 1.65.375.517.25 1 .583 1.45 1h-1.417V9.75h3.5v.75c-.217 0-.433.017-.65.05-.217.033-.425.075-.625.125-.383.1-.733.25-1.05.45-.317.2-.567.433-.75.7-.183.267-.275.542-.275.825 0 .342.133.625.4.85.267.225.6.333 1.05.333.4 0 .767-.133 1.1-.4.333-.267.625-.6.875-1.025.25-.425.408-.875.475-1.35.067-.475.067-.925-.008-1.35-.067-.425-.217-.833-.45-1.225-.233-.392-.517-.742-.85-1.05-.333-.317-.692-.558-1.075-.725-.383-.167-.808-.25-1.275-.25-.633 0-1.2.142-1.7.425-.5.283-.883.658-1.15 1.125-.267.467-.4 1.008-.4 1.625 0 .617.133 1.158.4 1.625.267.467.633.842 1.1 1.125.467.283 1.025.425 1.675.425.5 0 .967-.108 1.4-.325.433-.217.783-.525 1.05-.925.267-.4.433-.85.5-1.35.067-.5.067-.95.008-1.35H12c.008.35.008.683-.008 1-.008.317-.033.617-.075.9-.042.283-.1.542-.175.775-.075.233-.183.433-.325.6-.142.167-.3.292-.475.375-.175.083-.35.125-.525.125-.442 0-.825-.117-1.15-.35-.325-.233-.55-.558-.675-.975-.125-.417-.188-.875-.188-1.375 0-.5.063-.95.188-1.35.125-.4.35-.725.675-.975.325-.25.7-.375 1.125-.375.4 0 .742.083 1.025.25.283.167.517.383.7.65.183.267.3.567.35.9h.8c-.025-.367-.1-.692-.225-1zm-1.667 3.917c-.15.25-.317.475-.5.675-.183.2-.4.367-.65.5-.25.133-.5.2-.75.2-.283 0-.583-.083-.9-.25-.317-.167-.583-.417-.8-.75-.217-.333-.35-.717-.4-1.15-.05-.433-.042-.858-.008-1.275.025-.367.092-.725.2-1.075.108-.35.25-.683.425-1.025.175-.342.383-.65.625-.925.242-.275.5-.5.775-.675.275-.175.55-.25.825-.25.3 0 .583.083.85.25.267.167.5.4.7.7.2.3.333.617.4.95.067.333.092.675.075 1.025-.017.35-.083.675-.2 1-.117.325-.275.617-.475.875z" />
                      </svg>
                      {roadmap.level}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No roadmaps found. Try adjusting your search or filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}