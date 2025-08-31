// app/api/payments/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cinetPayService } from '@/lib/cinetpay-service';
import { CinetPayTransaction } from '@/lib/cinetpay-config';

export async function POST(req: NextRequest) {
  try {
    const { subscriptionType, testMode = false, customerInfo } = await req.json();

    console.log('🚀 Initiation du paiement:', { subscriptionType, testMode, customerInfo });

    // Validation du type d'abonnement
    if (!subscriptionType || !['basic', 'premium'].includes(subscriptionType)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type d\'abonnement invalide' 
      }, { status: 400 });
    }

    // Définition des plans
    const plans = {
      basic: { price: 5000, currency: 'XOF', name: 'Basic' },
      premium: { price: 12000, currency: 'XOF', name: 'Premium' }
    };

    const selectedPlan = plans[subscriptionType as keyof typeof plans];

    if (testMode) {
      // Mode test - simulation sans CinetPay
      console.log('🧪 Mode test activé - simulation du paiement');
      
      const mockTransactionId = `TEST_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      return NextResponse.json({
        success: true,
        transactionId: mockTransactionId,
        plan: {
          type: subscriptionType,
          price: selectedPlan.price,
          currency: selectedPlan.currency,
          name: selectedPlan.name
        },
        redirectUrl: `/payment/simulate?plan=${subscriptionType}&txn_id=${mockTransactionId}`,
        testMode: true,
        message: 'Mode test - paiement simulé'
      });
    }

    // Mode production - utilisation de CinetPay
    console.log('🌐 Mode production - utilisation de CinetPay');

    // Validation de la configuration CinetPay
    const configValidation = cinetPayService.validateConfig();
    if (!configValidation.isValid) {
      console.error('❌ Configuration CinetPay invalide:', configValidation.errors);
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration de paiement invalide',
        details: configValidation.errors
      }, { status: 500 });
    }

    // Génération de l'ID de transaction
    const transactionId = cinetPayService.generateTransactionId();

    // Préparation des données de transaction
    const transaction: CinetPayTransaction = {
      transaction_id: transactionId,
      amount: selectedPlan.price,
      currency: selectedPlan.currency,
      description: `Abonnement ${selectedPlan.name} - NovaFlix`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?txn_id=${transactionId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel?txn_id=${transactionId}`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/cinetpay/webhook`,
      customer_name: customerInfo?.name,
      customer_email: customerInfo?.email,
      customer_phone: customerInfo?.phone,
      customer_address: customerInfo?.address,
      customer_city: customerInfo?.city,
      customer_country: customerInfo?.country || 'CI',
      customer_state: customerInfo?.state,
      customer_zip_code: customerInfo?.zipCode,
    };

    console.log('📝 Transaction préparée:', {
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      currency: transaction.currency,
      description: transaction.description
    });

    // Initiation du paiement via CinetPay
    const cinetPayResponse = await cinetPayService.initiatePayment(transaction);

    if (cinetPayResponse.data?.payment_url) {
      console.log('✅ Paiement CinetPay initié avec succès');
      
      return NextResponse.json({
        success: true,
        transactionId: transactionId,
        plan: {
          type: subscriptionType,
          price: selectedPlan.price,
          currency: selectedPlan.currency,
          name: selectedPlan.name
        },
        redirectUrl: cinetPayResponse.data.payment_url,
        cinetPayData: {
          paymentUrl: cinetPayResponse.data.payment_url,
          status: cinetPayResponse.data.status,
          message: cinetPayResponse.message
        },
        testMode: false,
        message: 'Paiement initié avec succès via CinetPay'
      });
    } else {
      console.error('❌ Échec de l\'initiation CinetPay:', cinetPayResponse);
      throw new Error(`Échec de l'initiation: ${cinetPayResponse.message}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initiation du paiement:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}