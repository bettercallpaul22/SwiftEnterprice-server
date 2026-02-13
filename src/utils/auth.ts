import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Request } from 'express';
import { User } from '../types';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'your-secret-key';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) ?? '7d';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

export const verifyToken = (token: string): User => {
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

  return {
    id: decoded.id as string,
    email: decoded.email as string,
    role: decoded.role as 'passenger' | 'driver',
    createdAt: new Date(),
    updatedAt: new Date(), 
  };
};

export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7)
    : null;
};

export const authenticateToken = (req: Request): User => {
  const token = extractTokenFromHeader(req);
  if (!token) throw new Error('Access token required');
  return verifyToken(token);
};