// components/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/types';

export default function HeroSection() {
  const [movie, setMovie] = useState<Movie | null>(null);

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
      }
    };

    fetchMovie();
  }, []);

  if (!movie) {
    return (
      <div className="relative w-full h-96 md:h-[600px] bg-gradient-to-r from-red-600 to-black animate-pulse"></div>
    );
  }

  return (
    <div
      className="relative w-full h-96 md:h-[600px] bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.2)), url(${movie.posterUrl}?w=1200&h=600&fit=crop)`,
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-center pl-6 md:pl-12 text-white">
        <h1 className="text-3xl md:text-6xl font-bold max-w-lg mb-4 drop-shadow-lg">
          {movie.title}
        </h1>
        <p className="text-sm md:text-lg max-w-xl mb-6 line-clamp-3 drop-shadow">
          {movie.description}
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Regarder
          </button>
          <button className="bg-gray-600 bg-opacity-70 px-6 py-3 rounded-md font-semibold hover:bg-opacity-90 transition">
            Plus d'infos
          </button>
        </div>
      </div>
    </div>
  );
}