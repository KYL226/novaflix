// app/admin/movies/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AddMoviePage() {
  const { user, isLoading } = useProtectedRoute(true); // true = requireAdmin
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>(['']);
  const [published, setPublished] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    releaseYear: '',
    type: '',
    videoUrl: '',
    posterUrl: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation des données
    if (!formData.title.trim() || !formData.description.trim() || !formData.duration || !formData.releaseYear || !formData.type || !formData.videoUrl.trim() || !formData.posterUrl.trim()) {
      setError('Tous les champs sont obligatoires');
      setLoading(false);
      return;
    }

    if (genres.filter(g => g.trim() !== '').length === 0) {
      setError('Au moins un genre doit être spécifié');
      setLoading(false);
      return;
    }

    // Préparer les données à envoyer
    const movieData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      genre: genres.filter(g => g.trim() !== ''),
      duration: parseInt(formData.duration),
      releaseYear: parseInt(formData.releaseYear),
      type: formData.type as 'film' | 'serie' | 'documentaire',
      videoUrl: formData.videoUrl.trim(),
      posterUrl: formData.posterUrl.trim(),
      published: published,
    };

    console.log('Données à envoyer:', movieData); // Debug

    try {
      const res = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(movieData),
      });

      const data = await res.json();
      console.log('Réponse API:', { status: res.status, data }); // Debug

      if (res.ok) {
        router.push('/admin/movies/manage');
      } else {
        setError(data.error || 'Erreur lors de l\'ajout du film');
      }
    } catch (err: any) {
      console.error('Erreur réseau:', err); // Debug
      setError('Erreur réseau lors de l\'ajout du film');
    } finally {
      setLoading(false);
    }
  };

  const addGenre = () => setGenres([...genres, '']);
  const updateGenre = (index: number, value: string) => {
    const newGenres = [...genres];
    newGenres[index] = value;
    setGenres(newGenres);
  };
  const removeGenre = (index: number) => {
    if (genres.length > 1) {
      setGenres(genres.filter((_, i) => i !== index));
    }
  };

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un Nouveau Film</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Inception"
                  required 
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée du film..."
                  rows={4}
                  required 
                />
              </div>

              <div>
                <Label>Genres</Label>
                {genres.map((genre, index) => (
                  <div key={index} className="flex items-center gap-2 mt-1">
                    <Input
                      value={genre}
                      onChange={(e) => updateGenre(index, e.target.value)}
                      placeholder="ex: action"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeGenre(index)}
                      disabled={genres.length === 1}
                      className="px-3"
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={addGenre} 
                  className="mt-2"
                >
                  + Ajouter un genre
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    min="1"
                    placeholder="120"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="releaseYear">Année de sortie</Label>
                  <Input 
                    id="releaseYear" 
                    type="number" 
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2024"
                    value={formData.releaseYear}
                    onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  options={[
                    { value: "film", label: "Film" },
                    { value: "serie", label: "Série" },
                    { value: "documentaire", label: "Documentaire" }
                  ]}
                  placeholder="Sélectionner un type"
                  required
                />
              </div>

              <div>
                <Label htmlFor="videoUrl">Chemin du fichier vidéo</Label>
                <Input 
                  id="videoUrl" 
                  placeholder="ex: films/inception.mp4" 
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  required 
                />
                <p className="text-sm text-gray-500 mt-1">
                  Chemin relatif dans le dossier secure-media/videos/
                </p>
              </div>

              <div>
                <Label htmlFor="posterUrl">Chemin de l'image poster</Label>
                <Input 
                  id="posterUrl" 
                  placeholder="ex: posters/inception.jpg" 
                  value={formData.posterUrl}
                  onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                  required 
                />
                <p className="text-sm text-gray-500 mt-1">
                  Chemin relatif dans le dossier secure-media/images/
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label>Publier immédiatement</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/movies/manage')}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer le Film'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}