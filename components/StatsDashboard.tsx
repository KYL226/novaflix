'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Film, 
  Tv, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star,
  Eye,
  Heart
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalMovies: number;
  totalSeries: number;
  totalDocumentaries: number;
  activeSubscriptions: number;
  totalViews: number;
  totalFavorites: number;
  averageRating: number;
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || 'Erreur lors du chargement des statistiques');
        }
      } else {
        setError('Erreur lors du chargement des statistiques');
      }
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers.toLocaleString(),
      description: 'Total des comptes',
      icon: Users,
      color: 'bg-blue-600',
      trend: '+12% ce mois'
    },
    {
      title: 'Films',
      value: stats.totalMovies.toLocaleString(),
      description: 'Dans la bibliothèque',
      icon: Film,
      color: 'bg-green-600',
      trend: '+5% ce mois'
    },
    {
      title: 'Séries',
      value: stats.totalSeries.toLocaleString(),
      description: 'Disponibles',
      icon: Tv,
      color: 'bg-purple-600',
      trend: '+8% ce mois'
    },
    {
      title: 'Documentaires',
      value: stats.totalDocumentaries.toLocaleString(),
      description: 'Au catalogue',
      icon: BookOpen,
      color: 'bg-orange-600',
      trend: '+3% ce mois'
    },
    {
      title: 'Abonnements',
      value: stats.activeSubscriptions.toLocaleString(),
      description: 'Actifs',
      icon: Star,
      color: 'bg-yellow-600',
      trend: '+15% ce mois'
    },
    {
      title: 'Vues',
      value: stats.totalViews.toLocaleString(),
      description: 'Total des lectures',
      icon: Eye,
      color: 'bg-red-600',
      trend: '+22% ce mois'
    },
    {
      title: 'Favoris',
      value: stats.totalFavorites.toLocaleString(),
      description: 'Ajoutés',
      icon: Heart,
      color: 'bg-pink-600',
      trend: '+18% ce mois'
    },
    {
      title: 'Note moyenne',
      value: stats.averageRating.toFixed(1),
      description: 'Satisfaction',
      icon: TrendingUp,
      color: 'bg-indigo-600',
      trend: '+2% ce mois'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
        <p className="text-gray-400">Vue d'ensemble de l'activité de Novaflix</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                </div>
                <CardDescription className="text-xs text-gray-500">
                  {stat.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Graphiques et visualisations pourraient être ajoutés ici */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Activité récente</CardTitle>
            <CardDescription className="text-gray-400">
              Utilisateurs actifs ces dernières 24h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-400">Graphique d'activité</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Contenu populaire</CardTitle>
            <CardDescription className="text-gray-400">
              Films et séries les plus regardés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-700 rounded flex items-center justify-center">
              <p className="text-gray-400">Top du contenu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
