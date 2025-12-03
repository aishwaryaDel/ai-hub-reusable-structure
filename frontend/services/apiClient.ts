import axios, { AxiosInstance, AxiosError } from 'axios';
import { api, messages } from '../config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: api.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<unknown>>) => {
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
