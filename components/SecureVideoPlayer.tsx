// components/SecureVideoPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [videoUrl, setVideoUrl] = useState<string>('');
  const { token, user, updateUser } = useAuth();

  useEffect(() => {
    console.log('🔍 SecureVideoPlayer - État de l\'authentification:', {
      hasToken: !!token,
      hasUser: !!user,
      userSubscription: user?.subscription,
      src: src
    });

    // Vérifier si src est valide
    if (!src || src.trim() === '') {
      console.error('❌ URL vidéo vide ou invalide:', src);
      setError('URL vidéo manquante ou invalide');
      setVideoUrl('');
      return;
    }

    if (token && user) {
      // Construire l'URL avec le token d'autorisation
      // Vérifier si src est déjà une URL complète ou un chemin relatif
      let baseUrl: string;
      if (src.startsWith('http')) {
        baseUrl = src;
      } else if (src.startsWith('/')) {
        baseUrl = `${window.location.origin}${src}`;
      } else {
        baseUrl = `${window.location.origin}/${src}`;
      }
      
      try {
        const url = new URL(baseUrl);
        url.searchParams.set('token', token);
        const finalUrl = url.toString();
        setVideoUrl(finalUrl);
        
        console.log('🔗 URL vidéo construite:', finalUrl);
        console.log('🔑 Token utilisé:', token.substring(0, 20) + '...');
        console.log('🔍 Token complet:', token);
        console.log('🔍 URL de base:', baseUrl);
      } catch (error) {
        console.error('❌ Erreur lors de la construction de l\'URL:', error);
        setError('URL vidéo invalide');
        setVideoUrl('');
      }
    } else {
      setVideoUrl(src);
      console.log('⚠️ Pas de token ou utilisateur, URL originale utilisée');
    }
  }, [src, token, user]);

  // Vérifier et mettre à jour l'abonnement si nécessaire
  useEffect(() => {
    const checkAndUpdateSubscription = async () => {
      if (token && user && (!user.subscription || user.subscription === 'free')) {
        try {
          console.log('🔍 Vérification du statut d\'abonnement...');
          const res = await fetch('/api/subscription/status', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.subscription && data.subscription.status === 'active') {
              console.log('✅ Abonnement actif détecté, mise à jour de l\'utilisateur');
              updateUser({ subscription: data.subscription.type });
            }
          }
        } catch (error) {
          console.error('❌ Erreur lors de la vérification de l\'abonnement:', error);
        }
      }
    };

    checkAndUpdateSubscription();
  }, [token, user, updateUser]);

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
    setError(null);
  };

  const handleError = (e: any) => {
    console.error('Erreur vidéo:', e);
    console.error('🔍 Détails de l\'erreur:', {
      videoUrl,
      hasToken: !!token,
      userSubscription: user?.subscription,
      errorEvent: e
    });
    
    // Vérifier le type d'erreur
    if (e.target && e.target.error) {
      const videoError = e.target.error;
      console.error('📹 Code d\'erreur vidéo:', videoError.code);
      console.error('📹 Message d\'erreur vidéo:', videoError.message);
      
      if (videoError.code === 4) {
        setError('Erreur 401: Problème d\'authentification. Vérifiez votre token et votre abonnement.');
      } else {
        setError(`Erreur vidéo (${videoError.code}): ${videoError.message}`);
      }
    } else {
      setError('Impossible de charger la vidéo. Vérifiez votre connexion ou votre abonnement.');
    }
  };

  const retryLoad = () => {
    setError(null);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  // Vérifier si l'utilisateur a un abonnement valide
  const hasValidSubscription = user && user.subscription && user.subscription !== 'free';

  // Vérifier que le token est présent et valide
  const hasValidToken = token && token.length > 0;

  if (!hasValidSubscription) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-red-400 text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Contenu Premium Requis
          </h3>
          <p className="text-gray-400 mb-4">
            Cette vidéo nécessite un abonnement premium.
          </p>
          <button
            onClick={() => window.location.href = '/payment'}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Souscrire un Abonnement
          </button>
        </div>
      </div>
    );
  }

  if (!hasValidToken) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="text-center p-4">
          <div className="text-yellow-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Token d'Authentification Manquant
          </h3>
          <p className="text-gray-400 mb-4">
            Votre session a expiré. Veuillez vous reconnecter.
          </p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
          >
            Se Reconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black flex items-center justify-center">
      {error ? (
        <div className="text-red-400 text-center p-4">
          <p>{error}</p>
          <button
            onClick={retryLoad}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      ) : !videoUrl || videoUrl.trim() === '' ? (
        <div className="text-yellow-400 text-center p-4">
          <p>URL vidéo manquante</p>
          <button
            onClick={retryLoad}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
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
        />
      )}

      {/* Overlay de lecture */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
            <p className="text-white">Chargement de la vidéo...</p>
          </div>
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