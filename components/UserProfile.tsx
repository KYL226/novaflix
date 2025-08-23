'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Camera, Crown, CreditCard, Lock } from 'lucide-react';
import { useNotifications } from './NotificationToast';

interface UserProfileData {
  name: string;
  email: string;
  avatar?: string;
}

export default function UserProfile() {
  const { user, token } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || !token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        showSuccess('Profil mis à jour', 'Votre profil a été modifié avec succès');
        setIsEditing(false);
      } else {
        const data = await response.json();
        showError('Erreur', data.error || 'Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      showError('Erreur', 'Erreur de connexion lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar
    });
    setIsEditing(false);
  };

  const getSubscriptionInfo = () => {
    switch (user?.subscription) {
      case 'premium':
        return {
          label: 'Premium',
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          icon: Crown,
          description: 'Accès illimité à tout le contenu'
        };
      case 'basic':
        return {
          label: 'Basique',
          color: 'bg-blue-600',
          icon: CreditCard,
          description: 'Accès limité au contenu'
        };
      default:
        return {
          label: 'Gratuit',
          color: 'bg-gray-600',
          icon: Lock,
          description: 'Contenu limité'
        };
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">Veuillez vous connecter pour voir votre profil</p>
      </div>
    );
  }

  const subscriptionInfo = getSubscriptionInfo();
  const IconComponent = subscriptionInfo.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Mon Profil</CardTitle>
          <CardDescription className="text-gray-400">
            Gérez vos informations personnelles et votre abonnement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar et informations de base */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileData.avatar || '/avatar-placeholder.jpg'} alt="Avatar" />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-700 border-gray-600"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={`${subscriptionInfo.color} text-white`}>
                  <IconComponent className="w-3 h-3 mr-1" />
                  {subscriptionInfo.label}
                </Badge>
                <span className="text-sm text-gray-400">
                  {subscriptionInfo.description}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                Membre depuis {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'récemment'}
              </p>
            </div>
          </div>

          {/* Formulaire d'édition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Nom</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations d'abonnement */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl text-white">Détails de l'abonnement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{subscriptionInfo.label}</p>
              <p className="text-sm text-gray-400">Plan actuel</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {user.subscription === 'premium' ? '19.99€' : user.subscription === 'basic' ? '9.99€' : 'Gratuit'}
              </p>
              <p className="text-sm text-gray-400">Prix mensuel</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {user.subscription === 'free' ? 'Limité' : 'Illimité'}
              </p>
              <p className="text-sm text-gray-400">Accès contenu</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
