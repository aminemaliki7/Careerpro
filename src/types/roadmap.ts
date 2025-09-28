// src/types/roadmap.ts

// Define a structure for resources that are NOT external courses (e.g., Books, Projects, Practice)
export interface RoadmapResource {
  type: 'Book' | 'Project' | 'Certification' | 'Practice';
  title: string;
  url?: string;
  description?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "2-3 months"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  
  // Stores non-course resources
  resources: RoadmapResource[]; 
  
  // Stores IDs used to fetch detailed course objects from centralized data
  recommendedCourseIds: string[]; 
  prerequisites?: string[];
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
