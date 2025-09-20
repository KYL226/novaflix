// lib/withAdminAuth.ts
import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export async function withAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    console.log('❌ withAdminAuth: Aucun token fourni');
    return { authorized: false, error: 'Non autorisé' };
  }

  const decoded = verifyToken(token);
  console.log('🔍 withAdminAuth: Token décodé:', decoded);
  
  if (!decoded) {
    console.log('❌ withAdminAuth: Token invalide');
    return { authorized: false, error: 'Token invalide' };
  }
  
  if (decoded.role !== 'admin') {
    console.log('❌ withAdminAuth: Rôle non admin:', decoded.role);
    return { authorized: false, error: 'Accès refusé : admin requis' };
  }

  console.log('✅ withAdminAuth: Accès autorisé pour admin');
  return { authorized: true, user: decoded };
}