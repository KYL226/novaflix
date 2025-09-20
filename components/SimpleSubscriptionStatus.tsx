'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, CreditCard, Lock, ChevronDown, ChevronUp, Star, Calendar, Zap } from 'lucide-react';

export default function SimpleSubscriptionStatus() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  // Déterminer le statut d'abonnement basé sur les données utilisateur
  const getSubscriptionInfo = () => {
    switch (user.subscription) {
      case 'premium':
        return {
          label: 'Premium',
          icon: Crown,
          color: 'bg-yellow-600 hover:bg-yellow-700',
          textColor: 'text-yellow-100',
          description: 'Accès illimité à tout le contenu'
        };
      case 'basic':
        return {
          label: 'Basic',
          icon: CreditCard,
          color: 'bg-blue-600 hover:bg-blue-700',
          textColor: 'text-blue-100',
          description: 'Accès limité au contenu'
        };
      case 'free':
      default:
        return {
          label: 'Gratuit',
          icon: Lock,
          color: 'bg-gray-600 hover:bg-gray-700',
          textColor: 'text-gray-100',
          description: 'Contenu limité'
        };
    }
  };

  const handleUpgrade = () => {
    router.push('/subscription');
    setShowDetails(false);
  };

  const handleManageSubscription = () => {
    router.push('/profile');
    setShowDetails(false);
  };

  const subscriptionInfo = getSubscriptionInfo();
  const IconComponent = subscriptionInfo.icon;

  return (
    <div className="relative" ref={menuRef}>
      <Badge 
        className={`${subscriptionInfo.color} ${subscriptionInfo.textColor} flex items-center space-x-1 cursor-pointer`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <IconComponent className="w-3 h-3" />
        <span>{subscriptionInfo.label}</span>
        {showDetails ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Badge>

      {/* Menu déroulant */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {user.subscription === 'free' ? (
              // Menu pour utilisateurs gratuits
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-white">Abonnement Gratuit</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Accédez à plus de contenu avec un abonnement premium
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Passer au Premium
                  </Button>
                  <Button
                    onClick={handleUpgrade}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    size="sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Plan Basic
                  </Button>
                </div>
              </div>
            ) : user.subscription === 'premium' ? (
              // Menu pour utilisateurs premium
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-500">Abonnement Premium</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-300">Accès illimité à tout le contenu</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-300">Renouvellement automatique</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-300">Qualité 4K disponible</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                    size="sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gérer l'Abonnement
                  </Button>
                </div>
              </div>
            ) : (
              // Menu pour utilisateurs basic
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-500">Abonnement Basic</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-300">Accès au contenu standard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-300">Renouvellement automatique</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-700 space-y-2">
                  <Button
                    onClick={handleUpgrade}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    size="sm"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Passer au Premium
                  </Button>
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                    size="sm"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gérer l'Abonnement
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
