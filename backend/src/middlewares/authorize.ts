import { Request, Response, NextFunction } from 'express';
import { logTrace } from '../utils/appInsights';

export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      logTrace('authorize: No user in request');
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const userRole = req.user.role.toLowerCase();
    const hasRole = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!hasRole) {
      logTrace(`authorize: Insufficient permissions - user role: ${req.user.role}, allowed: ${allowedRoles.join(', ')}`);
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    logTrace(`authorize: Role authorized - ${req.user.role}`);
    next();
  };
}
