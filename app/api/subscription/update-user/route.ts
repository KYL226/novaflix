// app/api/subscription/update-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { planType } = await req.json();

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
    if (!planType || !['basic', 'premium'].includes(planType)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type de plan invalide' 
      }, { status: 400 });
    }

    console.log('🔄 Mise à jour du statut d\'abonnement:', {
      userId: decoded.id,
      email: decoded.email,
      planType
    });

    try {
      // Mettre à jour l'utilisateur en base de données
      const client = await clientPromise;
      const db = client.db('novaflix');
      const users = db.collection('users');
      
      const result = await users.updateOne(
        { email: decoded.email },
        { 
          $set: { 
            subscription: planType,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        console.log('⚠️ Utilisateur non trouvé pour la mise à jour');
        return NextResponse.json({
          success: false,
          error: 'Utilisateur non trouvé'
        }, { status: 404 });
      }

      console.log('✅ Statut d\'abonnement mis à jour en base de données');

      // Retourner le nouveau statut
      const updatedUser = await users.findOne(
        { email: decoded.email },
        { projection: { password: 0 } }
      );

      return NextResponse.json({
        success: true,
        user: updatedUser,
        message: `Abonnement ${planType} activé avec succès`
      });

    } catch (dbError) {
      console.error('❌ Erreur base de données:', dbError);
      
      // En cas d'erreur DB, on peut quand même retourner un succès
      // car l'abonnement test est stocké côté client
      return NextResponse.json({
        success: true,
        message: `Abonnement ${planType} activé en mode test (base de données non accessible)`,
        testMode: true
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut d\'abonnement:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
