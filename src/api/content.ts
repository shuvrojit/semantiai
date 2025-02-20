import { makeRequest } from './request';
import { ApiResponse } from './config';
import {TabContent} from '../types';


export async function saveTab(data: TabContent ): Promise<ApiResponse> {
  return makeRequest('/page-content/', {
        method: 'POST',
        body: data,
    });
}
