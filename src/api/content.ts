import { makeRequest } from './request';
import { TabContent, LinksResponse } from '../types';

export async function saveTab(data: TabContent): Promise<void> {
  return makeRequest('/page-content/', {
    method: 'POST',
    body: data,
  });
}

export async function getLinks(): Promise<LinksResponse> {
  return makeRequest<LinksResponse>('/page-content/', {
    method: 'GET'
  });
}

export async function analyzeContent(id: string): Promise<any> {
  return makeRequest('/features/analyze-by-id', {
    method: 'POST',
    body: { id }
  });
}

export async function summarizeContent(id: string): Promise<any> {
  return makeRequest('/features/summarize-by-id', {
    method: 'POST',
    body: { id }
  });
}

export async function getAllContent(options?: {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: ('title' | 'text' | 'url')[];
}): Promise<{
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}> {
  // Build query string from options
  const queryParams = new URLSearchParams();
  
  if (options?.sortBy) queryParams.append('sortBy', options.sortBy);
  if (options?.sortOrder) queryParams.append('sortOrder', options.sortOrder);
  if (options?.page) queryParams.append('page', options.page.toString());
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.search) queryParams.append('search', options.search);
  if (options?.searchFields && options.searchFields.length > 0) {
    queryParams.append('searchFields', options.searchFields.join(','));
  }
  
  const queryString = queryParams.toString();
  const url = `/page-content/${queryString ? `?${queryString}` : ''}`;
  
  return makeRequest(url, {
    method: 'GET'
  });
}
