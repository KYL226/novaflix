'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play,
  Bug,
  Info
} from 'lucide-react';

export default function PaymentDebug() {
  const [currentStep, setCurrentStep] = useState<'init' | 'verify' | 'complete'>('init');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);

  const testPaymentInitiation = async () => {
    setIsLoading(true);
    setErrors([]);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrors(['Aucun token trouvé dans localStorage']);
        return;
      }

      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subscriptionType: 'basic',
          testMode: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults((prev: any) => ({ ...prev, initiation: data }));
        setCurrentStep('verify');
      } else {
        const errorData = await response.json();
        setErrors((prev: any) => [...prev, `Initiation échouée: ${errorData.error}`]);
      }
    } catch (error) {
      setErrors((prev: any) => [...prev, `Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const testPaymentVerification = async () => {
    if (!results.initiation?.transactionId) {
      setErrors((prev: any) => [...prev, 'Transaction ID manquant pour la vérification']);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txn_id: results.initiation.transactionId,
          user_id: 'test_user_id',
          plan: 'basic',
          testMode: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults((prev: any) => ({ ...prev, verification: data }));
        setCurrentStep('complete');
        
        // Mettre à jour le localStorage
        localStorage.setItem('userSubscription', 'basic');
      } else {
        const errorData = await response.json();
        setErrors((prev: any) => [...prev, `Vérification échouée: ${errorData.error}`]);
      }
    } catch (error) {
      setErrors((prev: any) => [...prev, `Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTest = () => {
    setCurrentStep('init');
    setResults({});
    setErrors([]);
  };

  const getStepStatus = (step: string) => {
    if (step === 'init') return currentStep === 'init' ? 'current' : 'pending';
    if (step === 'verify') return currentStep === 'verify' ? 'current' : currentStep === 'complete' ? 'completed' : 'pending';
    if (step === 'complete') return currentStep === 'complete' ? 'completed' : 'pending';
    return 'pending';
  };

  const getStepIcon = (step: string) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'current':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepColor = (step: string) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'current':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Debug du Système de Paiement
          </CardTitle>
          <CardDescription>
            Testez chaque étape du processus de paiement pour identifier les problèmes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Étapes du processus */}
          <div className="space-y-4">
            <h3 className="font-semibold">Étapes du Processus</h3>
            
            {/* Étape 1: Initiation */}
            <div className={`p-4 border rounded-lg ${getStepColor('init')}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStepIcon('init')}
                  <div>
                    <div className="font-medium">1. Initiation du Paiement</div>
                    <div className="text-sm opacity-75">
                      Appel de /api/payments/initiate
                    </div>
                  </div>
                </div>
                
                {currentStep === 'init' && (
                  <Button
                    onClick={testPaymentInitiation}
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Tester
                  </Button>
                )}
              </div>
              
              {results.initiation && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <div><strong>Transaction ID:</strong> {results.initiation.transactionId}</div>
                  <div><strong>Plan:</strong> {results.initiation.plan.type}</div>
                  <div><strong>Prix:</strong> {results.initiation.plan.price} {results.initiation.plan.currency}</div>
                </div>
              )}
            </div>

            {/* Étape 2: Vérification */}
            <div className={`p-4 border rounded-lg ${getStepColor('verify')}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStepIcon('verify')}
                  <div>
                    <div className="font-medium">2. Vérification du Paiement</div>
                    <div className="text-sm opacity-75">
                      Appel de /api/payments/verify
                    </div>
                  </div>
                </div>
                
                {currentStep === 'verify' && (
                  <Button
                    onClick={testPaymentVerification}
                    disabled={isLoading || !results.initiation}
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Tester
                  </Button>
                )}
              </div>
              
              {results.verification && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <div><strong>Statut:</strong> {results.verification.status}</div>
                  <div><strong>Message:</strong> {results.verification.message}</div>
                  <div><strong>Plan:</strong> {results.verification.plan}</div>
                </div>
              )}
            </div>

            {/* Étape 3: Finalisation */}
            <div className={`p-4 border rounded-lg ${getStepColor('complete')}`}>
              <div className="flex items-center gap-3">
                {getStepIcon('complete')}
                <div>
                  <div className="font-medium">3. Finalisation</div>
                  <div className="text-sm opacity-75">
                    Mise à jour du localStorage et activation de l'abonnement
                  </div>
                </div>
              </div>
              
              {currentStep === 'complete' && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm">
                  <div><strong>Abonnement:</strong> {localStorage.getItem('userSubscription')}</div>
                  <div><strong>Statut:</strong> Actif</div>
                  <div className="text-green-600">✅ Processus terminé avec succès !</div>
                </div>
              )}
            </div>
          </div>

          {/* Erreurs */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <XCircle className="w-4 h-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Erreurs détectées :</div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={resetTest}
              variant="outline"
              disabled={isLoading}
            >
              Réinitialiser le Test
            </Button>
            
            {currentStep === 'init' && (
              <Button
                onClick={testPaymentInitiation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Commencer le Test
              </Button>
            )}
          </div>

          {/* Informations de debug */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-700">Informations de Debug</span>
            </div>
            <div className="text-sm text-blue-600 space-y-1">
              <div>• Vérifiez la console pour les logs détaillés</div>
              <div>• Chaque étape est testée individuellement</div>
              <div>• Les erreurs sont affichées avec des détails</div>
              <div>• L'abonnement est automatiquement activé en mode test</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
