// src/types/job.ts

export interface Job {
  // Database fields
  id: number | string;  // Can be uuid or number depending on your setup
  owner_id?: string; // Clerk user ID for company-owned postings
  title: string;
  company: string;
  location: string;
  type: string; // More flexible than union type to support any job type
  experience_level?: string;
  salary_range?: string;
  description?: string; // Made optional to match database
  requirements: string[];
  benefits: string[];
  skills: string[];
  remote: boolean;
  featured: boolean;
  contact_email?: string;
  application_url?: string;
  slug: string; // Added slug field for URL routing
  posted_date: string;
  updated_date?: string;
  
  status?: 'pending' | 'approved' | 'rejected';

  // Optional fields for future enhancements
  company_size?: string;
  work_authorization?: string[];
  application_deadline?: string;
  company_logo_url?: string;
  seniority_level?: string;
  employment_status?: string;


  
}

// More specific types for better type safety
export type JobType = 
  | 'CDI' 
  | 'CDD' 
  | 'Full-time' 
  | 'Part-time' 
  | 'Contract' 
  | 'Freelance' 
  | 'Internship'
  | 'Stage';

export type ExperienceLevel = 
  | 'Entry Level' 
  | 'Junior' 
  | 'Mid-Level' 
  | 'Senior' 
  | 'Lead' 
  | 'Manager' 
  | 'Director';

export type SalaryRange = 
  | '< 30k'
  | '30k - 40k'
  | '40k - 50k'
  | '50k - 60k'
  | '60k - 80k'
  | '80k - 100k'
  | '> 100k';

// Interface for job creation/updates
export interface CreateJobInput {
  owner_id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience_level?: string;
  salary_range?: string;
  description?: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  remote: boolean;
  featured: boolean;
  contact_email?: string;
  application_url?: string;
  slug: string;
}

// Interface for job filters
export interface JobFilters {
  searchTerm?: string;
  type?: string;
  location?: string;
  region?: string;
  experience_level?: string;
  salary_range?: string;
  remote?: boolean;
  featured?: boolean;
  sortBy?: 'posted_date' | 'title' | 'company';
}

// Interface for job search results
export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  filters: JobFilters;
}

// Global regions for filtering
export interface GlobalRegion {
  value: string;
  label: string;
  countries: string[];
}

export const GLOBAL_REGIONS: GlobalRegion[] = [
  { 
    value: 'africa', 
    label: 'Afrique', 
    countries: ['Morocco', 'Tunisia', 'Algeria', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Ghana'] 
  },
  { 
    value: 'north-america', 
    label: 'Amérique du Nord', 
    countries: ['United States', 'Canada', 'Mexico'] 
  },
  { 
    value: 'south-america', 
    label: 'Amérique du Sud', 
    countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru'] 
  },
  { 
    value: 'europe', 
    label: 'Europe', 
    countries: ['France', 'Germany', 'United Kingdom', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Belgium', 'Portugal'] 
  },
  { 
    value: 'asia', 
    label: 'Asie', 
    countries: ['China', 'Japan', 'India', 'Singapore', 'South Korea', 'Thailand', 'Malaysia', 'Indonesia'] 
  },
  { 
    value: 'middle-east', 
    label: 'Moyen-Orient', 
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Jordan', 'Lebanon'] 
  },
  { 
    value: 'oceania', 
    label: 'Océanie', 
    countries: ['Australia', 'New Zealand'] 
  }
];

// Utility function to get job region
export const getJobRegion = (location: string): string | null => {
  for (const region of GLOBAL_REGIONS) {
    if (region.countries.some(country => location.toLowerCase().includes(country.toLowerCase()))) {
      return region.value;
    }
  }
  return null;
};

// Utility function to format experience level for display
export const formatExperienceLevel = (level: string): string => {
  const translations: Record<string, string> = {
    'Stage PFE': 'Stage PFE',
    'Entry Level': 'Débutant',
    'Junior': 'Junior',
    'Mid-Level': 'Intermédiaire',
    'Senior': 'Senior',
    'Lead': 'Lead/Expert',
    'Manager': 'Manager',
    'Director': 'Directeur'
  };
  
  return translations[level] || level;
};