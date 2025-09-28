'use client';

import { useState } from 'react';
import {
  Clock,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Circle,
  ArrowRight,
  GitBranch,
  Star, // Added for rating display
  Zap, // Added for Bestseller/Popular badge
  Layers, // Icon for 'Project'
  Dumbbell, // Icon for 'Practice'
  Award, // Icon for 'Certification'
  Book, // Icon for 'Book'
} from 'lucide-react';

// Helper function to get the appropriate icon for non-course resources
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'Book':
      return <Book className="w-5 h-5 text-indigo-600 flex-shrink-0" />;
    case 'Project':
      return <Layers className="w-5 h-5 text-orange-600 flex-shrink-0" />;
    case 'Practice':
      return <Dumbbell className="w-5 h-5 text-green-600 flex-shrink-0" />;
    case 'Certification':
      return <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />;
    default:
      return <BookOpen className="w-5 h-5 text-gray-600 flex-shrink-0" />;
  }
};

// Client component for interactive roadmap
const InteractiveRoadmapClient = ({ roadmap }: { roadmap: any }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getStepColor = (difficulty: string, isCompleted: boolean) => {
    if (isCompleted) return 'bg-green-500 border-green-600 text-white';

    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200';
      case 'Intermediate':
        return 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200';
      case 'Advanced':
        return 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200';
      default:
        return 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200';
    }
  };

  // Group steps by category or create a flow
  const createRoadmapFlow = () => {
    const steps = roadmap.steps;
    const rows: any[][] = [];
    let currentRow: any[] = [];

    steps.forEach((step: any, index: number) => {
      // Create branching logic - every 3 steps start a new row
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
  const selectedStepData = selectedStep ? roadmap.steps.find((step: any) => step.id === selectedStep) : null;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Interactive Learning Path</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
              <span>Beginner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
              <span>Intermediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Advanced</span>
            </div>
          </div>
        </div>

        {/* Visual Roadmap Flow */}
        <div className="relative min-w-max">
          {roadmapFlow.map((row, rowIndex) => (
            <div key={rowIndex} className="relative mb-12">
              {/* Row connector line to next row */}
              {rowIndex < roadmapFlow.length - 1 && (
                <div className="absolute left-1/2 -bottom-6 w-0.5 h-6 bg-gray-300 transform -translate-x-0.5"></div>
              )}

              <div className="flex items-center justify-center gap-8 flex-wrap">
                {row.map((step, stepIndex) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isSelected = selectedStep === step.id;

                  return (
                    <div key={step.id} className="relative flex items-center">
                      {/* Connector to next step in row */}
                      {stepIndex < row.length - 1 && (
                        <div className="absolute -right-4 top-1/2 w-8 h-0.5 bg-gray-300 transform -translate-y-0.5 z-0">
                          <ArrowRight className="w-4 h-4 text-gray-400 absolute -right-2 -top-2" />
                        </div>
                      )}

                      {/* Step Node */}
                      <div
                        className={`
                          relative z-10 min-w-48 max-w-64 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform
                          ${getStepColor(step.difficulty, isCompleted)}
                          ${isSelected ? 'scale-105 shadow-lg ring-2 ring-blue-400' : 'hover:scale-102 hover:shadow-md'}
                        `}
                        onClick={() => {
                          setSelectedStep(selectedStep === step.id ? null : step.id);
                        }}
                      >
                        {/* Completion Toggle */}
                        <div className="absolute -top-2 -right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStepCompletion(step.id);
                            }}
                            className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>

                        {/* Step Content */}
                        <div className="mb-2">
                          <h3 className="font-bold text-sm mb-1 leading-tight">{step.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-0.5 bg-white bg-opacity-70 rounded">
                              {step.difficulty}
                            </span>
                            <span className="text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </span>
                          </div>
                        </div>

                        {/* Skills Preview */}
                        <div className="flex flex-wrap gap-1">
                          {step.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                            <span
                              key={skillIndex}
                              className="text-xs px-1.5 py-0.5 bg-white bg-opacity-50 rounded text-current"
                            >
                              {skill}
                            </span>
                          ))}
                          {step.skills.length > 3 && (
                            <span className="text-xs px-1.5 py-0.5 bg-white bg-opacity-50 rounded text-current">
                              +{step.skills.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Progress Indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
                          {isCompleted && (
                            <div className="h-full bg-white bg-opacity-60 w-full transition-all duration-300"></div>
                          )}
                        </div>
                      </div>

                      {/* Branch indicator for alternative paths */}
                      {step.alternatives && (
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                          <GitBranch className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Statistics */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Progress: {completedSteps.size} of {roadmap.steps.length} steps completed
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedSteps.size / roadmap.steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Details Panel (Modal) */}
      {selectedStepData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-start justify-between mb-4 border-b pb-4">
                <h3 className="text-3xl font-extrabold text-gray-900">{selectedStepData.title}</h3>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 mb-6">{selectedStepData.description}</p>

              {/* Skills */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Skills you&apos;ll learn:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStepData.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Learning Resources:</h4>
                <div className="space-y-4">
                  {selectedStepData.resources.map((resource: any, index: number) => {
                    const isCourse = resource.type === 'Course';

                    return (
                      <div
                        key={index}
                        className={`
                          flex flex-col p-4 rounded-xl shadow-lg transition-shadow duration-300
                          ${isCourse ? 'border-2 border-blue-400 bg-blue-50/70' : 'border border-gray-200 bg-white shadow-sm'}
                        `}
                      >
                        <div className="flex items-start gap-4 mb-3">
                          {/* Thumbnail or Icon */}
                          {isCourse && resource.thumbnailUrl ? (
                            <img
                              src={resource.thumbnailUrl}
                              alt={resource.title}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                              onError={(e) => { 
                                // Fallback to a placeholder image if the URL fails
                                e.currentTarget.onerror = null; 
                                e.currentTarget.src = "https://placehold.co/64x64/E0F2F1/0D9488?text=Course"; 
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center mt-1">
                                {getResourceIcon(resource.type)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-extrabold text-lg leading-tight ${isCourse ? 'text-blue-900' : 'text-gray-900'}`}>{resource.title}</span>
                            </div>
                            {resource.provider && (
                                <p className="text-sm text-gray-500 mb-2">Provider: <span className="font-semibold text-gray-700">{resource.provider}</span></p>
                            )}
                            <p className="text-sm text-gray-700">{resource.description}</p>
                          </div>
                        </div>

                        {/* Course Stats & Action */}
                        <div className={`pt-3 flex flex-wrap justify-between items-center gap-4 ${isCourse ? 'border-t border-blue-200' : 'border-t border-gray-100'}`}>
                          
                          {isCourse && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                {/* Rating */}
                                {resource.rating && (
                                    <span className="flex items-center gap-1 font-medium text-gray-700">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        {resource.rating} ({resource.students ? `${Math.round(resource.students / 1000)}k` : 'N/A'} students)
                                    </span>
                                )}
                                {/* Duration */}
                                {resource.duration && (
                                    <span className="flex items-center gap-1 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        {resource.duration}
                                    </span>
                                )}
                                {/* Level Badge */}
                                {resource.level && (
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${resource.level === 'Beginner' ? 'bg-emerald-100 text-emerald-800' : resource.level === 'Intermediate' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                                        {resource.level}
                                    </span>
                                )}
                                {/* Bestseller Badge */}
                                {(resource.isBestseller || resource.isPopular) && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                                        <Zap className="w-3 h-3"/> {resource.isBestseller ? 'Bestseller' : 'Popular'}
                                    </span>
                                )}
                            </div>
                          )}

                          {/* Price and Link */}
                          <div className="flex items-center gap-3">
                            {isCourse && resource.price && (
                                <div className="flex items-center gap-2">
                                    {resource.price.current === 0 ? (
                                        <span className="text-xl font-bold text-green-600">FREE</span>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {resource.price.current < resource.price.original && (
                                                <span className="text-sm line-through text-gray-500">
                                                    {resource.price.original.toFixed(2)} {resource.price.currency}
                                                </span>
                                            )}
                                            <span className="text-xl font-bold text-red-600">
                                                {resource.price.current.toFixed(2)} {resource.price.currency}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`
                                        flex items-center gap-1 px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg text-white
                                        ${isCourse ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-800'}
                                    `}
                                >
                                    {isCourse ? 'Go to Course' : 'View Resource'}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveRoadmapClient;
