import { makeRequest } from './request';
import { Job } from '../types/jobs';
import { ApiResponse } from './config';

export interface IScholarship {
  title: string;
  organization: string;
  amount: string;
  deadline: Date;
  eligibility: string[];
  requirements: string[];
  field_of_study: string[];
  degree_level: string[];
  country: string;
  link: string;
  status: 'active' | 'expired' | 'upcoming';
  additional_info?: Map<string, any>;
}

export async function fetchJobs(): Promise<Job[]> {
  const queryParams = new URLSearchParams();
  
  const endpoint = `/jobs`
  const response = await makeRequest<ApiResponse<Job[]>>(endpoint, { method: 'GET' });
  console.log(response);
  return response.jobDescriptions || [];
}

export async function fetchJobById(jobId: string): Promise<Job> {
  const endpoint = `/jobs/${jobId}`;
  const response = await makeRequest<ApiResponse<Job>>(endpoint, { method: 'GET' });
  
  if (!response.data) {
    throw new Error('Job not found');
  }
  
  return response.data;
}

export async function fetchScholarships(filters?: {
}): Promise<IScholarship[]> {
  const response = await makeRequest<ApiResponse<IScholarship[]>>('/scholarships', {
    method: 'GET',
  });
  return response.scholarships || [];
}

export async function analyzeJob(text: string): Promise<any> {
  return makeRequest('/features/analyze-job', {
    method: 'POST',
    body: { text:text  }
  });
}
