// components/SecureVideoPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play as PlayIcon, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw, ArrowLeft, HelpCircle, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Fonction utilitaire pour les logs sécurisés (désactivés en production)
const secureLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
};

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
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si src est valide
    if (!src || src.trim() === '') {
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
      } catch (error) {
        setError('URL vidéo invalide');
        setVideoUrl('');
      }
    } else {
      setVideoUrl(src);
    }
  }, [src, token, user]);

  // Vérifier et mettre à jour l'abonnement si nécessaire
  useEffect(() => {
    const checkAndUpdateSubscription = async () => {
      if (token && user && (!user.subscription || user.subscription === 'free')) {
        try {
          const res = await fetch('/api/subscription/status', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.subscription && data.subscription.status === 'active') {
              updateUser({ subscription: data.subscription.type });
            }
          }
        } catch (error) {
          // Erreur silencieuse pour éviter l'exposition d'informations
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

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min((videoRef.current.currentTime || 0) + seconds, duration || videoRef.current.duration || 0));
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime || 0);
    setDuration(videoRef.current.duration || duration);
  };

  const handleSeek = (value: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };

  const handleVolume = (val: number) => {
    const v = Math.max(0, Math.min(1, val));
    if (videoRef.current) {
      videoRef.current.volume = v;
      videoRef.current.muted = v === 0;
    }
    setMuted(v === 0);
    setVolume(v);
  };

  const toggleFullscreen = async () => {
    const elem = videoRef.current?.parentElement;
    if (!elem) return;
    try {
      if (!document.fullscreenElement) {
        await elem.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return '00:00';
    const total = Math.floor(sec);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setError(null);
  };

  const handleError = (e: any) => {
    // Vérifier le type d'erreur
    if (e.target && e.target.error) {
      const videoError = e.target.error;
      
      if (videoError.code === 4) {
        setError('Erreur d\'authentification. Vérifiez votre abonnement.');
      } else {
        setError('Erreur lors du chargement de la vidéo.');
      }
    } else {
      setError('Impossible de charger la vidéo. Vérifiez votre connexion.');
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
          onLoadedData={(e) => {
            handleLoad();
            const target = e.target as HTMLVideoElement;
            setDuration(target.duration || 0);
            setCurrentTime(target.currentTime || 0);
            setVolume(target.volume ?? 1);
            setMuted(target.muted ?? false);
          }}
          onError={handleError}
          onTimeUpdate={handleTimeUpdate}
          controls={false}
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

      {/* Bouton Play/Pause overlay */
      }
      {!isPlaying && isLoaded && !error && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition"
        >
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <PlayIcon className="w-10 h-10 ml-1" />
          </div>
        </button>
      )}

      {/* Top back button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-20 text-white/90 hover:text-white"
        aria-label="Retour"
      >
        <ArrowLeft className="w-7 h-7" />
      </button>

      {/* Bottom control bar */}
      {isLoaded && !error && (
        <div className="absolute left-0 right-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3">
          {/* timeline */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-white/80 w-14 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="flex-1 accent-red-600"
            />
            <span className="text-xs text-white/80 w-14">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded">
                {isPlaying ? <Pause className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </button>
              <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded" aria-label="Reculer de 10s">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded" aria-label="Avancer de 10s">
                <RotateCw className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 ml-2">
                <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded">
                  {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => handleVolume(parseFloat(e.target.value))}
                  className="w-24 accent-red-600"
                />
              </div>

              <span className="ml-3 text-sm text-white/90 hidden sm:inline">{title}</span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <button className="p-2 hover:bg-white/10 rounded" aria-label="Aide">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded" aria-label="Paramètres">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded" aria-label="Plein écran">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}