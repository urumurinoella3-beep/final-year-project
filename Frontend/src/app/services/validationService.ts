import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dqims_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ValidationError {
  id: number;
  row: number;
  errorType: string;
  field: string;
  description: string;
  value: string;
}

export interface PreviewData {
  row: number;
  data: Record<string, string>;
}

export interface ValidationSessionResponse {
  id: number;
  fileName: string;
  totalRecords: number;
  passedRecords: number;
  failedRecords: number;
  createdAt: string;
  errors: ValidationError[] | null;
  previewData: PreviewData[] | null;
}

export interface ValidationSession {
  id: number;
  fileName: string;
  totalRecords: number;
  passedRecords: number;
  failedRecords: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const validationService = {
  async uploadFile(file: File): Promise<ValidationSessionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ValidationSessionResponse>(
      '/validation/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async getAllSessions(page = 0, size = 10): Promise<PageResponse<ValidationSession>> {
    const response = await api.get<PageResponse<ValidationSession>>('/validation/sessions', {
      params: { page, size },
    });
    return response.data;
  },

  async getSessionById(id: number): Promise<ValidationSessionResponse> {
    const response = await api.get<ValidationSessionResponse>(`/validation/sessions/${id}`);
    return response.data;
  },
};
