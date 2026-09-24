import axios from 'axios';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const code = data?.error?.code || 'UNKNOWN_ERROR';
      const message = data?.error?.message || error.message || 'An unexpected error occurred';
      return Promise.reject(new ApiClientError(status, code, message));
    }
    return Promise.reject(new ApiClientError(0, 'NETWORK_ERROR', error.message || 'Network error'));
  },
);
