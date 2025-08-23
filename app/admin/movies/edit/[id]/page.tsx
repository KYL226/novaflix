// app/admin/movies/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trash2 } from 'lucide-react';

export default function EditMoviePage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/admin/movies/${params.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMovie(data.data);
          setGenres(data.data.genre || []);
        } else {
          setError(data.error || 'Film non trouvé');
        }
      } catch (err) {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const updatedMovie = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      duration: formData.get('duration') as string,
      releaseYear: formData.get('releaseYear') as string,
      type: formData.get('type') as 'film' | 'serie' | 'documentaire',
      videoUrl: formData.get('videoUrl') as string,
      posterUrl: formData.get('posterUrl') as string,
      genre: genres.filter(g => g.trim() !== ''),
      published: formData.get('published') ? true : false,
    };

    try {
      const res = await fetch(`/api/admin/movies/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedMovie),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/movies/manage');
      } else {
        setError(data.error || 'Échec de la mise à jour');
      }
    } catch (err: any) {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Voulez-vous vraiment supprimer "${movie?.title}" ? Cette action est irréversible.`)) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/movies/${params.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.ok) {
        router.push('/admin/movies/manage');
      } else {
        const data = await res.json();
        alert(data.error || 'Impossible de supprimer le film.');
      }
    } catch (err: any) {
      alert('Erreur réseau');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Chargement du film...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Erreur : Film introuvable.</p>
        <Button onClick={() => router.push('/admin/movies/manage')} className="mt-4">
          Retour à la gestion
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier le Film : {movie.title}</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" defaultValue={movie.title} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={movie.description} required />
          </div>

          <div>
            <Label>Genres</Label>
            {genres.map((genre, index) => (
              <div key={index} className="flex items-center gap-2 mt-1">
                <Input
                  value={genre}
                  onChange={(e) => {
                    const newGenres = [...genres];
                    newGenres[index] = e.target.value;
                    setGenres(newGenres);
                  }}
                  placeholder="ex: action"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGenres(genres.filter((_, i) => i !== index))}
                  disabled={genres.length === 1}
                >
                  -
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setGenres([...genres, ''])}
              className="mt-2"
            >
              + Ajouter un genre
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Durée (min)</Label>
              <Input id="duration" name="duration" type="number" defaultValue={movie.duration} required />
            </div>
            <div>
              <Label htmlFor="releaseYear">Année</Label>
              <Input id="releaseYear" name="releaseYear" type="number" defaultValue={movie.releaseYear} required />
            </div>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              name="type"
              defaultValue={movie.type}
              className="w-full p-2 border border-gray-300 rounded bg-white"
              required
            >
              <option value="film">Film</option>
              <option value="serie">Série</option>
              <option value="documentaire">Documentaire</option>
            </select>
          </div>

          <div>
            <Label htmlFor="videoUrl">Chemin vidéo</Label>
            <Input id="videoUrl" name="videoUrl" defaultValue={movie.videoUrl} placeholder="dans secure-media/videos/" required />
          </div>

          <div>
            <Label htmlFor="posterUrl">Chemin poster</Label>
            <Input id="posterUrl" name="posterUrl" defaultValue={movie.posterUrl} placeholder="dans secure-media/images/" required />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="published" name="published" defaultChecked={movie.published} />
            <Label htmlFor="published">Publié</Label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 flex-1"
              disabled={saving}
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enregistrement...</> : 'Enregistrer les modifications'}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Supprimer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}