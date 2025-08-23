// lib/auth.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token: string): User | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch (err) {
    return null;
  }
};