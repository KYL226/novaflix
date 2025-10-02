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
  variant?: 'landscape' | 'poster';
}

export default function MovieCard({ movie, variant = 'landscape' }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-[1.04]">
        <Image
          src={movie.posterUrl.startsWith('http') ? movie.posterUrl : `/api/secure-media/images/${movie.posterUrl}`}
          alt={movie.title}
          width={variant === 'poster' ? 260 : 320}
          height={variant === 'poster' ? 390 : 180}
          className={variant === 'poster' ? 'object-cover w-full h-[340px] md:h-[360px]' : 'object-cover w-full h-[170px] md:h-[180px]'}
          unoptimized
          onError={(e) => {
            // Fallback vers une image par défaut si l'image n'existe pas
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.svg';
          }}
        />
        
        {/* Overlay au survol */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3">
            <h3 className={variant === 'poster' ? 'text-base font-semibold mb-2 line-clamp-1' : 'text-sm md:text-base font-semibold mb-2 line-clamp-1'}>{movie.title}</h3>
            <div className="flex gap-2">
              <Button
                asChild
                size="sm"
                className="bg-white text-black hover:bg-gray-200 px-3 py-2"
              >
                <Link href={`/watch/${movie._id}`}>
                  <Play className="w-4 h-4 mr-1" />
                  Regarder
                </Link>
              </Button>
              <FavoritesManager movie={movie} className="" />
            </div>
          </div>
        )}
      </div>

      {/* Titre en dessous (quand pas survolé) */}
      {!isHovered && (
        <h3 className={variant === 'poster' ? 'mt-2 text-sm text-gray-300 line-clamp-1' : 'mt-2 text-xs text-gray-300 line-clamp-1'}>{movie.title}</h3>
      )}
    </div>
  );
}