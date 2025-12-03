import { Request, Response, NextFunction } from 'express';
import { jwtService, JwtPayload } from '../services/jwtService';
import { logTrace } from '../utils/appInsights';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      logTrace('Authentication failed: No token provided');
      return res.status(401).json({
        success: false,
        error: 'Access token is required',
      });
    }

    try {
      const decoded = jwtService.verifyToken(token);
      req.user = decoded;
      logTrace('Authentication successful');
      next();
    } catch (error) {
      logTrace('Authentication failed: Invalid token');
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  } catch (error) {
    logTrace('Authentication error');
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (token) {
      try {
        const decoded = jwtService.verifyToken(token);
        req.user = decoded;
      } catch (error) {
        logTrace('Optional auth: Invalid token, continuing without auth');
      }
    }

    next();
  } catch (error) {
    next();
  }
};
