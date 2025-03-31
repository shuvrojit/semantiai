import { makeRequest } from './request';
import { ApiResponse } from './config';

interface FileUploadResponse {
  fileId: string;
  url?: string;
}

interface FileData {
  fileId: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export async function uploadFile(file: File, userId?: string): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  console.log('Uploading file:', file.name);
  if (userId) {
    formData.append('userId', userId);
  }

  const response = await makeRequest<ApiResponse<FileUploadResponse>>('/file/upload', {
    method: 'POST',
    body: formData
  });

  // Check if response has the expected structure
  if (!response.success || !response.data) {
    // Preserve the original response for better error handling
    const error: any = new Error(response.message || 'File upload failed');
    error.response = response;
    throw error;
  }

  return response.fileId;
}

export async function getFile(fileId: string): Promise<FileData> {
  const response = await makeRequest<ApiResponse<FileData>>(`/features/file/${fileId}`, {
    method: 'GET'
  });

  if (!response.data) {
    throw new Error('File not found');
  }

  return response.data;
}

export async function getUserFiles(userId: string = 'anonymous'): Promise<FileData[]> {
  const response = await makeRequest<ApiResponse<FileData[]>>(`/features/files/${userId}`, {
    method: 'GET'
  });

  if (!response.data) {
    return [];
  }

  return response.data;
}

export async function deleteFile(fileId: string): Promise<void> {
  await makeRequest<ApiResponse<void>>(`/features/file/${fileId}`, {
    method: 'DELETE'
  });
}
