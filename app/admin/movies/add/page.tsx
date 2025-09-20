'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import FileUpload from '@/components/FileUpload';
import { ArrowLeft } from 'lucide-react';

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVideoUpload = (fileUrl: string, fileName: string) => {
    setFormData(prev => ({ ...prev, videoUrl: fileUrl }));
    setUploadError(null);
  };

  const handleImageUpload = (fileUrl: string, fileName: string) => {
    setFormData(prev => ({ ...prev, posterUrl: fileUrl }));
    setUploadError(null);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation des données
    if (!formData.title.trim() || !formData.description.trim() || !formData.duration || !formData.releaseYear || !formData.type) {
      setError('Tous les champs obligatoires doivent être remplis');
      setLoading(false);
      return;
    }

    if (!formData.videoUrl.trim()) {
      setError('Veuillez uploader un fichier vidéo');
      setLoading(false);
      return;
    }

    if (!formData.posterUrl.trim()) {
      setError('Veuillez uploader une image poster');
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

      if (res.ok) {
        router.push('/admin/movies/manage');
      } else {
        setError(data.error || 'Erreur lors de l\'ajout du film');
      }
    } catch (err: any) {
      console.error('Erreur réseau:', err);
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
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/movies/manage')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Ajouter un Nouveau Film</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Inception"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
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
                <Label htmlFor="type">Type *</Label>
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

              <div className="flex items-center space-x-2">
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label>Publier immédiatement</Label>
              </div>
            </CardContent>
          </Card>

          {/* Upload des fichiers */}
          <Card>
            <CardHeader>
              <CardTitle>Fichiers média</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Fichier vidéo *</Label>
                <FileUpload
                  type="video"
                  onUploadSuccess={handleVideoUpload}
                  onUploadError={handleUploadError}
                  currentFile={formData.videoUrl}
                />
              </div>

              <div>
                <Label>Image poster *</Label>
                <FileUpload
                  type="image"
                  onUploadSuccess={handleImageUpload}
                  onUploadError={handleUploadError}
                  currentFile={formData.posterUrl}
                />
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/movies/manage')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le Film'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
