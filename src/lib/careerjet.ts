import axios from 'axios';
import { CareerjetJob } from '@/types/careerjet';

const API_ENDPOINT = 'https://search.api.careerjet.net/v4/query';

export interface CareerjetQueryParams {
  locale_code?: string;
  keywords?: string;
  location?: string;
  contract_type?: 'p' | 'c' | 't' | 'i' | 'v';
  work_hours?: 'f' | 'p';
  fragment_size?: number;
  sort?: 'relevance' | 'date' | 'salary';
  offset?: number;
  page?: number;
  page_size?: number;
  radius?: number;
  user_ip: string;
  user_agent: string;
}

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

export const fetchCareerjetJobs = async (
  params: CareerjetQueryParams, 
  apiKey: string,
  referer?: string
): Promise<CareerjetResponse> => {
  try {
    // FIX: Add colon after API key for Basic Auth format (apiKey:password)
    const authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
    
    console.log('🔑 Making Careerjet API call with params:', {
      ...params,
      user_agent: params.user_agent.substring(0, 50) + '...'
    });

    const headers: Record<string, string> = {
      Authorization: authHeader,
      'User-Agent': params.user_agent
    };

    // Add Referer header if provided (required by Careerjet API)
    if (referer) {
      headers['Referer'] = referer;
    }

    const { data } = await axios.get(API_ENDPOINT, {
      headers,
      params,
    });

    console.log('✅ Careerjet raw response type:', data.type);

    // Handle different response types
    if (data.type === 'JOBS') {
      return {
        type: 'JOBS',
        hits: data.hits || 0,
        message: data.message || '',
        pages: data.pages || 0,
        response_time: data.response_time || 0,
        jobs: data.jobs || []
      };
    }

    if (data.type === 'LOCATIONS') {
      return {
        type: 'LOCATIONS',
        locations: data.locations || [],
        message: data.message || '',
        response_time: data.response_time || 0
      };
    }

    // Fallback error
    return {
      type: 'ERROR',
      message: data.message || 'Unknown error occurred'
    };

  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      console.error('❌ Careerjet API Error:', {
        status,
        message,
        data: error.response?.data
      });

      if (status === 400) {
        return {
          type: 'ERROR',
          message: `Bad Request: ${message}`
        };
      }

      if (status === 403) {
        return {
          type: 'ERROR',
          message: 'Missing required parameters (user_ip or user_agent)'
        };
      }

      return {
        type: 'ERROR',
        message: `API Error: ${message}`
      };
    }

    // Generic error
    console.error('❌ Unexpected error:', error);
    return {
      type: 'ERROR',
      message: 'Failed to fetch jobs from Careerjet'
    };
  }
};