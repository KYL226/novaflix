// app/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/HeroSection';
import AuthenticatedHeroSection from '@/components/AuthenticatedHeroSection';
import MovieRow from '@/components/MovieRow';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  // Si l'utilisateur est connecté, afficher seulement le contenu des films/séries
  if (user && !isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Bannière principale pour utilisateurs connectés */}
        <AuthenticatedHeroSection />

        {/* Rangées de films - vue complète pour utilisateurs connectés */}
        <main className="mt-2 px-4 pb-8">
          <MovieRow title="Films à la Une" type="film" limit={10} />
          <MovieRow title="Séries Populaires" type="serie" limit={8} />
          <MovieRow title="Documentaires" type="documentaire" limit={6} />
          <MovieRow title="Action" genre="action" limit={8} />
          <MovieRow title="Drame" genre="drame" limit={8} />
          <MovieRow title="Comédie" genre="comédie" limit={8} />
          <MovieRow title="Nouveautés" type="film" limit={8} />
          <MovieRow title="Tendances" type="serie" limit={8} />
        </main>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, afficher la landing page complète
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Bannière principale */}
      <HeroSection />

      {/* Rangées de films - aperçu pour non-connectés */}
      <main className="mt-2 px-4">
        <MovieRow title="Films à la Une" type="film" limit={6} />
        <MovieRow title="Séries Populaires" type="serie" limit={6} />
        <MovieRow title="Documentaires" type="documentaire" limit={4} />
      </main>

      {/* Sections de la landing page - uniquement pour non-connectés */}
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}