'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { Movie } from '@/types';

interface FavoritesManagerProps {
  movie: Movie;
  className?: string;
}

export default function FavoritesManager({ movie, className = '' }: FavoritesManagerProps) {
  const { user, token } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && movie._id) {
      checkFavoriteStatus();
    }
  }, [user, movie._id]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/users/favorites/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: movie._id })
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: movie._id })
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`${className} hover:bg-red-500/20 hover:text-red-500 transition-colors`}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isFavorite ? (
        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
      ) : (
        <Heart className="w-4 h-4" />
      )}
    </Button>
  );
}
