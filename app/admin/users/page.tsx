// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, User as UserType } from '@/types';

export default function ManageUsersPage() {
  const { user, isLoading } = useProtectedRoute(true); // true = requireAdmin
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    role: '',
    subscription: '',
    search: '',
  });

  useEffect(() => {
    if (isLoading || !user) return;

    const fetchUsers = async () => {
      try {
        let url = `/api/admin/users?`;
        if (filters.role) url += `&role=${filters.role}`;
        if (filters.subscription) url += `&subscription=${filters.subscription}`;
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.data || []);
        } else {
          setError(data.error || 'Erreur lors du chargement des utilisateurs');
        }
      } catch (err) {
        setError('Erreur de chargement des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, isLoading, filters]);

  const handleUpdate = async (id: string, field: string, value: any) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ id, [field]: value }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Échec de la mise à jour');
      }

      // Mettre à jour l'état local
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === id ? { ...u, [field]: value } : u
        )
      );
    } catch (err: any) {
      alert(`Erreur : ${err.message}`);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    u.email.toLowerCase().includes(filters.search.toLowerCase())
  );

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Gérer les Utilisateurs</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Rôle</Label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Tous</option>
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <Label>Abonnement</Label>
            <select
              value={filters.subscription}
              onChange={(e) => setFilters({ ...filters, subscription: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Tous</option>
              <option value="free">Free</option>
              <option value="basic">Basique</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Label>Rechercher</Label>
            <Input
              placeholder="Nom ou email"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des utilisateurs...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Nom</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Rôle</th>
                  <th className="text-left p-3">Abonnement</th>
                  <th className="text-left p-3">Inscrit depuis</th>
                  <th className="text-left p-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3 text-sm text-gray-600">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdate(u._id!, 'role', e.target.value)}
                          className="p-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            u.subscription === 'premium'
                              ? 'default'
                              : u.subscription === 'basic'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {u.subscription || 'free'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3">
                        <Switch
                          checked={!u.banned}
                          onCheckedChange={(checked) =>
                            handleUpdate(u._id!, 'banned', !checked)
                          }
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {u.banned ? 'Banni' : 'Actif'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}