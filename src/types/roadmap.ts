// src/types/roadmap.ts

// Define a structure for resources that are NOT external courses (e.g., Books, Projects, Practice)
export interface RoadmapResource {
  type: 'Book' | 'Project' | 'Certification' | 'Practice' | 'Course';
  title: string;
  url?: string;
  description?: string;
  
  // Optional fields for courses
  thumbnailUrl?: string;
  provider?: string;
  rating?: number;
  students?: number;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  price?: {
    current: number;
    original: number;
    currency: string;
  };
  isBestseller?: boolean;
  isPopular?: boolean;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  resources: RoadmapResource[];
  recommendedCourseIds: string[];
  prerequisites?: string[];
  stepNumber?: number;
  estimatedTime?: string;
}


export interface Roadmap {
  id: string;
  title: string; // e.g., "Frontend Developer"
  description: string;
  category: string; // e.g., "Development", "Design", "Data Science"
  level: 'Entry Level' | 'Mid Level' | 'Senior Level';
  totalDuration: string; // e.g., "8-12 months"
  avgSalary: {
    min: number;
    max: number;
    currency: string;
  };

  demandLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  steps: RoadmapStep[];
  tags: string[];
  lastUpdated: string;
  author: string;
  image?: string;
}

export interface RoadmapFilters {
  category: string[];
  level: string[];
  difficulty: string[];
  duration: string[];
  demandLevel: string[];
}
