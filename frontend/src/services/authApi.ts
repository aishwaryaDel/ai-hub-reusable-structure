import { api } from '../config';
import { apiClient } from './apiClient';
import { User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * API service for authentication operations
 * Handles user login and returns JWT token
 */
class AuthApiService {
  /**
   * Authenticates user with email and password
   * Returns JWT token and user info on success
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(api.endpoints.auth.login, credentials);
  }
}

export const authApi = new AuthApiService();
