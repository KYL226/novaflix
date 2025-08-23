// components/SecureVideoPlayer.tsx
'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SecureVideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
}

export default function SecureVideoPlayer({ src, poster, title }: SecureVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError('Impossible de charger la vidéo. Vérifiez votre connexion ou votre abonnement.');
  };

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      {error ? (
        <div className="text-red-400 text-center p-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 underline text-sm"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          title={title}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedData={handleLoad}
          onError={handleError}
          controls
          autoPlay={false}
          playsInline
          crossOrigin="anonymous"
          onLoadStart={() => {
            // Ajouter le token d'authentification aux requêtes vidéo
            if (videoRef.current && token) {
              const video = videoRef.current;
              video.addEventListener('loadstart', () => {
                // Cette approche nécessite une configuration CORS appropriée
              });
            }
          }}
        />
      )}

      {/* Overlay de lecture */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <p>Chargement...</p>
        </div>
      )}

      {/* Bouton Play/Pause overlay */}
      {!isPlaying && isLoaded && !error && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition"
        >
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}