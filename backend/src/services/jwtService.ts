import jwt from 'jsonwebtoken';
import { UserAttributes } from '../types/UserTypes';
import dotenv from 'dotenv';
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
if (!JWT_EXPIRES_IN) {
  throw new Error('JWT_EXPIRES_IN is not defined in environment variables');
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService {
  generateToken(user: UserAttributes): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export const jwtService = new JwtService();
