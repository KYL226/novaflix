// app/api/payments/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
  }

  const { subscriptionType } = await req.json();

  if (!['basic', 'premium'].includes(subscriptionType)) {
    return NextResponse.json({ error: 'Type d\'abonnement invalide' }, { status: 400 });
  }

  const users = await db.getUsers();
  const user = await users.findOne({ email: decoded.email });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  // Générer un "ID de transaction" fictif
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Mettre en session ou en DB un statut "pending"
  // En vrai, tu enverrais ça à une API externe
  const paymentUrl = `http://localhost:3000/payment/callback?status=pending&txn_id=${transactionId}&user_id=${user._id}&plan=${subscriptionType}`;

  return NextResponse.json({
    success: true,
    transactionId,
    message: 'Paiement initié',
    redirectUrl: paymentUrl,
  });
}