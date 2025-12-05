import { Sequelize } from 'sequelize';

process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'test';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';

jest.mock('../utils/appInsights', () => ({
  initializeAppInsights: jest.fn(),
  logTrace: jest.fn(),
  logEvent: jest.fn(),
  logMetric: jest.fn(),
  logException: jest.fn(),
  getClient: jest.fn(() => null),
}));

jest.mock('../middlewares/authMiddleware', () => ({
  authenticateToken: (req: any, res: any, next: any) => next(),
}));

jest.mock('../config/database', () => {
  const { Sequelize } = require('sequelize');
  const mockSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  return {
    sequelize: mockSequelize,
    default: mockSequelize,
  };
});
