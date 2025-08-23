'use client';

import { useMovies } from '@/hooks/useMovies';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DocumentairesPage() {
  const { movies: documentaires, loading, error } = useMovies({ 
    type: 'documentaire', 
    limit: 50 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Documentaires
          </h1>
          <p className="text-gray-300 text-lg">
            Découvrez notre collection de documentaires captivants
          </p>
        </div>

        {documentaires.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-400 mb-4">
              Aucun documentaire disponible pour le moment
            </h3>
            <p className="text-gray-500">
              Revenez plus tard pour découvrir de nouveaux documentaires
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {documentaires.map((documentaire) => (
              <MovieCard
                key={documentaire._id}
                movie={documentaire}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
