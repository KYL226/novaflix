// app/api/subscription/activate-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { DecodedToken } from '@/types';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { transactionId, planType } = await req.json();

    // Vérifier l'authentification
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token d\'authentification requis' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token invalide' 
      }, { status: 401 });
    }

    // Validation des données
    if (!transactionId || !planType || !['basic', 'premium'].includes(planType)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Données de transaction invalides' 
      }, { status: 400 });
    }

    console.log('🧪 Activation de l\'abonnement test:', {
      userId: decoded.id,
      transactionId,
      planType
    });

    // Simuler l'activation de l'abonnement
    const subscriptionData = {
      id: `test_${transactionId}`,
      userId: decoded.id,
      type: planType,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      daysRemaining: 30,
      progress: 100,
      testMode: true,
      transactionId: transactionId
    };

    // Stocker dans le localStorage côté client (simulation)
    // En production, ceci serait stocké en base de données
    console.log('✅ Abonnement test activé:', subscriptionData);

    return NextResponse.json({
      success: true,
      subscription: subscriptionData,
      message: 'Abonnement test activé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'activation de l\'abonnement test:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
