// components/MovieCard.tsx
'use client';

import { Movie } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FavoritesManager from './FavoritesManager';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
        <Image
          src={movie.posterUrl.startsWith('http') ? movie.posterUrl : `/api/secure-media/images/${movie.posterUrl}`}
          alt={movie.title}
          width={300}
          height={450}
          className="object-cover w-full h-full"
          unoptimized
        />
        
        {/* Overlay au survol */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
            <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
            <div className="flex space-x-2">
              <Button
                asChild
                size="sm"
                className="bg-white text-black hover:bg-gray-200 flex-1"
              >
                <Link href={`/watch/${movie._id}`}>
                  <Play className="w-4 h-4 mr-1" />
                  Regarder
                </Link>
              </Button>
              <FavoritesManager movie={movie} className="flex-1" />
            </div>
          </div>
        )}
      </div>

      {/* Titre en dessous (quand pas survolé) */}
      {!isHovered && (
        <h3 className="mt-2 text-sm text-center line-clamp-1">
          {movie.title}
        </h3>
      )}
    </div>
  );
}