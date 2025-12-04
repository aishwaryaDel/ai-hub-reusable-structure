import axios, { AxiosInstance, AxiosError } from 'axios';
import { api, messages } from '../config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

/**
 * Centralized API client for all HTTP requests
 * Handles JWT token injection via request interceptor
 * Handles 401/403 errors via response interceptor (auto-logout)
 * Provides typed methods for GET, POST, PUT, DELETE
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: api.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    /**
     * Request interceptor: Automatically attaches JWT token to all requests
     */
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    /**
     * Response interceptor: Handles authentication errors and auto-logout
     * Clears auth data and redirects to home on 401/403
     */
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/';
        }

        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        } else if (error.response?.status) {
          throw new Error(messages.errors.http(error.response.status));
        } else {
          throw new Error(messages.errors.unexpected);
        }
      }
    );
  }

  async get<T>(url: string) {
    const response = await this.client.get<ApiResponse<T>>(url);
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  async post<T>(url: string, data?: unknown) {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  async put<T>(url: string, data?: unknown) {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  async delete<T>(url: string) {
    const response = await this.client.delete<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error || messages.errors.unexpected);
    }
    return response.data.data;
  }

  getInstance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();
