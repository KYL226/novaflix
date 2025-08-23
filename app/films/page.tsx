'use client';

import { useMovies } from '@/hooks/useMovies';
import MovieGrid from '@/components/MovieGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import NetworkError from '@/components/NetworkError';

export default function FilmsPage() {
  const { movies: films, loading, error } = useMovies({ type: 'film' });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NetworkError error={error || 'Une erreur est survenue'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Films
        </h1>
        
        {films.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">
              Aucun film disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <MovieGrid 
              title="Films Récents" 
              movies={films.filter(movie => movie.releaseYear >= new Date().getFullYear() - 1)}
            />
            <MovieGrid 
              title="Films par Genre" 
              movies={films.slice(0, 10)}
            />
            <MovieGrid 
              title="Tous les Films" 
              movies={films}
            />
          </div>
        )}
      </div>
    </div>
  );
}
