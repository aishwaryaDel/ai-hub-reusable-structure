import { Request, Response } from 'express';
import { useCaseService } from '../services/useCaseService';
import { validationService } from '../services/validationService';
import { CreateUseCaseDTO, UpdateUseCaseDTO } from '../types/UseCaseTypes';
import { USE_CASE_MESSAGES } from '../constants/messages';
import { logTrace, logEvent, logException } from '../utils/appInsights';

export class UseCaseController {
  async getAllUseCases(req: Request, res: Response): Promise<void> {
    try {
      const useCases = await useCaseService.getAllUseCases();
       logEvent('GetAllUseCases', { count: useCases.length.toString() });
      res.status(200).json({
        success: true,
        data: useCases,
        count: useCases.length,
      });
    } catch (error) {
      logException(error as Error, { context: 'getAllUseCases' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USE_CASE_MESSAGES.FETCH_ALL_ERROR,
      });
    }
  }

  async getUseCaseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        logTrace('Fetch use case failed: missing ID');
        res.status(400).json({
          success: false,
          error: USE_CASE_MESSAGES.ID_REQUIRED,
        });
        return;
      }

      const useCase = await useCaseService.getUseCaseById(id);

      if (!useCase) {
        logEvent('UseCaseNotFound', { id });
        res.status(404).json({
          success: false,
          error: USE_CASE_MESSAGES.NOT_FOUND,
        });
        return;
      }
     logEvent('GetUseCaseById', { id });
      res.status(200).json({
        success: true,
        data: useCase,
      });
    } catch (error) {
      logException(error as Error, { context: 'getUseCaseById' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USE_CASE_MESSAGES.FETCH_ERROR,
      });
    }
  }

  async createUseCase(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting createUseCase');
      const useCaseData: CreateUseCaseDTO = req.body;

      const validationError = validationService.validateUseCaseData(useCaseData);
      if (validationError) {
        logTrace('Create use case failed: validation error');
        res.status(400).json({
          success: false,
          error: validationError,
        });
        return;
      }

      const newUseCase = await useCaseService.createUseCase(useCaseData);
      logEvent('UseCaseCreated', { id: newUseCase.id, title: useCaseData.title });

      res.status(201).json({
        success: true,
        data: newUseCase,
        message: USE_CASE_MESSAGES.CREATED_SUCCESS,
      });
    } catch (error) {
      logException(error as Error, { context: 'createUseCase' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USE_CASE_MESSAGES.CREATE_ERROR,
      });
    }
  }

  async updateUseCase(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting updateUseCase');
      const { id } = req.params;
      const updates: UpdateUseCaseDTO = req.body;

      if (!id) {
        logTrace('Update use case failed: missing ID');
        res.status(400).json({
          success: false,
          error: USE_CASE_MESSAGES.ID_REQUIRED,
        });
        return;
      }

      if (Object.keys(updates).length === 0) {
        logTrace('Update use case failed: no data provided');
        res.status(400).json({
          success: false,
          error: USE_CASE_MESSAGES.NO_UPDATE_DATA,
        });
        return;
      }

      const validationError = validationService.validateUseCaseUpdateData(updates);
      if (validationError) {
        logTrace('Update use case failed: validation error');
        res.status(400).json({
          success: false,
          error: validationError,
        });
        return;
      }

      const updatedUseCase = await useCaseService.updateUseCase(id, updates);

      if (!updatedUseCase) {
        logEvent('UseCaseNotFound', { id });
        res.status(404).json({
          success: false,
          error: USE_CASE_MESSAGES.NOT_FOUND,
        });
        return;
      }

      logEvent('UseCaseUpdated', { id });
      res.status(200).json({
        success: true,
        data: updatedUseCase,
        message: USE_CASE_MESSAGES.UPDATED_SUCCESS,
      });
    } catch (error) {
      logException(error as Error, { context: 'updateUseCase' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USE_CASE_MESSAGES.UPDATE_ERROR,
      });
    }
  }

  async deleteUseCase(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting deleteUseCase');
      const { id } = req.params;

      if (!id) {
        logTrace('Delete use case failed: missing ID');
        res.status(400).json({
          success: false,
          error: USE_CASE_MESSAGES.ID_REQUIRED,
        });
        return;
      }

      const useCase = await useCaseService.getUseCaseById(id);
      if (!useCase) {
        logEvent('UseCaseNotFound', { id });
        res.status(404).json({
          success: false,
          error: USE_CASE_MESSAGES.NOT_FOUND,
        });
        return;
      }

      await useCaseService.deleteUseCase(id);
      logEvent('UseCaseDeleted', { id });

      res.status(200).json({
        success: true,
        message: USE_CASE_MESSAGES.DELETED_SUCCESS,
      });
    } catch (error) {
      logException(error as Error, { context: 'deleteUseCase' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USE_CASE_MESSAGES.DELETE_ERROR,
      });
    }
  }

}

export const useCaseController = new UseCaseController();
