import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCaseApi } from '../usecaseApi';
import { authApi } from '../authApi';
import { apiClient } from '../apiClient';
import { CreateUseCaseDTO, UpdateUseCaseDTO } from '../../types';
import type { AxiosResponse } from 'axios';

const axiosInstance = apiClient.getInstance();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('authApi', () => {
    it('should login successfully', async () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: {
          success: true,
          data: {
            token: 'mock-token',
            user: {
              id: '1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'admin',
            },
          },
        },
      };

      vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce(mockResponse as AxiosResponse);

      const result = await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.token).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should handle login failure', async () => {
      const mockError = {
        response: {
          data: {
            success: false,
            error: 'Invalid credentials',
          },
          status: 401,
        },
      };

      vi.spyOn(axiosInstance, 'post').mockRejectedValueOnce(mockError);

      await expect(
        authApi.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('useCaseApi', () => {
    it('should fetch all use cases', async () => {
      const mockUseCases = [
        {
          id: '1',
          title: 'Use Case 1',
          short_description: 'Description 1',
          department: 'IT',
          status: 'Live',
        },
        {
          id: '2',
          title: 'Use Case 2',
          short_description: 'Description 2',
          department: 'Marketing',
          status: 'PoC',
        },
      ];

      const mockResponse: Partial<AxiosResponse> = {
        data: { success: true, data: mockUseCases },
      };

      vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce(mockResponse as AxiosResponse);

      const result = await useCaseApi.getAllUseCases();

      expect(result).toEqual(mockUseCases);
    });

    it('should handle fetch error', async () => {
      const mockError = {
        response: {
          data: { success: false, error: 'Failed to fetch' },
          status: 500,
        },
      };

      vi.spyOn(axiosInstance, 'get').mockRejectedValueOnce(mockError);

      await expect(useCaseApi.getAllUseCases()).rejects.toThrow();
    });

    it('should fetch a specific use case', async () => {
      const mockUseCase = {
        id: '1',
        title: 'Use Case 1',
        short_description: 'Description 1',
        department: 'IT',
        status: 'Live',
      };

      const mockResponse: Partial<AxiosResponse> = {
        data: { success: true, data: mockUseCase },
      };

      vi.spyOn(axiosInstance, 'get').mockResolvedValueOnce(mockResponse as AxiosResponse);

      const result = await useCaseApi.getUseCaseById('1');

      expect(result).toEqual(mockUseCase);
    });

    it('should create a new use case', async () => {
      const newUseCase = {
        title: 'New Use Case',
        short_description: 'New Description',
        full_description: 'Full Description',
        department: 'IT',
        status: 'Ideation',
        owner_name: 'John Doe',
        owner_email: 'john@example.com',
        business_impact: 'High',
        technology_stack: ['React'],
        internal_links: {},
        tags: ['test'],
        related_use_case_ids: [],
        application_url: '',
      };

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          success: true,
          data: {
            id: '3',
            ...newUseCase,
          },
        },
      };

      vi.spyOn(axiosInstance, 'post').mockResolvedValueOnce(mockResponse as AxiosResponse);

      const result = await useCaseApi.createUseCase(newUseCase as CreateUseCaseDTO);

      expect(result.id).toBe('3');
    });

    it('should update an existing use case', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'MVP',
      };

      const mockResponse: Partial<AxiosResponse> = {
        data: {
          success: true,
          data: {
            id: '1',
            title: 'Updated Title',
            status: 'MVP',
          },
        },
      };

      vi.spyOn(axiosInstance, 'put').mockResolvedValueOnce(mockResponse as AxiosResponse);

      const result = await useCaseApi.updateUseCase('1', updates as UpdateUseCaseDTO);

      expect(result.id).toBe('1');
      expect(result.title).toBe('Updated Title');
    });

    it('should delete a use case', async () => {
      const mockResponse: Partial<AxiosResponse> = {
        data: { success: true },
      };

      vi.spyOn(axiosInstance, 'delete').mockResolvedValueOnce(mockResponse as AxiosResponse);

      await useCaseApi.deleteUseCase('1');

      expect(axiosInstance.delete).toHaveBeenCalled();
    });
  });
});
