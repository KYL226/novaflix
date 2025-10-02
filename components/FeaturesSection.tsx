// components/FeaturesSection.tsx
'use client';

import { Smartphone, Monitor, Tv, Wifi, Shield, Download } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Monitor className="w-12 h-12" />,
      title: "Regardez sur votre TV",
      description: "Smart TV, Playstation, Xbox, Chromecast, Apple TV, lecteurs Blu‑ray et plus."
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Regardez partout",
      description: "Sur téléphone, tablette, ordinateur et TV. Où que vous soyez."
    },
    {
      icon: <Download className="w-12 h-12" />,
      title: "Téléchargez pour regarder hors ligne",
      description: "Enregistrez vos favoris et regardez-les sans connexion."
    },
    {
      icon: <Wifi className="w-12 h-12" />,
      title: "Sans engagement",
      description: "Annulez en ligne en deux clics. Aucun frais d'annulation."
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Sécurisé",
      description: "Vos données sont protégées selon des standards élevés."
    },
    {
      icon: <Tv className="w-12 h-12" />,
      title: "Profils pour les enfants",
      description: "Créez des profils dédiés avec contrôle parental. Inclus avec votre abonnement."
    }
  ];

  return (
    <section className="py-16 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3">Plus de raisons de nous rejoindre</h2>
          <p className="text-lg md:text-xl text-gray-300">Tout ce que vous aimez, au même endroit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#111] rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="text-red-500 mb-4">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
