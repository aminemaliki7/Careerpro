'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  ExternalLink,
  Star,
  Users,
  Play,
  X,
  Book,
  CheckCircle,
  Code
} from 'lucide-react';

// Types that match your existing RoadmapStep structure
interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  skills: string[];
  resources: StepResource[];
}

interface StepResource {
  type: 'Course' | 'Project' | 'Practice' | 'Book' | 'Certification';
  id?: string;
  title: string;
  url?: string;
  description?: string;
  provider?: string;
  rating?: number;
  students?: number;
  duration?: string;
  price?: {
    original: number;
    current: number;
    currency: string;
  };
  level?: string;
  thumbnailUrl?: string;
  isPopular?: boolean;
  isBestseller?: boolean;
}

interface Course {
  id: string;
  title: string;
  provider: string;
  rating: number;
  students: number;
  duration: string;
  price: {
    original: number;
    current: number;
    currency: string;
  };
  level: string;
  description: string;
  thumbnailUrl: string;
  affiliateUrl: string;
  isPopular?: boolean;
  isBestseller?: boolean;
}

interface CourseModalClientProps {
  step: RoadmapStep;
  stepIndex: number;
  isLastInRow: boolean;
  roadmapIndex: number;
  stepColor: string;
}

const CourseModalClient = ({
  step,
  isLastInRow,
  roadmapIndex,
  stepColor
}: CourseModalClientProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isModalOpen]);

  const courses: Course[] = step.resources
    .filter(r => r.type === 'Course')
    .map(r => ({
      id: r.id || r.title,
      title: r.title,
      provider: r.provider || 'Unknown',
      rating: r.rating || 0,
      students: r.students || 0,
      duration: r.duration || 'N/A',
      price: r.price || { original: 0, current: 0, currency: 'USD' },
      level: r.level || 'Beginner',
      description: r.description || '',
      thumbnailUrl: r.thumbnailUrl || '/course-thumbnail-default.jpg',
      affiliateUrl: r.url || '#',
      isPopular: r.isPopular,
      isBestseller: r.isBestseller,
    }));

  const projectsAndPractices = step.resources.filter(r => r.type === 'Project' || r.type === 'Practice');
  const certifications = step.resources.filter(r => r.type === 'Certification');

  const formatPrice = (price: number, currency: string) => price === 0 ? 'Free' : new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);

  const handleResourceClick = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Step Card */}
      <div className="relative flex items-center w-full sm:w-auto">
        {!isLastInRow && (
          <div className="hidden sm:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gray-300 transform -translate-y-0.5 z-0">
            <div className="absolute -right-2 -top-1.5 w-3 h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45"></div>
          </div>
        )}

        <div
          className={`
            relative z-10 w-full sm:min-w-48 sm:max-w-64 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${stepColor}
            hover:shadow-lg hover:scale-105 group
            active:scale-95 touch-manipulation
            min-h-[140px] flex flex-col
          `}
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
        >
          <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
            {roadmapIndex + 1}
          </div>

          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Play className="w-3 h-3" />
          </div>

          <div className="pt-2 flex-1 flex flex-col">
            <h3 className="font-bold text-sm sm:text-base mb-2 leading-tight group-hover:text-blue-700 flex-shrink-0">{step.title}</h3>
            <div className="flex items-center gap-2 mb-3 flex-wrap flex-shrink-0">
              <span className="text-xs px-3 py-1 bg-white bg-opacity-80 rounded-full font-medium border border-white border-opacity-50">{step.difficulty}</span>
              <span className="text-xs flex items-center gap-1 text-gray-700 bg-white bg-opacity-60 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {step.duration}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3 flex-1">
              {step.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-white bg-opacity-70 rounded-full text-current font-medium border border-white border-opacity-30">{skill}</span>
              ))}
              {step.skills.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-white bg-opacity-70 rounded-full text-current font-medium border border-white border-opacity-30">
                  +{step.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="text-xs text-green-700 flex items-center gap-1 font-medium bg-green-50 bg-opacity-80 px-2 py-1 rounded-full self-start mb-2">
              <Play className="w-3 h-3" />
              {step.resources.length} resources
            </div>

            <div className="text-xs text-gray-600 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-80 px-2 py-1 rounded text-center">
              Tap to view details →
            </div>
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start sm:items-center justify-center overflow-y-auto"
          onClick={handleModalClose}
        >
          <div 
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-3xl md:max-w-4xl min-h-screen sm:min-h-0 sm:max-h-[90vh] overflow-y-auto sm:m-4 mt-0 shadow-2xl"
            onClick={handleModalContentClick}
          >
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white z-20 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{step.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${stepColor.replace('hover:bg-', 'bg-')} border border-white border-opacity-50`}>
                      {step.difficulty}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                      <Clock className="w-4 h-4" />
                      {step.duration}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-3 rounded-full transition-all touch-manipulation"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 pb-8">
              
              {/* Courses Section */}
              {courses.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">🎓</div>
                    Recommended Courses
                  </h4>
                  {courses.map(course => (
                    <div key={course.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 border">
                          <Play className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div>
                              <h5 className="font-bold text-gray-900 text-base leading-tight">{course.title}</h5>
                              <p className="text-sm text-gray-600 font-medium">{course.provider}</p>
                            </div>
                            <div className="flex gap-2">
                              {course.isBestseller && <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs rounded-full font-semibold shadow-sm">Bestseller</span>}
                              {course.isPopular && <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs rounded-full font-semibold shadow-sm">Popular</span>}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full"><Star className="w-4 h-4 text-yellow-500" /><span className="font-medium">{course.rating}</span></div>
                              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full"><Users className="w-4 h-4 text-blue-500" /><span className="font-medium">{course.students.toLocaleString()}</span></div>
                              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full"><Clock className="w-4 h-4 text-green-500" /><span className="font-medium">{course.duration}</span></div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                course.level === 'Beginner' ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' :
                                course.level === 'Intermediate' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                                'bg-gradient-to-r from-red-400 to-red-500 text-white'
                              }`}>{course.level}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResourceClick(course.affiliateUrl);
                              }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold touch-manipulation w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <ExternalLink className="w-4 h-4" /> View Course
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects & Practices Section */}
              {projectsAndPractices.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm">🛠️</div>
                    Projects & Practices
                  </h4>
                  <div className="space-y-3">
                    {projectsAndPractices.map((resource, index) => (
                      <div key={resource.id || index} className="border border-gray-200 rounded-2xl p-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-300">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border">
                            {resource.type === 'Project' ? <Code className="w-6 h-6 text-gray-600" /> : <Book className="w-6 h-6 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900 mb-2 text-base">{resource.title}</h5>
                            <p className="text-sm text-gray-600 leading-relaxed">{resource.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {certifications.length > 0 && (
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-sm">🏆</div>
                    Certifications
                  </h4>
                  <div className="space-y-3">
                    {certifications.map((resource, index) => (
                      <div key={resource.id || index} className="border border-gray-200 rounded-2xl p-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex gap-4 flex-1">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center border">
                              <CheckCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-bold text-gray-900 mb-2 text-base">{resource.title}</h5>
                              <p className="text-sm text-gray-600 mb-2 leading-relaxed">{resource.description}</p>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Provider: {resource.provider}</span>
                            </div>
                          </div>
                          {resource.url && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResourceClick(resource.url!);
                              }}
                              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:from-purple-700 active:to-purple-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold touch-manipulation w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <ExternalLink className="w-4 h-4" /> View Cert
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseModalClient;