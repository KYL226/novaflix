'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, Calendar, LogOut, Crown, ChevronDown, ChevronUp, Star, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { isLoading } = useProtectedRoute();
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null; // useProtectedRoute gère la redirection
  }

  const toggleSubscriptionDetails = () => {
    setShowSubscriptionDetails(!showSubscriptionDetails);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Mon Profil</h1>
          <p className="text-gray-400">Gérez vos informations personnelles et votre abonnement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informations du profil */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || '/avatar-placeholder.svg'} alt="Avatar" />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Shield className="h-4 w-4" />
                <span className="capitalize">{user.role}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>Membre depuis {new Date().toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Modifier le Profil
              </Button>
              <Button className="w-full" variant="outline">
                Changer l'Avatar
              </Button>
              <Button className="w-full" variant="outline">
                Changer le Mot de Passe
              </Button>
              <Button 
                className="w-full" 
                variant="destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se Déconnecter
              </Button>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">0</div>
                <div className="text-sm text-gray-400">Films Regardés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-sm text-gray-400">Favoris</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">0</div>
                <div className="text-sm text-gray-400">Heures de Visionnage</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Abonnement Compacte */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader 
            className="cursor-pointer hover:bg-gray-700/50 transition-colors"
            onClick={toggleSubscriptionDetails}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span>Mon Abonnement</span>
              </CardTitle>
              {showSubscriptionDetails ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          
          {showSubscriptionDetails && (
            <CardContent className="border-t border-gray-700 pt-6">
              {user.subscription === 'premium' ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-yellow-500 mr-2" />
                    <span className="text-xl font-semibold text-yellow-500">Abonnement Premium Actif</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Profitez de tous nos contenus exclusifs et de la meilleure qualité disponible.
                  </p>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Gérer l'Abonnement
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-blue-500 mr-2" />
                    <span className="text-xl font-semibold text-blue-500">Aucun Abonnement Actif</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Pour accéder au contenu premium, choisissez un plan d'abonnement.
                  </p>
                  <Button className="bg-red-600 hover:bg-red-700">
                    Choisir un Plan
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
