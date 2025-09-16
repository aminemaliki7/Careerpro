// src/types/job.ts

export interface JobSalary {
  min: number;
  max: number;
  currency: 'USD' | 'EUR' | 'MAD' | 'GBP' | 'CAD';
  period: 'year' | 'month' | 'hour';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  description: string;
  requirements: string[];
  skills: string[];
  salary?: JobSalary;
  benefits: string[];
  applyUrl: string;
  companyUrl?: string;
  logo?: string;
  postedDate: string;
  expiryDate?: string;
  isRemote: boolean;
  experienceLevel: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
  department: 'Engineering' | 'Marketing' | 'Sales' | 'Design' | 'Product' | 'Data' | 'Operations' | 'HR' | 'Finance' | 'Other';
  featured: boolean;
  sponsored: boolean;
  applicationDeadline?: string;
  companySize?: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  industry?: string;
  tags: string[];
}

export interface JobFilters {
  location?: string[];
  type?: string[];
  experienceLevel?: string[];
  department?: string[];
  salary?: {
    min?: number;
    max?: number;
  };
  remote?: boolean;
  company?: string[];
  skills?: string[];
}

export interface JobSearchParams {
  query?: string;
  filters?: JobFilters;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'salary' | 'company';
  sortOrder?: 'asc' | 'desc';
}