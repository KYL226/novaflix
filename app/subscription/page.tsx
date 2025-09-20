'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Crown, CreditCard, Check, Star, Zap, Shield, Users, ArrowLeft, Settings, TestTube, Globe } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  buttonText: string;
  buttonColor: string;
}

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testMode, setTestMode] = useState(true); // Mode test activé par défaut
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  // Plans d'abonnement disponibles
  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'mois',
      description: 'Parfait pour commencer',
      features: [
        'Accès au contenu standard',
        'Qualité HD (1080p)',
        '2 écrans simultanés',
        'Téléchargements limités',
        'Support client standard'
      ],
      icon: CreditCard,
      color: 'border-blue-500',
      buttonText: 'Choisir Basic',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15.99,
      period: 'mois',
      description: 'Le plus populaire',
      features: [
        'Accès illimité à tout le contenu',
        'Qualité 4K Ultra HD',
        '4 écrans simultanés',
        'Téléchargements illimités',
        'Support client prioritaire',
        'Contenu exclusif',
        'Pas de publicités'
      ],
      popular: true,
      icon: Crown,
      color: 'border-yellow-500',
      buttonText: 'Choisir Premium',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async (planId: string) => {
    if (!selectedPlan) {
      setSelectedPlan(planId);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🚀 Initiation du paiement:', {
        plan: planId,
        testMode,
        customerInfo: testMode ? undefined : customerInfo
      });

      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionType: planId,
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
        alert(data.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de l\'initiation du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentPlanInfo = () => {
    if (!user) return null;
    
    switch (user.subscription) {
      case 'premium':
        return {
          name: 'Premium',
          icon: Crown,
          color: 'text-yellow-500',
          description: 'Vous avez déjà l\'abonnement Premium'
        };
      case 'basic':
        return {
          name: 'Basic',
          icon: CreditCard,
          color: 'text-blue-500',
          description: 'Vous avez déjà l\'abonnement Basic'
        };
      default:
        return null;
    }
  };

  const currentPlan = getCurrentPlanInfo();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connexion requise</h2>
          <p className="text-gray-400 mb-6">Veuillez vous connecter pour voir les plans d'abonnement</p>
          <Button onClick={() => router.push('/auth')} className="bg-red-600 hover:bg-red-700">
            Se connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <h1 className="text-4xl font-bold mb-4">Choisissez votre plan</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez tous nos contenus avec un abonnement NovaFlix. Annulez à tout moment.
          </p>
        </div>
        
        {/* Configuration Mode Test/Production */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Settings className="w-5 h-5 mr-2" />
                Configuration de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {testMode ? (
                    <TestTube className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Globe className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <Label className="text-white font-medium">
                      {testMode ? 'Mode Test' : 'Mode Production'}
                    </Label>
                    <p className="text-sm text-gray-400">
                      {testMode 
                        ? 'Simulation de paiement - Aucun vrai paiement' 
                        : 'Paiement réel via CinetPay'
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={testMode}
                  onCheckedChange={setTestMode}
                  className="data-[state=checked]:bg-yellow-600"
                />
              </div>
              
              {testMode && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-200 text-sm">
                    🧪 <strong>Mode Test Activé</strong> - Les paiements sont simulés et aucun argent réel ne sera débité.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Plan actuel */}
        {currentPlan && (
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <currentPlan.icon className={`w-12 h-12 mx-auto mb-4 ${currentPlan.color}`} />
                <h3 className="text-xl font-semibold mb-2">Plan Actuel</h3>
                <p className="text-gray-400 mb-4">{currentPlan.description}</p>
                <Badge className="bg-green-600 hover:bg-green-700">
                  Actif
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Informations client (mode production uniquement) */}
        {!testMode && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Informations de Facturation</CardTitle>
                <p className="text-gray-400 text-sm">Remplissez vos informations pour le paiement</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-200">Nom complet *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-200">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-200">Téléphone *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="+225 07 12 34 56 78"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-gray-200">Ville</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                      className="mt-1 bg-gray-700 border-gray-600 text-white"
                      placeholder="Abidjan"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plans d'abonnement */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isCurrentPlan = user.subscription === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative bg-gray-800 border-2 ${plan.color} ${
                  plan.popular ? 'ring-2 ring-yellow-500' : ''
                } ${isCurrentPlan ? 'opacity-75' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-600 hover:bg-yellow-700">
                      <Star className="w-3 h-3 mr-1" />
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <IconComponent className={`w-12 h-12 mx-auto mb-4 ${
                    plan.id === 'premium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isCurrentPlan ? (
                    <Button 
                      disabled 
                      className="w-full bg-gray-600 cursor-not-allowed"
                    >
                      Plan actuel
                    </Button>
                  ) : selectedPlan === plan.id ? (
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isLoading}
                        className={`w-full ${plan.buttonColor}`}
                      >
                        {isLoading ? 'Chargement...' : `Confirmer ${plan.name}`}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPlan(null)}
                        className="w-full border-gray-600 text-gray-400 hover:bg-gray-700"
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full ${plan.buttonColor}`}
                    >
                      {plan.buttonText}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informations supplémentaires */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Sécurisé</h3>
              <p className="text-gray-400 text-sm">Paiement 100% sécurisé</p>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-semibold mb-2">Instantané</h3>
              <p className="text-gray-400 text-sm">Accès immédiat au contenu</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">Flexible</h3>
              <p className="text-gray-400 text-sm">Annulez à tout moment</p>
            </div>
          </div>
        </div>

        {/* FAQ ou informations */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Tous les plans incluent un essai gratuit de 7 jours. 
            Annulez à tout moment sans frais.
          </p>
        </div>
      </div>
    </div>
  );
}
