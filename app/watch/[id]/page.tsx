// app/watch/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Lock } from 'lucide-react';
import SecureVideoPlayer from '@/components/SecureVideoPlayer';

export default function WatchPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movies/${params.id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError('Film introuvable');
        } else {
          setMovie(data.data);
        }
      } catch (err) {
        setError('Erreur de chargement du film');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  // Vérification d'accès
  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!user.subscription || user.subscription === 'free') {
      setError('Abonnement requis pour regarder ce contenu.');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Chargement du film...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertDescription className="flex items-center gap-3 text-red-200">
            <Lock className="w-5 h-5" />
            {error}
          </AlertDescription>
        </Alert>

        <div className="text-center mt-8">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600"
          >
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <SecureVideoPlayer
          src={`/api/secure-media/videos/${movie.videoUrl}`}
          poster={movie.posterUrl}
          title={movie.title}
        />
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        <p className="text-gray-400 mb-4">{movie.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {movie.genre.map((g: string) => (
            <span
              key={g}
              className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
            >
              {g}
            </span>
          ))}
        </div>

        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold">
          <Play className="w-4 h-4 mr-2" />
          Rejouer
        </Button>
      </div>
    </div>
  );
}