import { api } from '../config';
import { apiClient } from './apiClient';
import { UseCase, CreateUseCaseDTO, UpdateUseCaseDTO } from '../types';

class UseCaseApiService {
  async getAllUseCases(): Promise<UseCase[]> {
    return apiClient.get<UseCase[]>(api.endpoints.useCases);
  }

  async getUseCaseById(id: string): Promise<UseCase> {
    return apiClient.get<UseCase>(api.endpoints.useCaseById(id));
  }

  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCase> {
    return apiClient.post<UseCase>(api.endpoints.useCases, useCaseData);
  }

  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCase> {
    return apiClient.put<UseCase>(api.endpoints.useCaseById(id), updates);
  }

  async deleteUseCase(id: string): Promise<void> {
    await apiClient.delete<void>(api.endpoints.useCaseById(id));
  }
}

export const useCaseApi = new UseCaseApiService();
