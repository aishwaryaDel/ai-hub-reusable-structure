import request from 'supertest';
import app from '../app';
import { signToken } from '../utils/jwt';
import { userService } from '../services/userService';

jest.mock('../services/userService');

const mockUserService = userService as jest.Mocked<typeof userService>;

describe('Auth Middleware Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Protected Routes - authMiddleware', () => {
    it('should return 401 when no token provided', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token-string');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it('should return 401 when Authorization header is malformed', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'InvalidFormat token-here');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should allow access with valid token', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@example.com',
        role: 'admin',
      });

      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User One',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockUserService.getAllUsers.mockResolvedValue(mockUsers as any);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('Role-Based Authorization - authorize middleware', () => {
    it('should return 403 when user role is not authorized for admin-only route', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'viewer@example.com',
        role: 'viewer',
      });

      const newUserData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'user',
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Insufficient permissions');
    });

    it('should allow admin to create users', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@example.com',
        role: 'admin',
      });

      const newUserData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'user',
      };

      const mockCreatedUser = {
        id: '3',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserService.createUser.mockResolvedValue(mockCreatedUser as any);

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(newUserData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should allow admin to delete users', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@example.com',
        role: 'admin',
      });

      const mockUser = {
        id: '1',
        email: 'user1@example.com',
        name: 'User One',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUserService.getUserById.mockResolvedValue(mockUser as any);
      mockUserService.deleteUser.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 403 when non-admin tries to delete users', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'editor@example.com',
        role: 'editor',
      });

      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Insufficient permissions');
    });

    it('should handle role names case-insensitively', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'admin@example.com',
        role: 'ADMIN',
      });

      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User One',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockUserService.getAllUsers.mockResolvedValue(mockUsers as any);

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should allow editor to create use cases', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'editor@example.com',
        role: 'editor',
      });

      const newUseCaseData = {
        title: 'Test Use Case',
        short_description: 'Short desc',
        full_description: 'Full description',
        department: 'IT',
        status: 'active',
        owner_name: 'Owner',
        owner_email: 'owner@example.com',
        technology_stack: ['Node.js'],
        tags: ['test'],
        internal_links: {},
        application_url: 'https://example.com',
      };

      const response = await request(app)
        .post('/api/use-cases')
        .set('Authorization', `Bearer ${token}`)
        .send(newUseCaseData);

      expect([201, 400, 500]).toContain(response.status);
    });

    it('should return 403 when viewer tries to create use cases', async () => {
      const token = signToken({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'viewer@example.com',
        role: 'viewer',
      });

      const newUseCaseData = {
        title: 'Test Use Case',
        short_description: 'Short desc',
        full_description: 'Full description',
        department: 'IT',
        status: 'active',
        owner_name: 'Owner',
        owner_email: 'owner@example.com',
        technology_stack: ['Node.js'],
        tags: ['test'],
        internal_links: {},
        application_url: 'https://example.com',
      };

      const response = await request(app)
        .post('/api/use-cases')
        .set('Authorization', `Bearer ${token}`)
        .send(newUseCaseData);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Insufficient permissions');
    });
  });
});
