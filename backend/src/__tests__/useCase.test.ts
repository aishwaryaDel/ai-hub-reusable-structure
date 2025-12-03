import request from 'supertest';
import app from '../app';
import { useCaseService } from '../services/useCaseService';

jest.mock('../services/useCaseService');

const mockUseCaseService = useCaseService as jest.Mocked<typeof useCaseService>;

describe('Use Case API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/use-cases', () => {
    it('should return all use cases', async () => {
      const mockUseCases = [
        {
          id: '1',
          title: 'Test Use Case 1',
          short_description: 'Short desc 1',
          full_description: 'Full desc 1',
          department: 'IT',
          status: 'Live',
          owner_name: 'John Doe',
          owner_email: 'john@example.com',
          business_impact: 'High impact',
          technology_stack: ['React', 'Node.js'],
          internal_links: { wiki: 'http://wiki.example.com' },
          tags: ['ai', 'automation'],
          related_use_case_ids: [],
          application_url: 'http://app.example.com',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          title: 'Test Use Case 2',
          short_description: 'Short desc 2',
          full_description: 'Full desc 2',
          department: 'Marketing',
          status: 'PoC',
          owner_name: 'Jane Smith',
          owner_email: 'jane@example.com',
          business_impact: 'Medium impact',
          technology_stack: ['Python', 'TensorFlow'],
          internal_links: { confluence: 'http://confluence.example.com' },
          tags: ['ml', 'analytics'],
          related_use_case_ids: ['1'],
          application_url: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      mockUseCaseService.getAllUseCases.mockResolvedValue(mockUseCases as any);

      const response = await request(app).get('/api/use-cases');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(mockUseCaseService.getAllUseCases).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      mockUseCaseService.getAllUseCases.mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app).get('/api/use-cases');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Database error');
    });
  });

  describe('GET /api/use-cases/:id', () => {
    it('should return a specific use case', async () => {
      const mockUseCase = {
        id: '1',
        title: 'Test Use Case',
        short_description: 'Short description',
        full_description: 'Full description',
        department: 'IT',
        status: 'Live',
        owner_name: 'John Doe',
        owner_email: 'john@example.com',
        business_impact: 'High impact',
        technology_stack: ['React', 'Node.js'],
        internal_links: { wiki: 'http://wiki.example.com' },
        tags: ['ai', 'automation'],
        related_use_case_ids: [],
        application_url: 'http://app.example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUseCaseService.getUseCaseById.mockResolvedValue(mockUseCase as any);

      const response = await request(app).get('/api/use-cases/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('1');
      expect(response.body.data.title).toBe('Test Use Case');
      expect(mockUseCaseService.getUseCaseById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if use case not found', async () => {
      mockUseCaseService.getUseCaseById.mockResolvedValue(null);

      const response = await request(app).get('/api/use-cases/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Use case not found');
    });
  });

  describe('POST /api/use-cases', () => {
    it('should create a new use case', async () => {
      const newUseCaseData = {
        title: 'New Use Case',
        short_description: 'New short description',
        full_description: 'New full description',
        department: 'R&D',
        status: 'Ideation',
        owner_name: 'Alice Johnson',
        owner_email: 'alice@example.com',
        business_impact: 'Low impact',
        technology_stack: ['Vue.js', 'Express'],
        internal_links: { jira: 'http://jira.example.com' },
        tags: ['prototype'],
        related_use_case_ids: [],
        application_url: null,
      };

      const mockCreatedUseCase = {
        id: '3',
        ...newUseCaseData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUseCaseService.createUseCase.mockResolvedValue(mockCreatedUseCase as any);

      const response = await request(app)
        .post('/api/use-cases')
        .send(newUseCaseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('3');
      expect(response.body.data.title).toBe('New Use Case');
      expect(mockUseCaseService.createUseCase).toHaveBeenCalledWith(
        newUseCaseData
      );
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        title: '',
        short_description: 'Short desc',
      };

      const response = await request(app)
        .post('/api/use-cases')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeTruthy();
    });
  });

  describe('PUT /api/use-cases/:id', () => {
    it('should update an existing use case', async () => {
      const updateData = {
        title: 'Updated Title',
        status: 'MVP',
      };

      const mockUpdatedUseCase = {
        id: '1',
        title: 'Updated Title',
        short_description: 'Short description',
        full_description: 'Full description',
        department: 'IT',
        status: 'MVP',
        owner_name: 'John Doe',
        owner_email: 'john@example.com',
        business_impact: 'High impact',
        technology_stack: ['React', 'Node.js'],
        internal_links: { wiki: 'http://wiki.example.com' },
        tags: ['ai', 'automation'],
        related_use_case_ids: [],
        application_url: 'http://app.example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUseCaseService.updateUseCase.mockResolvedValue(mockUpdatedUseCase as any);

      const response = await request(app)
        .put('/api/use-cases/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.status).toBe('MVP');
      expect(mockUseCaseService.updateUseCase).toHaveBeenCalledWith(
        '1',
        updateData
      );
    });

    it('should return 404 if use case not found', async () => {
      mockUseCaseService.updateUseCase.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/use-cases/999')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Use case not found');
    });

    it('should return 400 if no data provided', async () => {
      const response = await request(app).put('/api/use-cases/1').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No update data provided');
    });
  });

  describe('DELETE /api/use-cases/:id', () => {
    it('should delete a use case', async () => {
      const mockUseCase = {
        id: '1',
        title: 'Test Use Case',
        short_description: 'Short description',
        full_description: 'Full description',
        department: 'IT',
        status: 'Live',
        owner_name: 'John Doe',
        owner_email: 'john@example.com',
        business_impact: 'High impact',
        technology_stack: ['React', 'Node.js'],
        internal_links: { wiki: 'http://wiki.example.com' },
        tags: ['ai', 'automation'],
        related_use_case_ids: [],
        application_url: 'http://app.example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockUseCaseService.getUseCaseById.mockResolvedValue(mockUseCase as any);
      mockUseCaseService.deleteUseCase.mockResolvedValue(true);

      const response = await request(app).delete('/api/use-cases/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Use case deleted successfully');
      expect(mockUseCaseService.deleteUseCase).toHaveBeenCalledWith('1');
    });

    it('should return 404 if use case not found', async () => {
      mockUseCaseService.getUseCaseById.mockResolvedValue(null);

      const response = await request(app).delete('/api/use-cases/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Use case not found');
    });
  });
});
