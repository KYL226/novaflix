// app/page.tsx
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Bannière principale */}
      <HeroSection />

      {/* Rangées de films */}
      <main className="mt-2 px-4">
        <MovieRow title="Films à la Une" type="film" limit={10} />
        <MovieRow title="Séries Populaires" type="serie" limit={8} />
        <MovieRow title="Documentaires" type="documentaire" limit={6} />
        <MovieRow title="Action" genre="action" limit={8} />
        <MovieRow title="Drame" genre="drame" limit={8} />
        <MovieRow title="Comédie" genre="comédie" limit={8} />
      </main>
    </div>
  );
}