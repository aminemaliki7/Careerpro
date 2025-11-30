export interface CareerjetJob {
  title: string;
  company: string;
  date: string;            // e.g., 'Wed,15 Nov 2025 19:13:43 GMT'
  description: string;
  locations: string;
  salary?: string;
  salary_currency_code?: string;
  salary_max?: number;
  salary_min?: number;
  salary_type?: 'Y' | 'M' | 'W' | 'D' | 'H';
  site: string;
  url: string;             // Tracking URL for application
}

// Response types for better type safety
export interface CareerjetSuccessResponse {
  type: 'JOBS';
  hits: number;
  message: string;
  pages: number;
  response_time: number;
  jobs: CareerjetJob[];
}

export interface CareerjetLocationResponse {
  type: 'LOCATIONS';
  locations: string[];
  message: string;
  response_time: number;
}

export interface CareerjetErrorResponse {
  type: 'ERROR';
  message: string;
}

export type CareerjetResponse = 
  | CareerjetSuccessResponse 
  | CareerjetLocationResponse 
  | CareerjetErrorResponse;

// Mapping salary type codes to human-readable strings
export const SALARY_TYPE_LABELS: Record<string, string> = {
  Y: 'per year',
  M: 'per month',
  W: 'per week',
  D: 'per day',
  H: 'per hour'
};

// Utility to format salary display
export const formatCareerjetSalary = (job: CareerjetJob): string | null => {
  if (!job.salary) return null;
  
  if (job.salary_min && job.salary_max && job.salary_currency_code && job.salary_type) {
    const typeLabel = SALARY_TYPE_LABELS[job.salary_type] || '';
    return `${job.salary_currency_code} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${typeLabel}`;
  }
  
  return job.salary;
};

// Utility to parse Careerjet date string
export const parseCareerjetDate = (dateString: string): Date => {
  return new Date(dateString);
};