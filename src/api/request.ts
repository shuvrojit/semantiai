import { API_CONFIG } from './config';

type RequestOptions = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
};

export async function makeRequest<T>(endpoint: string, options: RequestOptions): Promise<T> {
    try {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        
        // Don't set content-type for FormData, browser will set it automatically with boundary
        const isFormData = options.body instanceof FormData;
        const headers = {
            // Only set Content-Type for non-FormData requests
            ...(!isFormData && { 'Content-Type': 'application/json' }),
            ...options.headers,
        };

        const response = await fetch(url, {
            method: options.method,
            headers,
            // Don't stringify FormData
            body: options.body ? (isFormData ? options.body : JSON.stringify(options.body)) : undefined,
        });

        const data = await response.json();

        if (!response.ok) {
            // Create an axios-like error object
            const error: any = new Error(data.error || 'An error occurred');
            error.response = {
                status: response.status,
                data: data,
                headers: response.headers
            };
            throw error;
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            // If it's already our custom error with response object, throw it as is
            if ((error as any).response) {
                throw error;
            }
            // If it's a network error, create a request error
            const networkError: any = error;
            networkError.request = true;
            throw networkError;
        }
        throw new Error('Unknown error occurred');
    }
}