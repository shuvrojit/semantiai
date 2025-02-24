import { makeRequest } from './request';

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

export async function getSummary(data: SummaryRequest): Promise<SummaryResponse> {
    return makeRequest<SummaryResponse>('/summary', {
        method: 'POST',
        body: data,
    });
}

export async function getDetailedOverview(data: OverviewRequest): Promise<OverviewResponse> {
    return makeRequest<OverviewResponse>('/detailed-overview', {
        method: 'POST',
        body: data,
    });
}

export async function getTexts(data: OverviewRequest): Promise<OverviewResponse> {
    return makeRequest<OverviewResponse>('/features/extract', {
        method: 'POST',
        body: data,
    });
}

