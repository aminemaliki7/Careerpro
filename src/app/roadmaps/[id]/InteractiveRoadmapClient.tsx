'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  ExternalLink,
  CheckCircle,
  Circle,
  Star,
  Book,
  Layers,
  Dumbbell,
  Award,
  BookOpen,
} from 'lucide-react';
import type { Roadmap, RoadmapStep, RoadmapResource } from '@/types/roadmap';

interface InteractiveRoadmapClientProps {
  roadmap: Roadmap;
}

// Helper function to get the appropriate icon for non-course resources
const getResourceIcon = (type: RoadmapResource['type']) => {
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

const InteractiveRoadmapClient = ({ roadmap }: InteractiveRoadmapClientProps) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`roadmap-progress-${roadmap.id}`);
    if (saved) {
      setCompletedSteps(new Set(JSON.parse(saved)));
    }
  }, [roadmap.id]);

  // Save progress to localStorage
  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    localStorage.setItem(`roadmap-progress-${roadmap.id}`, JSON.stringify([...newCompleted]));
  };

  const selectedStepData = selectedStep
    ? roadmap.steps.find((step) => step.id === selectedStep) || null
    : null;

  const progressPercentage = (completedSteps.size / roadmap.steps.length) * 100;

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Your Progress</span>
          <span className="font-semibold text-gray-900">
            {completedSteps.size} / {roadmap.steps.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Learning Path</h2>

        {roadmap.steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isSelected = selectedStep === step.id;

          return (
            <div
              key={step.id}
              className={`border-2 rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'border-gray-900 shadow-lg'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleStepCompletion(step.id)}
                    className="flex-shrink-0 mt-1"
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-500">
                            {index + 1}.
                          </span>
                          <h3
                            className={`text-lg font-bold ${
                              isCompleted
                                ? 'line-through text-gray-400'
                                : 'text-gray-900'
                            }`}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {step.description}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                          step.difficulty === 'Beginner'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : step.difficulty === 'Intermediate'
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {step.difficulty}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {step.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{step.duration}</span>
                      </div>
                      {step.resources.length > 0 && (
                        <button
                          onClick={() =>
                            setSelectedStep(isSelected ? null : step.id)
                          }
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          {isSelected ? 'Hide' : 'View'} Resources ({step.resources.length})
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Resources */}
                {isSelected && step.resources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 ml-10">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">
                      Recommended Resources
                    </h4>
                    <div className="space-y-3">
                      {step.resources.map((resource: RoadmapResource, idx) => {
                        const isCourse = resource.type === 'Course';

                        return (
                          <div
                            key={idx}
                            className={`flex flex-col p-4 rounded-lg transition-shadow duration-300 ${
                              isCourse
                                ? 'border-2 border-blue-300 bg-blue-50/50'
                                : 'border border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-4 mb-3">
                              {isCourse && resource.thumbnailUrl ? (
                                <img
                                  src={resource.thumbnailUrl}
                                  alt={resource.title}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      'https://placehold.co/64x64/E0F2F1/0D9488?text=Course';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 flex items-center justify-center mt-1">
                                  {getResourceIcon(resource.type)}
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`font-bold text-base leading-tight ${
                                      isCourse
                                        ? 'text-blue-900'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {resource.title}
                                  </span>
                                </div>
                                {resource.provider && (
                                  <p className="text-sm text-gray-500 mb-2">
                                    Provider:{' '}
                                    <span className="font-semibold text-gray-700">
                                      {resource.provider}
                                    </span>
                                  </p>
                                )}
                                {resource.description && (
                                  <p className="text-sm text-gray-700">
                                    {resource.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div
                              className={`pt-3 flex flex-wrap justify-between items-center gap-4 ${
                                isCourse
                                  ? 'border-t border-blue-200'
                                  : 'border-t border-gray-100'
                              }`}
                            >
                              {isCourse && (
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                  {resource.rating && (
                                    <span className="flex items-center gap-1 font-medium text-gray-700">
                                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                      {resource.rating}
                                      {resource.students &&
                                        ` (${Math.round(resource.students / 1000)}k students)`}
                                    </span>
                                  )}
                                  {resource.duration && (
                                    <span className="flex items-center gap-1 text-gray-600">
                                      <Clock className="w-4 h-4" />
                                      {resource.duration}
                                    </span>
                                  )}
                                  {resource.level && (
                                    <span
                                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                        resource.level === 'Beginner'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : resource.level === 'Intermediate'
                                          ? 'bg-amber-100 text-amber-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {resource.level}
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-3">
                                {isCourse && resource.price && (
                                  <div className="flex items-center gap-2">
                                    {resource.price.current === 0 ? (
                                      <span className="text-lg font-bold text-green-600">
                                        FREE
                                      </span>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        {resource.price.current <
                                          resource.price.original && (
                                          <span className="text-sm line-through text-gray-500">
                                            {resource.price.original.toFixed(2)}{' '}
                                            {resource.price.currency}
                                          </span>
                                        )}
                                        <span className="text-lg font-bold text-red-600">
                                          {resource.price.current.toFixed(2)}{' '}
                                          {resource.price.currency}
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
                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-colors text-white ${
                                      isCourse
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'bg-gray-700 hover:bg-gray-800'
                                    }`}
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InteractiveRoadmapClient;