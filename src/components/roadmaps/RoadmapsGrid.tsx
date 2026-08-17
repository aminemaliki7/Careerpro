"use client";

import { useState, useMemo } from "react";
import { Roadmap } from "@/types/roadmap";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  Zap,
  TrendingUp,
  Star,
  BookOpen,
  Sparkles,
  ChevronRight,
  Layers,
} from "lucide-react";

interface RoadmapsGridProps {
  initialRoadmaps: Roadmap[];
}

interface RoadmapStats {
  totalRoadmaps: number;
  categories: number;
  avgDuration: string;
  mostPopular: Roadmap | null;
}

export default function RoadmapsGrid({ initialRoadmaps = [] }: RoadmapsGridProps) {
  const categories = Array.from(
    new Set(initialRoadmaps.map((r) => r.category).filter(Boolean))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Calculate stats
  const stats: RoadmapStats = useMemo(() => {
    return {
      totalRoadmaps: initialRoadmaps.length,
      categories: categories.length,
      avgDuration: "Self-paced",
      mostPopular: initialRoadmaps[0] || null,
    };
  }, [initialRoadmaps, categories]);

  const filteredRoadmaps = useMemo(() => {
    return initialRoadmaps.filter((roadmap) => {
      const matchesSearch =
        roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        roadmap.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        roadmap.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || roadmap.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialRoadmaps, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR: Navigation & Filters */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* Search Box */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900 font-medium"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-2 py-1.5 mb-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span>Filter by Track</span>
              </div>

              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === "All"
                      ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/20"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  All Tracks
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/20"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {selectedCategory === cat && <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT: Roadmap Grid */}
          <main className="lg:col-span-6 space-y-4">
            
            {/* Header Bar */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h1 className="text-sm font-bold text-slate-900">Career Roadmaps</h1>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {filteredRoadmaps.length} {selectedCategory !== "All" ? `${selectedCategory} ` : ""}path{filteredRoadmaps.length !== 1 ? "s" : ""} available
                  </p>
                </div>
                <BookOpen className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            {/* Roadmap Cards Grid */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              {filteredRoadmaps.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <Layers className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
                  <p className="text-slate-800 text-sm font-semibold">No roadmaps found</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {searchQuery ? "Try adjusting your search query." : "Try selecting a different category."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredRoadmaps.map((roadmap) => (
                    <Link
                      key={roadmap.id}
                      href={`/roadmaps/${roadmap.id}`}
                      className="block group p-4 hover:bg-slate-50/70 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-indigo-200/60">
                            {roadmap.category?.substring(0, 1).toUpperCase() || "📚"}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                              {roadmap.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 mb-2">
                              {roadmap.category}
                            </p>

                            <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                              {roadmap.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2">
                              {roadmap.totalDuration && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded border border-slate-200/60">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {roadmap.totalDuration}
                                </span>
                              )}
                              {roadmap.level && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-semibold rounded border border-indigo-200/60">
                                  <Zap className="w-3 h-3 text-indigo-600" />
                                  {roadmap.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR: Insights & Recommendations */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* Featured Roadmap */}
            {stats.mostPopular && (
              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-xs border border-slate-800">
                <div className="flex items-center gap-2 font-bold mb-2 text-indigo-400">
                  <Star className="w-4 h-4" />
                  <span className="text-xs">Featured Path</span>
                </div>
                <h3 className="font-bold text-sm mb-1">{stats.mostPopular.title}</h3>
                <p className="text-[11px] text-slate-300 mb-3 leading-relaxed line-clamp-3">
                  {stats.mostPopular.description}
                </p>
                <Link
                  href={`/roadmaps/${stats.mostPopular.id}`}
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors group"
                >
                  Explore Path
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}

            {/* Learning Tip */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-2 font-bold mb-2 text-slate-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs">Learning Tip</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Following a structured roadmap increases your likelihood of mastering complex skills by 3x. Pick one and commit to the path.
              </p>
            </div>

            {/* Progress Stat */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Most Popular</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              </div>

              <div className="space-y-2.5">
                {initialRoadmaps.slice(0, 3).map((rm, idx) => (
                  <div key={rm.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200/60 shadow-2xs">
                    <span className="text-xs text-slate-700 font-medium truncate">{rm.title}</span>
                    <span className="text-xs font-bold text-slate-400 pl-2">{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}