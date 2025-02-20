import { makeRequest } from './request';
import { ApiResponse } from './config';

interface SummaryRequest {
    text: string;
    options?: {
        maxLength?: number;
        format?: 'short' | 'medium' | 'long';
    };
}

interface OverviewRequest {
    content: string;
    type?: 'general' | 'technical' | 'business';
}

interface SummaryResponse {
    summary: string;
    length: number;
}

interface OverviewResponse {
    overview: {
        mainPoints: string[];
        keyFindings: string[];
        recommendations?: string[];
    };
}

export async function getSummary(data: SummaryRequest): Promise<ApiResponse<SummaryResponse>> {
    console.log("heloo");
    return makeRequest<SummaryResponse>('/summary', {
        method: 'POST',
        body: data,
    });
}

export async function getDetailedOverview(data: OverviewRequest): Promise<ApiResponse<OverviewResponse>> {
    return makeRequest<OverviewResponse>('/detailed-overview', {
        method: 'POST',
        body: data,
    });
}




export async function getTexts(data: OverviewRequest): Promise<ApiResponse<OverviewResponse>> {
    return makeRequest<OverviewResponse>('/features/extract', {
        method: 'POST',
        body: data,
    });
}

// Semantic Features

