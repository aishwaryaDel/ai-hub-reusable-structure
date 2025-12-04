import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { logTrace } from '../utils/appInsights';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logTrace('authMiddleware: No token provided');
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      logTrace('authMiddleware: Invalid token');
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    req.user = decoded;
    logTrace(`authMiddleware: Token validated for user ${decoded.id}`);
    next();
  } catch (error) {
    logTrace(`authMiddleware: Error - ${error}`);
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}
