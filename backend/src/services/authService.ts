import bcrypt from 'bcrypt';
import { logTrace, logException } from '../utils/appInsights';
import { userRepository } from '../repository/userRepository';
import { jwtService } from './jwtService';

const SALT_ROUNDS = 10;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

/**
 * Service responsible for authentication logic
 * Handles user login, password verification, and JWT token generation
 */
export class AuthService {
  /**
   * Authenticates a user with email and password
   * Returns user info and JWT token on success, null on failure
   * Supports both plaintext (for testing) and bcrypt-hashed passwords
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    try {
      logTrace('AuthService: Starting login');
      const { email, password } = credentials;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        logTrace('AuthService: User not found');
        return null;
      }
      const isPasswordValid = password === user.password || await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        logTrace('AuthService: Invalid password');
        return null;
      }
      logTrace('AuthService: Login successful');

      const token = jwtService.generateToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      logException(error as Error, { context: 'authService.login' });
      throw error;
    }
  }

  /**
   * Hashes a password using bcrypt with configured salt rounds
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
}

export const authService = new AuthService();
