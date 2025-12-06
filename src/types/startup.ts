// types/startup.ts

export type IndustryType = 
  | 'AI/ML'
  | 'FinTech'
  | 'HealthTech'
  | 'EdTech'
  | 'E-commerce'
  | 'SaaS'
  | 'Cybersecurity'
  | 'DevTools'
  | 'CleanTech'
  | 'Blockchain'
  | 'Other';

export type CompanySize = 
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '500+';

export type FundingStage = 
  | 'Pre-Seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C'
  | 'Series D+'
  | 'Acquired'
  | 'Public';

export interface Startup {
  id: string;
  name: string;
  slug: string;
  description: string;
  fullDescription?: string;
  industry: IndustryType;
  size: CompanySize;
  fundingStage: FundingStage;
  foundedDate: Date | string;
  location: string;
  websiteUrl: string;
  jobCount?: number;
  logoUrl?: string;
  featured?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface StartupFilters {
  industry?: IndustryType;
  size?: CompanySize;
  fundingStage?: FundingStage;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface StartupListResponse {
  startups: Startup[];
  total: number;
  page: number;
  totalPages: number;
}

export interface StartupSubmission {
  name: string;
  description: string;
  fullDescription?: string;
  industry: IndustryType;
  size: CompanySize;
  fundingStage: FundingStage;
  foundedDate: string;
  location: string;
  websiteUrl: string;
  logoUrl?: string;
  contactEmail: string;
  contactName: string;
}