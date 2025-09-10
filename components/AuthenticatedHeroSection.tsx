// components/AuthenticatedHeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import Link from 'next/link';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';

export default function AuthenticatedHeroSection() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch('/api/movies?limit=1&featured=true');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setMovie(data.data[0]);
        }
      } catch (err) {
        console.error('Erreur chargement film héroïque:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, []);

  if (isLoading) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-16 text-white">
          <div className="h-12 bg-gray-700 rounded w-80 mb-4 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-700 rounded w-56 mb-6 animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-10 bg-gray-700 rounded w-28 animate-pulse"></div>
            <div className="h-10 bg-gray-700 rounded w-28 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-gradient-to-br from-red-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-16 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Bienvenue sur <span className="text-red-600">Novaflix</span>
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-xl">
            Découvrez votre prochain film ou série préféré
          </p>
          <Link 
            href="/films" 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-fit"
          >
            <Play className="w-5 h-5" />
            Explorer le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-[50vh] md:h-[60vh] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${movie.posterUrl}?w=1920&h=1080&fit=crop)`,
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-16 text-white">
        <div className="max-w-2xl">
          {/* Movie title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl leading-tight">
            {movie.title}
          </h1>
          
          {/* Movie info */}
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm md:text-base">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold">4.5</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.releaseYear || '2024'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>2h 30min</span>
            </div>
            <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
              {movie.genre || 'Action'}
            </span>
          </div>
          
          {/* Description */}
          <p className="text-sm md:text-base mb-6 line-clamp-2 drop-shadow-lg max-w-xl">
            {movie.description}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href={`/watch/${movie._id}`}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Regarder maintenant
            </Link>
            <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 border border-white/30">
              <Info className="w-5 h-5" />
              Plus d'infos
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
}
