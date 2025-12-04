import { api } from '../config';
import { apiClient } from './apiClient';
import { UseCase, CreateUseCaseDTO, UpdateUseCaseDTO } from '../types';

/**
 * API service for use case operations
 * Provides CRUD operations for use cases
 */
class UseCaseApiService {
  /**
   * Fetches all use cases from the API
   */
  async getAllUseCases(): Promise<UseCase[]> {
    return apiClient.get<UseCase[]>(api.endpoints.useCases);
  }

  /**
   * Fetches a single use case by ID
   */
  async getUseCaseById(id: string): Promise<UseCase> {
    return apiClient.get<UseCase>(api.endpoints.useCaseById(id));
  }

  /**
   * Creates a new use case (requires authentication)
   */
  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    return apiClient.post<UseCase>(api.endpoints.useCases, useCaseData);
  }

  /**
   * Updates an existing use case (requires authentication)
   */
  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase> {
    return apiClient.put<UseCase>(api.endpoints.useCaseById(id), updates);
  }

  /**
   * Deletes a use case by ID (requires authentication)
   */
  async deleteUseCase(id: string): Promise<void> {
    await apiClient.delete<void>(api.endpoints.useCaseById(id));
  }
}

export const useCaseApi = new UseCaseApiService();
