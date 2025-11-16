// File: src/app/roadmaps/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Star, TrendingUp } from 'lucide-react';
import { getRoadmapById, getAllRoadmaps } from '@/lib/roadmaps';
import type { Roadmap } from '@/types/roadmap';
import InteractiveRoadmapClient from './InteractiveRoadmapClient';

interface RoadmapDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { id } = await params;
  const roadmap: Roadmap | undefined = getRoadmapById(id);

  if (!roadmap) {
    notFound();
  }

  const getDemandColor = (demand: Roadmap['demandLevel']) => {
    switch (demand) {
      case 'Very High': return 'text-green-600 bg-green-100 border-green-200';
      case 'High': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/roadmaps"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Roadmaps
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDemandColor(roadmap.demandLevel)}`}>
                <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                {roadmap.demandLevel} Demand
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                {roadmap.level}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {roadmap.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {roadmap.description}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{roadmap.totalDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{roadmap.steps.length} Steps</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>
                  ${(roadmap.avgSalary.min / 1000).toFixed(0)}k - ${(roadmap.avgSalary.max / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {roadmap.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium border border-gray-200 hover:border-gray-900 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Roadmap */}
        <InteractiveRoadmapClient roadmap={roadmap} />
      </div>
    </div>
  );
}

// Generate static params for all roadmaps
export async function generateStaticParams() {
  const roadmaps = getAllRoadmaps();
  return roadmaps.map((roadmap) => ({
    id: roadmap.id,
  }));
}