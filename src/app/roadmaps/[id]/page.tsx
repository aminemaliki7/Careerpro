// File: src/app/roadmaps/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Users,
  Target
} from 'lucide-react';
import { getRoadmapById, getAllRoadmaps } from '@/lib/roadmaps';
import type { Roadmap, RoadmapStep } from '@/types/roadmap';
import CourseModalClient from './CourseModalClient';

interface RoadmapDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { id } = await params;
  const roadmap: Roadmap | undefined = getRoadmapById(id);

  if (!roadmap) {
    notFound();
  }

  const formatSalary = (min: number, max: number, currency: string = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const getDemandColor = (demand: Roadmap['demandLevel']) => {
    switch (demand) {
      case 'Very High': return 'text-green-600 bg-green-100';
      case 'High': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepColor = (difficulty: RoadmapStep['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'Intermediate': return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'Advanced': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  // Group steps into rows for visual flow
  const createRoadmapFlow = (): RoadmapStep[][] => {
    const steps: RoadmapStep[] = roadmap.steps;
    const rows: RoadmapStep[][] = [];
    let currentRow: RoadmapStep[] = [];

    steps.forEach((step, index) => {
      if (index > 0 && index % 3 === 0) {
        rows.push([...currentRow]);
        currentRow = [];
      }
      currentRow.push(step);
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const roadmapFlow = createRoadmapFlow();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Career Roadmaps
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(roadmap.demandLevel)}`}>
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {roadmap.demandLevel} Demand
              </span>
              <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium">
                {roadmap.category}
              </span>
              <span className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm font-medium">
                {roadmap.level}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {roadmap.title} <span className="text-blue-600">Career Path</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {roadmap.description}
            </p>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                📚 <strong>Free guidance:</strong> This roadmap shows you the complete learning path to become a {roadmap.title}. 
                Click on any step to discover recommended courses and resources.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{roadmap.totalDuration}</div>
                <div className="text-sm text-gray-600">Total Duration</div>
              </div>
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatSalary(roadmap.avgSalary.min, roadmap.avgSalary.max).split(' - ')[0]}
                </div>
                <div className="text-sm text-gray-600">Starting Salary</div>
              </div>
              <div className="text-center">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{roadmap.steps.length}</div>
                <div className="text-sm text-gray-600">Learning Steps</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,200+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Roadmap + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Skills Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Skills in This Domain</h2>
              <div className="flex flex-wrap gap-2">
                {roadmap.tags.map((skill, index) => (
                  <span
                    key={`skill-${skill}-${index}`}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                These are the core skills professionals in this domain typically master throughout their career journey.
              </p>
            </div>

            {/* Visual Roadmap Flow */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 overflow-x-auto">
              {roadmapFlow.map((row, rowIndex) => (
                <div key={rowIndex} className="relative mb-16">
                  {rowIndex < roadmapFlow.length - 1 && (
                    <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-gray-300 transform -translate-x-0.5"></div>
                  )}
                  <div className="flex items-center justify-center gap-8 flex-wrap">
                    {row.map((step, stepIndex) => (
                      <CourseModalClient
                        key={step.id}
                        step={step}
                        stepIndex={stepIndex}
                        isLastInRow={stepIndex === row.length - 1}
                        roadmapIndex={roadmap.steps.indexOf(step)}
                        stepColor={getStepColor(step.difficulty)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Career Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Learning Timeline</span>
                  <span className="font-semibold">{roadmap.totalDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Career Stages</span>
                  <span className="font-semibold">{roadmap.steps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="font-semibold">{roadmap.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Market Demand</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getDemandColor(roadmap.demandLevel)}`}>
                    {roadmap.demandLevel}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="text-gray-600 mb-1">Average Salary Range</div>
                  <div className="text-xl font-bold text-green-600">
                    {formatSalary(roadmap.avgSalary.min, roadmap.avgSalary.max)}
                  </div>
                  <div className="text-sm text-gray-500">per year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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