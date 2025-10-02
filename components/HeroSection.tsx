// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types';
import Link from 'next/link';
import { Play, Info, Star, Calendar, Clock } from 'lucide-react';
import SecureBackgroundImage from '@/components/SecureBackgroundImage';

export default function HeroSection() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

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
      <div className="relative w-full h-[70vh] md:h-[80vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-16 text-white">
          <div className="h-16 bg-gray-700 rounded w-96 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-80 mb-2 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-72 mb-6 animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-12 bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="relative w-full h/[80vh] md:h-[90vh] bg-[url('/inception.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Films, séries et plus en illimité</h1>
          <p className="text-xl md:text-2xl mb-2">Commence à partir de 7,99$. Annule à tout moment.</p>
          <p className="text-base md:text-lg mb-6">Prêt à regarder ? Saisis ton email pour créer ou réactiver ton abonnement.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/auth?email=${encodeURIComponent(email)}`;
            }}
            className="w-full max-w-3xl flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e‑mail"
              className="flex-1 px-4 py-4 rounded md:rounded-l md:rounded-r-none bg-white text-black placeholder-gray-600"
            />
            <button
              type="submit"
              className="px-6 py-4 bg-red-600 hover:bg-red-700 rounded md:rounded-r md:rounded-l-none font-bold text-lg whitespace-nowrap"
            >
              Commencer
            </button>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
      </div>
    );
  }

  return (
    <SecureBackgroundImage
      src={movie.posterUrl}
      className="relative w-full h-[70vh] md:h-[80vh]"
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-16 text-white">
        <div className="max-w-2xl">
          {/* Movie title */}
          <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-2xl leading-tight">
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
          <p className="text-base md:text-lg mb-8 line-clamp-3 drop-shadow-lg max-w-xl">
            {movie.description}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={`/watch/${movie._id}`}
              className="bg-white text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="w-6 h-6" />
              Regarder maintenant
            </Link>
            <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 border border-white/30">
              <Info className="w-6 h-6" />
              Plus d'infos
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </SecureBackgroundImage>
  );
}