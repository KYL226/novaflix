'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, CreditCard, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  popular?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basique',
    price: 9.99,
    currency: '€',
    period: 'mois',
    features: [
      'Accès aux films et séries populaires',
      'Qualité HD',
      'Sans publicités',
      'Support client'
    ],
    icon: CreditCard
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    currency: '€',
    period: 'mois',
    features: [
      'Tout le contenu Basique',
      'Accès illimité à tout le catalogue',
      'Qualité 4K Ultra HD',
      'Téléchargements hors ligne',
      'Profils multiples',
      'Support prioritaire'
    ],
    popular: true,
    icon: Crown
  }
];

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Ici, vous intégreriez votre système de paiement
      // Pour l'instant, on simule une souscription
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          planId,
          paymentMethod: 'credit_card'
        })
      });

      if (response.ok) {
        // Rediriger vers la page de paiement ou afficher un message de succès
        console.log('Abonnement créé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlan = user?.subscription;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-400">
          Commencez à regarder des milliers de films et séries dès aujourd'hui
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const IconComponent = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          const isPopular = plan.popular;

          return (
            <Card 
              key={plan.id} 
              className={`relative border-2 transition-all duration-300 hover:scale-105 ${
                isCurrentPlan 
                  ? 'border-green-500 bg-green-500/10' 
                  : isPopular 
                    ? 'border-red-500 bg-red-500/10' 
                    : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">
                  Le plus populaire
                </Badge>
              )}
              
              {isCurrentPlan && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                  Plan actuel
                </Badge>
              )}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <IconComponent className={`w-12 h-12 ${
                    isCurrentPlan ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400"> {plan.currency}/{plan.period}</span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <Button 
                    disabled 
                    className="w-full bg-green-600 text-white"
                  >
                    Plan actuel
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isLoading}
                    className={`w-full ${
                      isPopular 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Chargement...' : `S'abonner à ${plan.name}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-8 text-gray-400">
        <p className="text-sm">
          * Tous les plans incluent un essai gratuit de 7 jours
        </p>
        <p className="text-sm mt-2">
          Annulez à tout moment. Pas de frais cachés.
        </p>
      </div>
    </div>
  );
}
