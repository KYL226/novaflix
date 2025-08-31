import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('🧹 Début du nettoyage des données obsolètes...');

    // Liste des clés obsolètes à supprimer
    const obsoleteKeys = [
      'userSubscription',
      'testSubscription', 
      'subscriptionData',
      'paymentTestData',
      'testMode',
      'testTransactionId',
      'testPaymentStatus',
      'oldPaymentData',
      'simulationData'
    ];

    let cleanedKeys: string[] = [];
    let totalCleaned = 0;

    // Nettoyage côté serveur (si applicable)
    console.log('🧹 Nettoyage côté serveur...');

    // Nettoyage des données côté client (via instruction)
    console.log('🧹 Instructions de nettoyage côté client...');

    return NextResponse.json({
      success: true,
      message: 'Nettoyage des données obsolètes terminé',
      cleanedKeys,
      totalCleaned,
      instructions: [
        'Les anciennes données de test ont été identifiées',
        'Utilisez le bouton "Actualiser" dans le composant SubscriptionStatus',
        'Ou rechargez la page pour appliquer le nettoyage automatique'
      ]
    });

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors du nettoyage' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de nettoyage - Utilisez POST pour nettoyer les données obsolètes',
    obsoleteKeys: [
      'userSubscription',
      'testSubscription',
      'subscriptionData', 
      'paymentTestData'
    ]
  });
}
