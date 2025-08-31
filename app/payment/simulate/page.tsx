'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, CheckCircle, Clock, CreditCard, Home } from 'lucide-react';

interface SimulatedTransaction {
  transactionId: string;
  plan: {
    type: 'basic' | 'premium';
    price: number;
    currency: string;
    name: string;
  };
  status: 'pending' | 'processing' | 'success' | 'failed';
  startTime: Date;
  estimatedDuration: number; // en secondes
}

export default function PaymentSimulatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { isLoading: authLoading } = useProtectedRoute();
  
  const [transaction, setTransaction] = useState<SimulatedTransaction | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  const plan = searchParams.get('plan');
  const txnId = searchParams.get('txn_id');

  useEffect(() => {
    if (plan && txnId) {
      const planData = {
        basic: { price: 5000, currency: 'XOF', name: 'Basic' },
        premium: { price: 12000, currency: 'XOF', name: 'Premium' }
      };

      setTransaction({
        transactionId: txnId,
        plan: {
          type: plan as 'basic' | 'premium',
          price: planData[plan as keyof typeof planData]?.price || 0,
          currency: planData[plan as keyof typeof planData]?.currency || 'XOF',
          name: planData[plan as keyof typeof planData]?.name || 'Unknown'
        },
        status: 'pending',
        startTime: new Date(),
        estimatedDuration: 15 // 15 secondes pour la simulation
      });
    }
  }, [plan, txnId]);

  const activateTestSubscription = async () => {
    if (!transaction || !token) return;

    try {
      // 1. Activer l'abonnement test
      const response = await fetch('/api/subscription/activate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transactionId: transaction.transactionId,
          planType: transaction.plan.type
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Abonnement test activé:', data.subscription);
        
        // 2. Mettre à jour le statut de l'utilisateur
        const updateResponse = await fetch('/api/subscription/update-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            planType: transaction.plan.type
          })
        });

        const updateData = await updateResponse.json();

        if (updateData.success) {
          console.log('✅ Statut utilisateur mis à jour:', updateData);
          
          // 3. Stocker l'abonnement dans le localStorage pour la simulation
          localStorage.setItem('cinetPaySubscription', JSON.stringify({
            ...data.subscription,
            status: 'success',
            type: transaction.plan.type
          }));

          // 4. Rafraîchir le contexte d'authentification pour refléter le nouveau statut
          window.location.reload();

          setActivationError(null);
        } else {
          console.error('❌ Erreur lors de la mise à jour du statut utilisateur:', updateData.error);
          setActivationError(updateData.error || 'Erreur lors de la mise à jour du statut utilisateur');
        }
      } else {
        console.error('❌ Erreur lors de l\'activation:', data.error);
        setActivationError(data.error || 'Erreur lors de l\'activation de l\'abonnement');
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'activation:', error);
      setActivationError('Erreur de connexion lors de l\'activation');
    }
  };

  const startSimulation = () => {
    if (!transaction) return;
    
    setIsSimulating(true);
    setCurrentStep(1);
    setActivationError(null);

    // Simulation des étapes de paiement
    const steps = [
      { name: 'Validation du plan', duration: 2000 },
      { name: 'Vérification du solde', duration: 2000 },
      { name: 'Traitement du paiement', duration: 3000 },
      { name: 'Confirmation de la transaction', duration: 2000 },
      { name: 'Activation de l\'abonnement', duration: 3000 },
      { name: 'Finalisation', duration: 3000 }
    ];

    let currentStepIndex = 0;
    const totalSteps = steps.length;

    const processStep = () => {
      if (currentStepIndex < totalSteps) {
        setCurrentStep(currentStepIndex + 1);
        
        setTimeout(() => {
          currentStepIndex++;
          processStep();
        }, steps[currentStepIndex]?.duration || 1000);
      } else {
        // Simulation terminée - activer l'abonnement test
        setTransaction(prev => prev ? { ...prev, status: 'success' } : null);
        setSimulationComplete(true);
        setIsSimulating(false);
        
        // Activer l'abonnement test
        activateTestSubscription();
      }
    };

    processStep();
  };

  const getPlanIcon = (type: string) => {
    return type === 'premium' ? (
      <Crown className="w-8 h-8 text-yellow-500" />
    ) : (
      <Star className="w-8 h-8 text-blue-500" />
    );
  };

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
    } else {
      return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // useProtectedRoute gère la redirection
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-4">Transaction Invalide</h1>
          <p className="text-gray-400 mb-6">Impossible de récupérer les informations de la transaction</p>
          <Button onClick={() => router.push('/payment')} className="bg-red-600 hover:bg-red-700">
            <Home className="w-4 h-4 mr-2" />
            Retour au Paiement
          </Button>
        </div>
      </div>
    );
  }

  const steps = [
    'Validation du plan',
    'Vérification du solde',
    'Traitement du paiement',
    'Confirmation de la transaction',
    'Activation de l\'abonnement',
    'Finalisation'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🧪 Simulation de Paiement</h1>
          <p className="text-gray-400">Mode test - Aucun vrai paiement ne sera effectué</p>
        </div>

        {/* Informations de la transaction */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-3">
              {getPlanIcon(transaction.plan.type)}
              <span>Plan {transaction.plan.name}</span>
              <Badge variant="secondary" className="bg-blue-600">
                Mode Test
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {transaction.plan.price.toLocaleString()} {transaction.plan.currency}
                </div>
                <div className="text-sm text-gray-400">Montant</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {transaction.transactionId}
                </div>
                <div className="text-sm text-gray-400">ID Transaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {transaction.startTime.toLocaleTimeString()}
                </div>
                <div className="text-sm text-gray-400">Heure de début</div>
              </div>
            </div>

            {!isSimulating && !simulationComplete && (
              <Button 
                onClick={startSimulation}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Démarrer la Simulation
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Étapes de simulation */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Progression de la Simulation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    getStepStatus(index) === 'completed' ? 'bg-green-900/30' :
                    getStepStatus(index) === 'active' ? 'bg-blue-900/30' :
                    'bg-gray-700/30'
                  }`}
                >
                  {getStepIcon(index)}
                  <span className={`flex-1 ${
                    getStepStatus(index) === 'completed' ? 'text-green-400' :
                    getStepStatus(index) === 'active' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>
                    {step}
                  </span>
                  {getStepStatus(index) === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Erreur d'activation */}
        {activationError && (
          <Card className="bg-red-900/30 border-red-700 mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-400 mb-2">
                  Erreur lors de l'Activation
                </h3>
                <p className="text-red-300 mb-4">{activationError}</p>
                <Button 
                  onClick={activateTestSubscription}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Réessayer l'Activation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultat de la simulation */}
        {simulationComplete && !activationError && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="w-6 h-6" />
                <span>Simulation Terminée avec Succès !</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-6">
                Votre abonnement {transaction.plan.name} a été activé avec succès en mode test.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/profile')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Voir Mon Profil
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'Accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {!simulationComplete && (
          <div className="text-center">
            <Button 
              onClick={() => router.push('/payment')}
              variant="outline"
              className="mr-4"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Nouveau Paiement
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'Accueil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
