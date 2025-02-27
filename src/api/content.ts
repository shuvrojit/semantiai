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
