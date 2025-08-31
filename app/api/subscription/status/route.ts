// app/api/subscription/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
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

    console.log('🔍 Vérification du statut d\'abonnement pour:', decoded.email);

    // Vérifier d'abord s'il y a un abonnement test en localStorage côté client
    // En production, ceci serait vérifié en base de données
    
    // Pour l'instant, on retourne le statut depuis le token décodé
    const subscriptionStatus = {
      id: `user_${decoded.id}`,
      userId: decoded.id,
      type: decoded.subscription || 'free',
      status: decoded.subscription && decoded.subscription !== 'free' ? 'active' : 'inactive',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      daysRemaining: 30,
      progress: 100,
      testMode: decoded.subscription === 'premium' || decoded.subscription === 'basic',
      transactionId: `test_${Date.now()}`
    };

    console.log('✅ Statut d\'abonnement récupéré:', subscriptionStatus);

    return NextResponse.json({
      success: true,
      subscription: subscriptionStatus,
      message: 'Statut d\'abonnement récupéré avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération du statut d\'abonnement:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
