// app/search/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/movies?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setMovies(data.data);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">
        Résultats pour : <span className="text-red-500">"{query}"</span>
      </h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        </div>
      ) : movies.length === 0 ? (
        <p className="text-gray-400">Aucun film trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}