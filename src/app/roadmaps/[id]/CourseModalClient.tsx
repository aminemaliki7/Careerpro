'use client';

import { useState } from 'react';
import {
  Clock,
  ExternalLink,
  Star,
  Users,
  Play,
  X
} from 'lucide-react';

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

interface ProjectOrPractice {
  id: string;
  type: 'Project' | 'Practice';
  title: string;
  description: string;
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

interface CourseModalClientProps {
  step: {
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    skills: string[];
    resources: StepResource[];
  };
  stepIndex: number;
  isLastInRow: boolean;
  roadmapIndex: number;
  stepColor: string;
}

const CourseModalClient = ({
  step,
  stepIndex,
  isLastInRow,
  roadmapIndex,
  stepColor
}: CourseModalClientProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter real courses from the step's resources
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
      isBestseller: r.isBestseller
    }));

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  const handleCourseClick = (affiliateUrl: string) => {
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Step Card */}
      <div className="relative flex items-center">
        {!isLastInRow && (
          <div className="absolute -right-4 top-1/2 w-8 h-0.5 bg-gray-300 transform -translate-y-0.5 z-0">
            <div className="absolute -right-2 -top-1.5 w-3 h-3 border-r-2 border-t-2 border-gray-400 transform rotate-45"></div>
          </div>
        )}

        <div
          className={`
            relative z-10 min-w-48 max-w-64 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
            ${stepColor}
            hover:shadow-lg hover:scale-105 group
          `}
          onClick={() => setIsModalOpen(true)}
        >
          {/* Step Number */}
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
            {roadmapIndex + 1}
          </div>

          {/* Play Icon */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
            <Play className="w-3 h-3" />
          </div>

          <div className="pt-2">
            <h3 className="font-bold text-sm mb-2 leading-tight group-hover:text-blue-700">{step.title}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 bg-white bg-opacity-70 rounded-full font-medium">{step.difficulty}</span>
              <span className="text-xs flex items-center gap-1 text-gray-600">
                <Clock className="w-3 h-3" />
                {step.duration}
              </span>
            </div>

            {/* Skills Preview */}
            <div className="flex flex-wrap gap-1 mb-3">
              {step.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-white bg-opacity-60 rounded-full text-current font-medium">{skill}</span>
              ))}
              {step.skills.length > 3 && (
                <span className="text-xs px-2 py-0.5 bg-white bg-opacity-60 rounded-full text-current font-medium">
                  +{step.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="text-xs text-green-700 flex items-center gap-1 font-medium">
              <Play className="w-3 h-3" />
              {courses.length} courses available
            </div>

            <div className="text-xs text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view courses →
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white rounded-t-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${stepColor.replace('hover:bg-', 'bg-').replace('hover:scale-105', '').replace('cursor-pointer', '').replace('group', '').replace('transition-all duration-200', '')}`}>
                      {step.difficulty}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {step.duration}
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Courses List */}
            <div className="p-6 space-y-4">
              {courses.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <Play className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-bold text-gray-900 mb-1">{course.title}</h5>
                          <p className="text-sm text-gray-600">{course.provider}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.isBestseller && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded font-medium">Bestseller</span>}
                          {course.isPopular && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium">Popular</span>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" />{course.rating}</div>
                          <div className="flex items-center gap-1"><Users className="w-4 h-4" />{course.students.toLocaleString()}</div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              course.level === 'Beginner'
                                ? 'bg-green-100 text-green-800'
                                : course.level === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {course.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {course.price.original > course.price.current && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(course.price.original, course.price.currency)}
                              </div>
                            )}
                            <div className="font-bold text-lg text-green-600">
                              {formatPrice(course.price.current, course.price.currency)}
                            </div>
                          </div>

                          <button
                            onClick={() => handleCourseClick(course.affiliateUrl)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Course
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Affiliate Disclaimer */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Affiliate Disclosure:</strong> We earn a commission from qualifying purchases made through these links. 
                  This helps us maintain and improve our free career guidance content. The price you pay remains the same.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseModalClient;
