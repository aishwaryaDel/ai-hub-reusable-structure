import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 * Catches all errors passed to next() and returns standardized error response
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err); // Log error for monitoring
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: message,
  });
}
