jest.mock('../utils/appInsights', () => ({
  initializeAppInsights: jest.fn(),
  logTrace: jest.fn(),
  logEvent: jest.fn(),
  logMetric: jest.fn(),
  logException: jest.fn(),
  getClient: jest.fn(() => null),
}));

jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
