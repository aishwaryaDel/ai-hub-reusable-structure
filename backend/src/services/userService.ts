import { CreateUserDTO, UpdateUserDTO, UserAttributes } from '../types/UserTypes';
import { authService } from './authService';
import { logTrace, logException } from '../utils/appInsights';
import { userRepository } from '../repository/userRepository';

export class UserService {
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

  async deleteUser(id: string): Promise<boolean> {
    try {
      logTrace('UserService: Deleting user');
      await userRepository.delete(id);
      const success = true;
      logTrace(`UserService: User deletion ${success ? 'successful' : 'failed'}`);
      return success;
    } catch (error) {
      logException(error as Error, { context: 'userService.deleteUser' });
      throw error;
    }
  }
}

export const userService = new UserService();
