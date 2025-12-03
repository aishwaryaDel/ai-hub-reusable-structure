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

class AuthApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(api.endpoints.auth.login, credentials);
  }
}

export const authApi = new AuthApiService();
