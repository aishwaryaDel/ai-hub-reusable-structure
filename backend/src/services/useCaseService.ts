import { CreateUseCaseDTO, UpdateUseCaseDTO, UseCaseAttributes } from '../types/UseCaseTypes';
import { logTrace, logException } from '../utils/appInsights';
import { useCaseRepository } from '../repository/useCaseRepository';

/**
 * Service layer for use case business logic
 * Abstracts repository operations and adds logging/error handling
 */
export class UseCaseService {
  /**
   * Fetches all use cases from the repository
   */
  async getAllUseCases(): Promise<UseCaseAttributes[]> {
    try {
      logTrace('UseCaseService: Fetching all use cases');
      const useCases = await useCaseRepository.findAll();
      logTrace(`UseCaseService: Retrieved ${useCases.length} use cases`);
      return useCases;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.getAllUseCases' });
      throw error;
    }
  }

  /**
   * Fetches a single use case by its unique ID
   */
  async getUseCaseById(id: string): Promise<UseCaseAttributes | null> {
    try {
      logTrace('UseCaseService: Fetching use case by ID');
      const useCase = await useCaseRepository.findById(id);
      if (!useCase) {
        logTrace('UseCaseService: Use case not found');
        return null;
      }
      logTrace('UseCaseService: Use case retrieved');
      return useCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.getUseCaseById' });
      throw error;
    }
  }

  /**
   * Creates a new use case in the database
   */
  async createUseCase(useCaseData: CreateUseCaseDTO): Promise<UseCaseAttributes> {
    try {
      logTrace('UseCaseService: Creating new use case');
      const useCase = await useCaseRepository.create(useCaseData);
      logTrace('UseCaseService: Use case created successfully');
      return useCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.createUseCase' });
      throw error;
    }
  }

  /**
   * Updates a use case and returns the updated entity
   */
  async updateUseCase(id: string, updates: UpdateUseCaseDTO): Promise<UseCaseAttributes | null> {
    try {
      logTrace('UseCaseService: Updating use case');
      await useCaseRepository.update(id, updates);
      const updatedUseCase = await useCaseRepository.findById(id);
      if (!updatedUseCase) {
        logTrace('UseCaseService: Use case not found for update');
        return null;
      }
      logTrace('UseCaseService: Use case updated successfully');
      return updatedUseCase;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.updateUseCase' });
      throw error;
    }
  }

  /**
   * Deletes a use case by ID and returns success status
   */
  async deleteUseCase(id: string): Promise<boolean> {
    try {
      logTrace('UseCaseService: Deleting use case');
      const deleted = await useCaseRepository.delete(id);
      const success = deleted > 0;
      logTrace(`UseCaseService: Use case deletion ${success ? 'successful' : 'failed'}`);
      return success;
    } catch (error) {
      logException(error as Error, { context: 'useCaseService.deleteUseCase' });
      throw error;
    }
  }
}

export const useCaseService = new UseCaseService();
