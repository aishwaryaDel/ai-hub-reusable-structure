import request from 'supertest';
import app from '../app';
import { authService } from '../services/authService';
import { verifyToken } from '../utils/jwt';

jest.mock('../services/authService');

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('JWT Token Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login - Token Response', () => {
    it('should return a token on successful login', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockAuthResponse = {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          name: 'Test User',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');
    });

    it('should return token with user data containing id, email, name, and role', async () => {
      const loginData = {
        email: 'editor@example.com',
        password: 'password123',
      };

      const mockAuthResponse = {
        user: {
          id: '987e6543-e21b-12d3-a456-426614174000',
          email: 'editor@example.com',
          name: 'Editor User',
          role: 'editor',
        },
        token: 'mock-jwt-token-editor',
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.data.user).toEqual({
        id: '987e6543-e21b-12d3-a456-426614174000',
        email: 'editor@example.com',
        name: 'Editor User',
        role: 'editor',
      });
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('JWT Token Payload Verification', () => {
    it('should encode id, email, and role in token payload', () => {
      const payload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        role: 'admin',
      };

      const jwt = require('jsonwebtoken');
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key', {
        expiresIn: '1h',
      });

      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe(payload.id);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.role).toBe(payload.role);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid-token-string';
      const decoded = verifyToken(invalidToken);
      expect(decoded).toBeNull();
    });

    it('should reject expired token', () => {
      const payload = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        role: 'admin',
      };

      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret-key', {
        expiresIn: '-1h',
      });

      const decoded = verifyToken(expiredToken);
      expect(decoded).toBeNull();
    });
  });
});
