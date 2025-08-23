// components/MovieRow.tsx
'use client';

import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '@/types';
import NetworkError from './NetworkError';

interface MovieRowProps {
  title: string;
  genre?: string;
  type?: 'film' | 'serie' | 'documentaire';
  limit?: number;
}

export default function MovieRow({ title, genre, type, limit = 10 }: MovieRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let url = `/api/movies?limit=${limit}`;
        if (genre) url += `&genre=${genre}`;
        if (type) url += `&type=${type}`;

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success && data.data) {
          setMovies(data.data);
          setError(null);
        } else {
          setError(data.error || 'Erreur lors du chargement des films');
        }
      } catch (err) {
        setError('Erreur de connexion réseau');
        console.error('Erreur chargement films:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre, type, limit]);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h2>
        <div className="flex space-x-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-40 h-60 bg-gray-800 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h2>
        <NetworkError 
          error={error} 
          onRetry={() => {
            setError(null);
            setLoading(true);
            // Re-déclencher le useEffect
            const fetchMovies = async () => {
              try {
                let url = `/api/movies?limit=${limit}`;
                if (genre) url += `&genre=${genre}`;
                if (type) url += `&type=${type}`;

                const res = await fetch(url);
                const data = await res.json();
                
                if (data.success && data.data) {
                  setMovies(data.data);
                  setError(null);
                } else {
                  setError(data.error || 'Erreur lors du chargement des films');
                }
              } catch (err) {
                setError('Erreur de connexion réseau');
                console.error('Erreur chargement films:', err);
              } finally {
                setLoading(false);
              }
            };
            fetchMovies();
          }}
        />
      </section>
    );
  }

  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
        {movies.map((movie) => (
          <div key={movie._id} className="flex-shrink-0 w-40">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}