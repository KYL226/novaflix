'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types';

interface UseMoviesOptions {
  type?: 'film' | 'serie' | 'documentaire';
  genre?: string;
  limit?: number;
  featured?: boolean;
}

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  fetchMovies: (type?: string) => Promise<Movie[]>;
}

export function useMovies(options: UseMoviesOptions = {}): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (type?: string): Promise<Movie[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (options.genre) params.append('genre', options.genre);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.featured) params.append('featured', 'true');

      const response = await fetch(`/api/movies?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des films');
      }
      
      const data = await response.json();
      // Support both { data: Movie[] } and { movies: Movie[] }
      const list: Movie[] = data?.data ?? data?.movies ?? [];
      const movies = Array.isArray(list) ? list : [];
      setMovies(movies);
      return movies;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  }, [options.genre, options.limit, options.featured]);

  useEffect(() => {
    fetchMovies();
  }, [options.type, options.genre, options.limit, options.featured]);

  const refetch = () => {
    fetchMovies();
  };

  return { movies, loading, error, refetch, fetchMovies };
}
