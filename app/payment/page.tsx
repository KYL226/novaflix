'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Crown, Star, CreditCard, Globe, Smartphone, Mail, User, MapPin, Building, Flag } from 'lucide-react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useProtectedRoute();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [testMode, setTestMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'BF',
    state: '',
    zipCode: ''
  });

  // Afficher un loader pendant la vérification de l'authentification
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

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 5000,
      currency: 'XOF',
      icon: Star,
      color: 'bg-blue-500',
      features: [
        'Films populaires',
        'Qualité HD',
        'Sans publicité',
        'Support standard'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 12000,
      currency: 'XOF',
      icon: Crown,
      color: 'bg-yellow-500',
      features: [
        'Tous les films et séries',
        'Qualité 4K Ultra HD',
        'Téléchargement hors ligne',
        'Contenu exclusif',
        'Sans publicité',
        'Support prioritaire'
      ]
    }
  ];

  const handlePlanSelect = (planId: 'basic' | 'premium') => {
    setSelectedPlan(planId);
    setError(null);
  };

  const handleCustomerInfoChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError('Veuillez sélectionner un plan');
      return;
    }

    // Validation des informations client en mode production
    if (!testMode) {
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Initiation du paiement:', {
        plan: selectedPlan,
        testMode,
        customerInfo: testMode ? undefined : customerInfo
      });

      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType: selectedPlan,
          testMode,
          customerInfo: testMode ? undefined : customerInfo
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Paiement initié:', data);
        
        if (testMode) {
          // Mode test - redirection vers la simulation
          router.push(data.redirectUrl);
        } else {
          // Mode production - redirection vers CinetPay
          if (data.cinetPayData?.paymentUrl) {
            window.location.href = data.cinetPayData.paymentUrl;
          } else {
            throw new Error('URL de paiement CinetPay manquante');
          }
        }
      } else {
        console.error('❌ Erreur lors de l\'initiation:', data);
        setError(data.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;
    
    const IconComponent = plan.icon;
    return <IconComponent className={`w-6 h-6 ${plan.color.replace('bg-', 'text-')}`} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez Votre Plan
            </h1>
            <p className="text-gray-600">
              Sélectionnez le plan qui correspond le mieux à vos besoins
            </p>
          </div>

          {/* Toggle Mode Test/Production */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setTestMode(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  testMode
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🧪 Mode Test
              </button>
              <button
                onClick={() => setTestMode(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !testMode
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌐 Mode Production
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePlanSelect(plan.id as 'basic' | 'premium')}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 ${plan.color} rounded-full flex items-center justify-center`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">
                    {plan.price.toLocaleString()} {plan.currency}
                  </div>
                  <CardDescription>par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Informations client (mode production uniquement) */}
          {!testMode && selectedPlan && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Client
                </CardTitle>
                <CardDescription>
                  Remplissez vos informations pour finaliser le paiement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      placeholder="+225 01234567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={customerInfo.country}
                      onChange={(e) => handleCustomerInfoChange('country', e.target.value)}
                      placeholder="BF"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                      placeholder="Ouagadougou"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                      placeholder="123 Rue de la Paix"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de paiement */}
          {selectedPlan && (
            <div className="text-center">
              <Button
                onClick={handlePayment}
                disabled={isLoading}
                size="lg"
                className="px-8 py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Traitement...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {testMode ? 'Procéder au Paiement (Test)' : 'Payer avec CinetPay'}
                  </div>
                )}
              </Button>
              
              <p className="text-sm text-gray-500 mt-2">
                {testMode 
                  ? 'Mode test activé - Aucun vrai paiement ne sera effectué'
                  : 'Vous serez redirigé vers CinetPay pour finaliser le paiement'
                }
              </p>
            </div>
          )}

          {/* Erreurs */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informations sur CinetPay */}
          {!testMode && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Paiement Sécurisé via CinetPay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="font-medium">Mobile Money</div>
                    <div className="text-gray-600">Orange, MTN, Moov</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="font-medium">Cartes Bancaires</div>
                    <div className="text-gray-600">Visa, Mastercard</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="font-medium">Virements</div>
                    <div className="text-gray-600">Bancaires</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
