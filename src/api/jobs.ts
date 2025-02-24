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

export async function fetchJobs(filters?: {
  status?: Job['status'];
  workplace?: Job['workplace'];
  job_type?: Job['job_type'];
}): Promise<Job[]> {
  const queryParams = new URLSearchParams();
  
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.workplace) queryParams.append('workplace', filters.workplace);
  if (filters?.job_type) queryParams.append('job_type', filters.job_type);

  const endpoint = `/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await makeRequest<ApiResponse<Job[]>>(endpoint, { method: 'GET' });
  return response.data || [];
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
