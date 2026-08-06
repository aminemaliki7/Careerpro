// src/types/application.ts

export interface Application {
  id: string;
  user_id: string; // From Clerk
  job_id: number | string;
  job_title: string;
  company: string;
  location?: string;
  salary_range?: string;
  cv_text?: string;
  cv_file_url?: string;
  cv_file_name?: string;
  generated_email: string;
  status: 'pending' | 'interview' | 'rejected' | 'accepted';
  ai_applied: boolean;
  applied_date: string;
  contacted_date?: string;
  created_at: string;
  updated_at: string;
}

// For creating a new application
export interface CreateApplicationInput {
  job_id: number | string;
  job_title: string;
  company: string;
  location?: string;
  salary_range?: string;
  cv_text?: string;
  cv_file_url?: string;
  cv_file_name?: string;
  generated_email: string;
}

// For application update operations
export interface UpdateApplicationInput {
  status?: 'pending' | 'interview' | 'rejected' | 'accepted';
  contacted_date?: string;
  generated_email?: string;
  cv_text?: string;
  cv_file_url?: string;
  cv_file_name?: string;
}

// For application single response
export interface ApplicationResponse {
  message: string;
  application: Application;
}

// For fetching list of applications
export interface ApplicationsListResponse {
  applications: Application[];
  count: number;
}