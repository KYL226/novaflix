// lib/withAdminAuth.ts
import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export async function withAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return { authorized: false, error: 'Non autorisé' };
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return { authorized: false, error: 'Accès refusé : admin requis' };
  }

  return { authorized: true, user: decoded };
}