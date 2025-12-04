import { CreateUserDTO, UpdateUserDTO, UserAttributes } from '../types/UserTypes';
import { authService } from './authService';
import { logTrace, logException } from '../utils/appInsights';
import { userRepository } from '../repository/userRepository';

/**
 * Service layer for user business logic
 * Handles password hashing and coordinates with repository layer
 */
export class UserService {
  /**
   * Fetches all users from the repository
   */
  async getAllUsers(): Promise<UserAttributes[]> {
    try {
      logTrace('UserService: Fetching all users');
      const users = await userRepository.findAll();
      logTrace(`UserService: Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      logException(error as Error, { context: 'userService.getAllUsers' });
      throw error;
    }
  }

  /**
   * Fetches a single user by their unique ID
   */
  async getUserById(id: string): Promise<UserAttributes | null> {
    try {
      logTrace('UserService: Fetching user by ID');
      const user = await userRepository.findById(id);
      if (!user) {
        logTrace('UserService: User not found');
        return null;
      }
      logTrace('UserService: User retrieved');
      return user;
    } catch (error) {
      logException(error as Error, { context: 'userService.getUserById' });
      throw error;
    }
  }

  /**
   * Creates a new user with bcrypt-hashed password
   */
  async createUser(userData: CreateUserDTO): Promise<UserAttributes> {
    try {
      logTrace('UserService: Creating new user');
      const { email, password, name, role } = userData;
      const hashedPassword = await authService.hashPassword(password);
      const user = await userRepository.create({ email, password: hashedPassword, name, role });
      logTrace('UserService: User created successfully');
      return user;
    } catch (error) {
      logException(error as Error, { context: 'userService.createUser' });
      throw error;
    }
  }

  /**
   * Updates user information
   * If password is being updated, it gets hashed before saving
   */
  async updateUser(id: string, updates: UpdateUserDTO): Promise<UserAttributes | null> {
    try {
      logTrace('UserService: Updating user');
      const updateData = { ...updates };
      if (updates.password !== undefined) {
        updateData.password = await authService.hashPassword(updates.password);
      }
      await userRepository.update(id, updateData);
      const updatedUser = await userRepository.findById(id);
      if (!updatedUser) {
        logTrace('UserService: User not found for update');
        return null;
      }
      logTrace('UserService: User updated successfully');
      return updatedUser;
    } catch (error) {
      logException(error as Error, { context: 'userService.updateUser' });
      throw error;
    }
  }

  /**
   * Deletes a user by ID and returns success status
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      logTrace('UserService: Deleting user');
      const deleted = await userRepository.delete(id);
      const success = deleted > 0;
      logTrace(`UserService: User deletion ${success ? 'successful' : 'failed'}`);
      return success;
    } catch (error) {
      logException(error as Error, { context: 'userService.deleteUser' });
      throw error;
    }
  }
}

export const userService = new UserService();
