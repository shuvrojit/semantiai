export const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',  // Change this according to your actual API base URL
};

export type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
};
