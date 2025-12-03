import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { validationService } from '../services/validationService';
import { CreateUserDTO, UpdateUserDTO } from '../types/UserTypes';
import { USER_MESSAGES } from '../constants/messages';
import { logTrace, logEvent, logException } from '../utils/appInsights';

export class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting getAllUsers');
      const users = await userService.getAllUsers();
      logEvent('GetAllUsers', { count: users.length.toString() });
      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      });
    } catch (error) {
      logException(error as Error, { context: 'getAllUsers' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USER_MESSAGES.FETCH_ALL_ERROR,
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting getUserById');
      const { id } = req.params;

      if (!id) {
        logTrace('Get user failed: missing ID');
        res.status(400).json({
          success: false,
          error: USER_MESSAGES.ID_REQUIRED,
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        logEvent('UserNotFound', { id });
        res.status(404).json({
          success: false,
          error: USER_MESSAGES.NOT_FOUND,
        });
        return;
      }

      logEvent('GetUserById', { id });
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      logException(error as Error, { context: 'getUserById' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USER_MESSAGES.FETCH_ERROR,
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting createUser');
      const userData: CreateUserDTO = req.body;

      const validationError = validationService.validateUserData(userData);
      if (validationError) {
        logTrace('Create user failed: validation error');
        res.status(400).json({
          success: false,
          error: validationError,
        });
        return;
      }

      const newUser = await userService.createUser(userData);
      logEvent('UserCreated', { id: newUser.id, email: userData.email });

      res.status(201).json({
        success: true,
        data: newUser,
        message: USER_MESSAGES.CREATED_SUCCESS,
      });
    } catch (error) {
      logException(error as Error, { context: 'createUser' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USER_MESSAGES.CREATE_ERROR,
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting updateUser');
      const { id } = req.params;
      const updates: UpdateUserDTO = req.body;

      if (!id) {
        logTrace('Update user failed: missing ID');
        res.status(400).json({
          success: false,
          error: USER_MESSAGES.ID_REQUIRED,
        });
        return;
      }

      if (Object.keys(updates).length === 0) {
        logTrace('Update user failed: no data provided');
        res.status(400).json({
          success: false,
          error: USER_MESSAGES.NO_UPDATE_DATA,
        });
        return;
      }

      const validationError = validationService.validateUserUpdateData(updates);
      if (validationError) {
        logTrace('Update user failed: validation error');
        res.status(400).json({
          success: false,
          error: validationError,
        });
        return;
      }

      const updatedUser = await userService.updateUser(id, updates);

      if (!updatedUser) {
        logEvent('UserNotFound', { id });
        res.status(404).json({
          success: false,
          error: USER_MESSAGES.NOT_FOUND,
        });
        return;
      }

      logEvent('UserUpdated', { id });
      res.status(200).json({
        success: true,
        data: updatedUser,
        message: USER_MESSAGES.UPDATED_SUCCESS,
      });
    } catch (error) {
      logException(error as Error, { context: 'updateUser' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USER_MESSAGES.UPDATE_ERROR,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      logTrace('Starting deleteUser');
      const { id } = req.params;

      if (!id) {
        logTrace('Delete user failed: missing ID');
        res.status(400).json({
          success: false,
          error: USER_MESSAGES.ID_REQUIRED,
        });
        return;
      }

      const user = await userService.getUserById(id);
      if (!user) {
        logEvent('UserNotFound', { id });
        res.status(404).json({
          success: false,
          error: USER_MESSAGES.NOT_FOUND,
        });
        return;
      }

      await userService.deleteUser(id);
      logEvent('UserDeleted', { id });

      res.status(200).json({
        success: true,
        message: USER_MESSAGES.DELETED_SUCCESS,
      });
    } catch (error) {
      logException(error as Error, { context: 'deleteUser' });
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : USER_MESSAGES.DELETE_ERROR,
      });
    }
  }
}

export const userController = new UserController();
