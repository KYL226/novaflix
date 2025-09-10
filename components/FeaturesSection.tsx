// components/FeaturesSection.tsx
'use client';

import { Smartphone, Monitor, Tv, Wifi, Shield, Download } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Monitor className="w-12 h-12" />,
      title: "Streaming HD/4K",
      description: "Profitez de vos contenus préférés en haute définition sur tous vos appareils"
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Multi-appareils",
      description: "Regardez sur votre téléphone, tablette, ordinateur ou TV connectée"
    },
    {
      icon: <Download className="w-12 h-12" />,
      title: "Téléchargement",
      description: "Téléchargez vos films et séries pour les regarder hors ligne"
    },
    {
      icon: <Wifi className="w-12 h-12" />,
      title: "Sans publicité",
      description: "Profitez d'une expérience de visionnage sans interruption publicitaire"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Sécurisé",
      description: "Vos données et votre vie privée sont protégées avec nos standards de sécurité"
    },
    {
      icon: <Tv className="w-12 h-12" />,
      title: "Contenu exclusif",
      description: "Accédez à des films et séries exclusifs que vous ne trouverez nulle part ailleurs"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pourquoi choisir <span className="text-red-600">Novaflix</span> ?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez une expérience de streaming exceptionnelle avec nos fonctionnalités premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              <div className="text-red-500 mb-6 group-hover:text-red-400 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
