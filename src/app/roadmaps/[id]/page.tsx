import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Trophy,
  Users,
  Target
} from 'lucide-react';
import { getRoadmapById, getAllRoadmaps } from '@/lib/roadmaps';

interface RoadmapDetailPageProps {
  params: {
    id: string;
  };
}

export default function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const roadmap = getRoadmapById(params.id);
  if (!roadmap) {
    notFound();
  }

  const formatSalary = (min: number, max: number, currency: string = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High':
        return 'text-green-600 bg-green-100';
      case 'High':
        return 'text-blue-600 bg-blue-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
              {roadmap.title} <span className="text-blue-600">Roadmap</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {roadmap.description}
            </p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Skills Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills You&apos;ll Master</h2>
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
            </div>

            {/* Learning Path */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Path</h2>
              
              <div className="space-y-6">
                {roadmap.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {/* Step Connector Line */}
                    {index < roadmap.steps.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    
                    <div className="flex gap-4">
                      {/* Step Number */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Step Content */}
                      <div className="flex-1 bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                              {step.difficulty}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {step.duration}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        
                        {/* Prerequisites */}
                        {step.prerequisites && step.prerequisites.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
                            <div className="flex flex-wrap gap-1">
                              {step.prerequisites.map((prereq, prereqIndex) => (
                                <span
                                  key={`prereq-${prereq}-${prereqIndex}`}
                                  className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                                >
                                  {prereq}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Skills */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills you&apos;ll learn:</h4>
                          <div className="flex flex-wrap gap-1">
                            {step.skills.map((skill, skillIndex) => (
                              <span
                                key={`step-skill-${skill}-${skillIndex}`}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Resources */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Learning Resources:</h4>
                          <div className="space-y-2">
                            {step.resources.map((resource, resourceIndex) => (
                              <div
                                key={`resource-${resource.title}-${resourceIndex}`}
                                className="flex items-start gap-2 p-3 bg-white rounded border border-gray-200"
                              >
                                <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{resource.title}</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                                      {resource.type}
                                    </span>
                                    {resource.url && (
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span className="text-xs text-green-600 ml-1">(Affiliate Link)</span>
                                      </a>
                                    )}
                                  </div>
                                  {resource.description && (
                                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6"> {/* Added space-y-6 for consistent spacing */}
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Duration</span>
                  <span className="font-semibold">{roadmap.totalDuration}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Learning Steps</span>
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
              
              <div className="mt-6 pt-6 border-t">
                <div className="text-xs text-gray-500 mb-2">Last updated: {new Date(roadmap.lastUpdated).toLocaleDateString()}</div>
                <div className="text-xs text-gray-500">By: {roadmap.author}</div>
              </div>
              
              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4" />
                Start This Roadmap
              </button>
            </div>

            {/* Related Paths */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Related Paths</h3>
              <div className="space-y-3">
                <Link
                  href={`/roadmaps?category=${encodeURIComponent(roadmap.category)}`}
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  → View all {roadmap.category} roadmaps
                </Link>
                <Link
                  href={`/roadmaps?level=${encodeURIComponent(roadmap.level)}`}
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  → Browse {roadmap.level} positions
                </Link>
                <Link
                  href={`/jobs?role=${encodeURIComponent(roadmap.title)}`}
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  → Find {roadmap.title} jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Disclaimer Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t text-center text-sm text-gray-500">
        Note: Some links in this roadmap are affiliate links. If you purchase through them, we may earn a small commission at no extra cost to you. This helps support our content.
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