// components/CTASection.tsx
'use client';

import { Play, ArrowRight, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Prêt à commencer votre aventure ?
          </h2>
          <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
            Rejoignez des millions d'utilisateurs qui font confiance à Novaflix pour leur divertissement quotidien
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-red-100">Utilisateurs actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-red-100">Films et séries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.8</div>
              <div className="text-red-100 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                Note moyenne
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/auth"
              className="bg-white text-red-600 px-10 py-5 rounded-lg font-bold text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3 group"
            >
              <Play className="w-6 h-6" />
              Commencer maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/films"
              className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-lg font-bold text-xl hover:bg-white hover:text-red-600 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
            >
              <Users className="w-6 h-6" />
              Découvrir le catalogue
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-red-400/30">
            <p className="text-red-100 mb-4">Rejoignez-nous aujourd'hui et profitez de :</p>
            <div className="flex flex-wrap justify-center gap-6 text-red-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Essai gratuit 7 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Annulation à tout moment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
