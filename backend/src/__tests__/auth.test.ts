import request from 'supertest';
import app from '../app';
import { authService } from '../services/authService';

jest.mock('../services/authService');

const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockAuthResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'admin',
        },
      };

      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('mock-jwt-token');
      expect(response.body.data.user.email).toBe('user@example.com');
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return 400 if email is missing', async () => {
      const loginData = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const loginData = {
        email: 'user@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email and password are required');
    });

    it('should handle server errors', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Internal server error during login');
    });
  });
});
