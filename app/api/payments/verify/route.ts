// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cinetPayService } from '@/lib/cinetpay-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const txn_id = searchParams.get('txn_id');
    const user_id = searchParams.get('user_id');
    const plan = searchParams.get('plan');

    console.log('🔍 Vérification GET du paiement:', { txn_id, user_id, plan });

    if (!txn_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID de transaction requis' 
      }, { status: 400 });
    }

    // Vérification via CinetPay
    try {
      const cinetPayResponse = await cinetPayService.verifyPayment(txn_id);
      
      console.log('📡 Réponse CinetPay:', cinetPayResponse);

      if (cinetPayService.isTransactionSuccess(cinetPayResponse)) {
        // Paiement réussi
        console.log('✅ Paiement CinetPay confirmé');
        
        return NextResponse.json({
          success: true,
          status: 'success',
          transaction_id: txn_id,
          plan: plan || 'unknown',
          amount: cinetPayResponse.data?.amount,
          currency: cinetPayResponse.data?.currency,
          payment_method: cinetPayResponse.data?.payment_method,
          payment_date: cinetPayResponse.data?.payment_date,
          message: 'Paiement confirmé avec succès via CinetPay'
        });
      } else if (cinetPayService.isTransactionPending(cinetPayResponse)) {
        // Paiement en attente
        console.log('⏳ Paiement CinetPay en attente');
        
        return NextResponse.json({
          success: false,
          status: 'pending',
          transaction_id: txn_id,
          message: 'Paiement en attente de confirmation'
        });
      } else {
        // Paiement échoué
        console.log('❌ Paiement CinetPay échoué');
        
        return NextResponse.json({
          success: false,
          status: 'failed',
          transaction_id: txn_id,
          reason: cinetPayResponse.message,
          message: 'Le paiement n\'a pas pu être confirmé'
        });
      }

    } catch (cinetPayError) {
      console.error('❌ Erreur CinetPay:', cinetPayError);
      
      // En cas d'erreur CinetPay, on peut retourner une erreur ou essayer une vérification locale
      return NextResponse.json({ 
        success: false, 
        error: 'Erreur lors de la vérification du paiement',
        details: cinetPayError instanceof Error ? cinetPayError.message : 'Erreur inconnue'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification du paiement:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur lors de la vérification' 
    }, { status: 500 });
  }
}

// Endpoint POST pour la simulation de paiement (mode test uniquement)
export async function POST(req: NextRequest) {
  try {
    const { txn_id, user_id, plan, testMode = true } = await req.json();

    console.log('🔍 Vérification POST du paiement:', { txn_id, user_id, plan, testMode });

    if (!testMode) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mode test requis pour cette opération' 
      }, { status: 400 });
    }

    if (!txn_id || !user_id || !plan) {
      return NextResponse.json({ 
        success: false, 
        error: 'Données manquantes' 
      }, { status: 400 });
    }

    // En mode test, on force le succès
    const isPaid = true;

    if (isPaid) {
      // En mode test, on simule la création de l'abonnement
      const startDate = new Date();
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      const subscriptionData = {
        userId: user_id,
        type: plan as 'basic' | 'premium',
        startDate,
        endDate,
        status: 'active' as const,
        paymentMethod: 'mobile_money' as const,
        transactionId: txn_id,
        testMode: true,
        createdAt: new Date()
      };

      console.log(`🧪 Mode test - Abonnement forcé créé:`, subscriptionData);

      return NextResponse.json({ 
        success: true, 
        status: 'success', 
        plan,
        subscription: {
          id: 'test_subscription_id',
          type: plan,
          startDate,
          endDate,
          status: 'active'
        },
        message: 'Simulation de paiement réussie - Abonnement activé'
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors de la simulation de paiement:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur serveur lors de la simulation' 
    }, { status: 500 });
  }
}