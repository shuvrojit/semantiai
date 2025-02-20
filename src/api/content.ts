import { makeRequest } from './request';
import { ApiResponse } from './config';
import { TabContent, LinksResponse } from '../types';


export async function saveTab(data: TabContent ): Promise<ApiResponse> {
  return makeRequest('/page-content/', {
        method: 'POST',
        body: data,
    });
}

export async function getLinks(): Promise<LinksResponse> {
  const response = await makeRequest<LinksResponse>('/page-content/', {
    method: 'GET'
  });
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch links');
  }
  return response.data;
}
