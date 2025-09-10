// components/PricingSection.tsx
'use client';

import { Check, Crown, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PricingSection() {
  const plans = [
    {
      name: "Basique",
      price: "9.99",
      period: "mois",
      description: "Parfait pour commencer",
      features: [
        "Accès à tous les films",
        "Qualité HD",
        "2 appareils simultanés",
        "Téléchargement limité",
        "Support client"
      ],
      popular: false,
      color: "gray"
    },
    {
      name: "Premium",
      price: "14.99",
      period: "mois",
      description: "Le plus populaire",
      features: [
        "Accès à tous les contenus",
        "Qualité 4K Ultra HD",
        "4 appareils simultanés",
        "Téléchargement illimité",
        "Contenu exclusif",
        "Support prioritaire"
      ],
      popular: true,
      color: "red"
    },
    {
      name: "Famille",
      price: "19.99",
      period: "mois",
      description: "Pour toute la famille",
      features: [
        "Accès à tous les contenus",
        "Qualité 4K Ultra HD",
        "6 appareils simultanés",
        "Téléchargement illimité",
        "Contenu exclusif",
        "Profils enfants",
        "Support prioritaire 24/7"
      ],
      popular: false,
      color: "purple"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choisissez votre <span className="text-red-600">abonnement</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Commencez votre essai gratuit de 7 jours. Annulez à tout moment.
          </p>
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Essai gratuit de 7 jours</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular 
                  ? 'border-red-500 shadow-2xl shadow-red-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  {plan.color === 'red' && <Crown className="w-8 h-8 text-red-500 mr-2" />}
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">€{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href="/subscription"
                className={`w-full block text-center py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-red-600 hover:bg-red-700 text-white transform hover:scale-105'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                Commencer l'essai gratuit
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Tous les plans incluent l'essai gratuit de 7 jours
          </p>
          <p className="text-sm text-gray-500">
            Annulez à tout moment. Pas de frais cachés.
          </p>
        </div>
      </div>
    </section>
  );
}
