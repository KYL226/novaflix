// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/models';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txn_id = searchParams.get('txn_id');
  const user_id = searchParams.get('user_id');

  if (!txn_id || !user_id) {
    return NextResponse.json({ success: false, error: 'Données manquantes' }, { status: 400 });
  }

  // En vrai : appel à l'API Mobile Money pour vérifier le statut
  // Ici : on simule un paiement réussi après 30 secondes
  const isPaid = Math.random() > 0.3; // 70% de chance de succès (simulation)

  if (isPaid) {
    const subscriptions = await db.getSubscriptions();
    const users = await db.getUsers();

    const plan = searchParams.get('plan') || 'basic';

    await subscriptions.insertOne({
      userId: user_id,
      type: plan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      status: 'active',
      paymentMethod: 'mobile_money',
    });

    await users.updateOne(
      { _id: user_id },
      { $set: { subscription: plan } }
    );

    return NextResponse.json({ success: true, status: 'success', plan });
  } else {
    return NextResponse.json({ success: false, status: 'failed' });
  }
}