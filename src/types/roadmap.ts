// src/types/roadmap.ts
export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "2-3 months"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  resources: {
    type: 'Course' | 'Book' | 'Project' | 'Certification' | 'Practice';
    title: string;
    url?: string;
    description?: string;
  }[];
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