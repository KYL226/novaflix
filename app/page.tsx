'use client';

import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/HeroSection';
import AuthenticatedHeroSection from '@/components/AuthenticatedHeroSection';
import MovieRow from '@/components/MovieRow';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import FaqSection from '@/components/FaqSection';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  // ✅ Utilisateur connecté — contenu complet
  if (user && !isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthenticatedHeroSection />

        <main className="mt-4 px-4 pb-12 space-y-10">
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

  // 🚫 Utilisateur non connecté — landing page façon Netflix
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero avec grand visuel, texte et CTA */}
      <HeroSection />

      {/* Aperçu de films */}
      <main className="bg-black mt-4 px-4 pb-16">
        <MovieRow
          title="Tendances actuelles"
          type="film"
          limit={10}
          variant="poster"
          showRanking
        />
      </main>

      {/* Sections à la Netflix */}
      <section className="bg-black border-t border-gray-800">
        <FeaturesSection />
        <PricingSection />
        <FaqSection />
        <CTASection />
      </section>

      {/* Footer simple */}
      <Footer />
    </div>
  );
}
