// components/SearchResults.tsx
'use client';

import { useEffect, useState } from 'react';
import { Movie } from '@/types';
import Link from 'next/link';
import { Search, Film as FilmIcon, Tv, BookOpen } from 'lucide-react';

export default function SearchResults({ query, onSelect }: { query: string; onSelect: () => void }) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/movies?search=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        console.error('Erreur recherche:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      fetchResults();
    }, 300); // Délai pour éviter les appels trop fréquents

    return () => clearTimeout(timeout);
  }, [query]);

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-400">
        Recherche...
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="p-4 text-center text-gray-400">
        Aucun résultat pour "{query}"
      </div>
    );
  }

  return (
    <div className="p-2">
      {results.map((movie) => (
        <Link
          key={movie._id}
          href={`/watch/${movie._id}`}
          onClick={onSelect}
          className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded transition"
        >
          <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-medium text-white">{movie.title}</h3>
            <p className="text-sm text-gray-400">{movie.type} • {movie.releaseYear}</p>
          </div>
        </Link>
      ))}

      <Link
        href={`/search?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="block p-3 text-center text-red-500 hover:bg-gray-800 rounded mt-2 font-medium"
      >
        Voir tous les résultats
      </Link>
    </div>
  );
}