import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { LoginCredentials } from '../services/authService';
import { validationService } from '../services/validationService';
import { AUTH_MESSAGES } from '../constants/messages';
import { logTrace, logEvent, logException } from '../utils/appInsights';

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password }: LoginCredentials = req.body;

    const validationError = validationService.validateLoginCredentials(email, password);
    if (validationError) {
      logTrace('Login failed: missing email or password');
      return res.status(400).json({
        success: false,
        error: AUTH_MESSAGES.EMAIL_PASSWORD_REQUIRED
      });
    }

    const result = await authService.login({ email, password });

    if (!result) {
      logEvent('LoginFailed', { email });
      return res.status(401).json({
        success: false,
        error: AUTH_MESSAGES.INVALID_CREDENTIALS
      });
    }

    logEvent('LoginSuccess', { email });
    return res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    logException(err as Error, { context: 'loginUser' });
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      error: AUTH_MESSAGES.LOGIN_ERROR
    });
  }
}
