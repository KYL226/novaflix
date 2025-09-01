import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Token requis' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const { userId, planId, paymentMethod } = await req.json();

    if (!userId || !planId || !paymentMethod) {
      return NextResponse.json({
        error: 'Tous les champs sont requis'
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('novaflix');
    
    // Vérifier que l'utilisateur existe
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return NextResponse.json({
        error: 'Utilisateur non trouvé'
      }, { status: 404 });
    }

    // Créer l'abonnement
    const subscription = {
      userId: new ObjectId(userId),
      type: planId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      status: 'active',
      paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('subscriptions').insertOne(subscription);

    // Mettre à jour l'utilisateur avec le type d'abonnement
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          subscription: planId,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: result.insertedId,
        message: 'Abonnement créé avec succès'
      }
    });

  } catch (error) {
    console.error('Erreur création abonnement:', error);
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la création de l\'abonnement'
    }, { status: 500 });
  }
}
