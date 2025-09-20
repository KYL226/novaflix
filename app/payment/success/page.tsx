'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Home, Download, Crown, Star } from 'lucide-react';

type SubscriptionType = 'basic' | 'premium' | 'free';

interface PaymentSuccessData {
  transaction_id: string;
  plan: SubscriptionType;
  amount?: number;
  currency?: string;
  payment_method?: string;
  payment_date?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const txn_id = searchParams.get('txn_id');
    const plan = searchParams.get('plan');

    if (!txn_id || !plan) {
      setError('Données de paiement manquantes');
      setIsLoading(false);
      return;
    }

    // Vérifier le statut du paiement
    verifyPaymentStatus(txn_id, plan);
  }, [searchParams]);

  const verifyPaymentStatus = async (txn_id: string, plan: string) => {
    try {
      console.log('🔍 Vérification du statut du paiement:', txn_id);

      // Valider que le plan est un type d'abonnement valide
      const validPlans: SubscriptionType[] = ['basic', 'premium', 'free'];
      if (!validPlans.includes(plan as SubscriptionType)) {
        setError('Type d\'abonnement invalide');
        setIsLoading(false);
        return;
      }

      const subscriptionType = plan as SubscriptionType;

      const response = await fetch(`/api/payments/verify?txn_id=${txn_id}&plan=${plan}`);
      const data = await response.json();

      if (data.success && data.status === 'success') {
        console.log('✅ Paiement confirmé:', data);
        
        // Mettre à jour l'utilisateur dans le contexte d'authentification
        if (user && updateUser) {
          updateUser({ subscription: subscriptionType });
          console.log('✅ Utilisateur mis à jour dans le contexte:', { subscription: subscriptionType });
        }
        
        // Mettre à jour le localStorage
        localStorage.setItem('userSubscription', plan);
        
        setPaymentData({
          transaction_id: txn_id,
          plan: subscriptionType,
          amount: data.amount,
          currency: data.currency,
          payment_method: data.payment_method,
          payment_date: data.payment_date
        });
      } else {
        console.error('❌ Paiement non confirmé:', data);
        setError('Le paiement n\'a pas pu être confirmé. Veuillez contacter le support.');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      setError('Erreur lors de la vérification du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (plan: SubscriptionType) => {
    switch (plan) {
      case 'premium':
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 'basic':
        return <Star className="w-8 h-8 text-blue-500" />;
      case 'free':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      default:
        return <CheckCircle className="w-8 h-8 text-green-500" />;
    }
  };

  const getPlanName = (plan: SubscriptionType) => {
    switch (plan) {
      case 'premium':
        return 'Premium';
      case 'basic':
        return 'Basic';
      case 'free':
        return 'Gratuit';
      default:
        return 'Inconnu';
    }
  };

  const getPlanFeatures = (plan: SubscriptionType) => {
    switch (plan) {
      case 'premium':
        return [
          'Tous les films et séries',
          'Qualité 4K Ultra HD',
          'Téléchargement hors ligne',
          'Contenu exclusif',
          'Sans publicité',
          'Support prioritaire'
        ];
      case 'basic':
        return [
          'Films populaires',
          'Qualité HD',
          'Sans publicité',
          'Support standard'
        ];
      case 'free':
        return [
          'Contenu limité',
          'Qualité standard',
          'Avec publicité'
        ];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-red-600">Erreur de Paiement</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'Accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-600">Données manquantes</CardTitle>
            <CardDescription>Aucune donnée de paiement trouvée</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'Accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* En-tête de succès */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement Réussi !
            </h1>
            <p className="text-gray-600">
              Votre abonnement a été activé avec succès
            </p>
          </div>

          {/* Détails du paiement */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getPlanIcon(paymentData.plan)}
                <span>Abonnement {getPlanName(paymentData.plan)}</span>
                <Badge variant="secondary" className="ml-auto">
                  {paymentData.plan.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Transaction ID:</span>
                  <p className="text-gray-900 font-mono">{paymentData.transaction_id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Plan:</span>
                  <p className="text-gray-900">{getPlanName(paymentData.plan)}</p>
                </div>
                {paymentData.amount && (
                  <div>
                    <span className="font-medium text-gray-600">Montant:</span>
                    <p className="text-gray-900">
                      {paymentData.amount.toLocaleString()} {paymentData.currency}
                    </p>
                  </div>
                )}
                {paymentData.payment_method && (
                  <div>
                    <span className="font-medium text-gray-600">Méthode:</span>
                    <p className="text-gray-900">{paymentData.payment_method}</p>
                  </div>
                )}
                {paymentData.payment_date && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-600">Date de paiement:</span>
                    <p className="text-gray-900">
                      {new Date(paymentData.payment_date).toLocaleString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités du plan */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fonctionnalités Incluses</CardTitle>
              <CardDescription>
                Votre abonnement vous donne accès à :
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getPlanFeatures(paymentData.plan).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={() => router.push('/')} 
              className="flex-1"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'Accueil
            </Button>
            
            <Button 
              onClick={() => router.push('/subscription')} 
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Voir Mon Abonnement
            </Button>
          </div>

          {/* Message de confirmation */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Un email de confirmation vous a été envoyé avec tous les détails.
              <br />
              Votre abonnement est maintenant actif et vous pouvez profiter de tous les contenus !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

