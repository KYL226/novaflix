// app/admin/movies/manage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Home, Plus } from 'lucide-react';
import Image from 'next/image';

export default function ManageMoviesPage() {
  const { user, isLoading } = useProtectedRoute(true); // true = requireAdmin
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (isLoading) return; // Attendre que l'authentification soit vérifiée

    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/admin/movies', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMovies(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Erreur de chargement des films.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isLoading, router]);

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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${title}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/movies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMovies(movies.filter(m => m._id !== id));
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert('Erreur réseau');
    }
  };

  const filteredMovies = movies
    .filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
    .filter(m => !typeFilter || m.type === typeFilter);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gérer les Films</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              onClick={() => router.push('/admin/movies/add')}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un Film</span>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un film..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Tous les types</option>
              <option value="film">Films</option>
              <option value="serie">Séries</option>
              <option value="documentaire">Documentaires</option>
            </select>
          </div>
        </div>

        {/* Liste des films */}
        {loading ? (
          <p>Chargement des films...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">Aucun film trouvé.</p>
            ) : (
              filteredMovies.map((movie) => (
                <div key={movie._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      width={300}
                      height={200}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{movie.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{movie.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {movie.genre.slice(0, 3).map((g: string) => (
                        <Badge key={g} variant="secondary">{g}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {movie.duration} min • {movie.releaseYear}
                    </p>
                    <Badge className="mt-2">{movie.type}</Badge>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/movies/edit/${movie._id}`)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(movie._id, movie.title)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}