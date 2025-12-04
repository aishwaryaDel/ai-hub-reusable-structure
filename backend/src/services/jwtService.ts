import * as jwt from 'jsonwebtoken';
import { UserAttributes } from '../types/UserTypes';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Helper function to get required environment variables
 * Throws error if environment variable is not set
 */
function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in environment variables`);
  }
  return value;
}

const JWT_SECRET = getRequiredEnvVar('JWT_SECRET');
const JWT_EXPIRES_IN = getRequiredEnvVar('JWT_EXPIRES_IN');

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Service responsible for JWT token operations
 * Handles token generation, verification, and decoding
 */
export class JwtService {
  /**
   * Generates a signed JWT token for authenticated user
   * Token includes user ID, email, and role as payload
   */
  generateToken(user: UserAttributes): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
  }

  /**
   * Verifies JWT token signature and expiration
   * Throws error if token is invalid or expired
   */
  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Decodes JWT token without verification
   * Returns null if decoding fails
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export const jwtService = new JwtService();
