'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Calendar, Clock, RefreshCw, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Subscription {
  id: string;
  type: 'basic' | 'premium';
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date | string;
  endDate: Date | string;
  daysRemaining: number;
  progress: number;
}

export default function SubscriptionStatus() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Convertir les dates en objets Date si nécessaire
  const normalizeSubscription = useCallback((sub: any): Subscription => {
    return {
      ...sub,
      startDate: sub.startDate instanceof Date ? sub.startDate : new Date(sub.startDate),
      endDate: sub.endDate instanceof Date ? sub.endDate : new Date(sub.endDate)
    };
  }, []);

  const loadSubscriptionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Nettoyer les anciennes données de test obsolètes
      cleanupOldTestData();

      // Essayer de récupérer l'abonnement depuis l'API
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/subscription/status', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.subscription) {
              setSubscription(normalizeSubscription(data.subscription));
              return;
            }
          }
        } catch (apiError) {
          console.log('API subscription non disponible, utilisation du localStorage');
        }
      }

      // Fallback : vérifier le localStorage pour les données CinetPay
      const cinetPaySubscription = getCinetPaySubscriptionFromStorage();
      if (cinetPaySubscription) {
        setSubscription(normalizeSubscription(cinetPaySubscription));
      } else {
        setSubscription(null);
      }

    } catch (error) {
      console.error('Erreur lors du chargement du statut:', error);
      setError('Erreur lors du chargement du statut de l\'abonnement');
    } finally {
      setIsLoading(false);
    }
  }, [normalizeSubscription]);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [loadSubscriptionStatus]);

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

  // Fermer le menu lors des changements de route
  useEffect(() => {
    setShowDetails(false);
  }, [router]);

  const cleanupOldTestData = useCallback(() => {
    // Supprimer les anciennes données de test obsolètes
    const oldKeys = [
      'cinetPaySubscription',
      'testSubscription',
      'mockSubscription'
    ];

    oldKeys.forEach(key => {
      const oldData = localStorage.getItem(key);
      if (oldData) {
        try {
          const parsed = JSON.parse(oldData);
          // Supprimer si plus de 24h
          if (parsed.timestamp && Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    });
  }, []);

  const getCinetPaySubscriptionFromStorage = useCallback((): Subscription | null => {
    try {
      const stored = localStorage.getItem('cinetPaySubscription');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.status === 'success') {
          return {
            id: parsed.id || 'local_test',
            type: parsed.type || 'basic',
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            daysRemaining: 30,
            progress: 100
          };
        }
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
    }
    return null;
  }, []);

  const refreshSubscription = useCallback(() => {
    loadSubscriptionStatus();
  }, [loadSubscriptionStatus]);

  const getSubscriptionIcon = useCallback((type: string) => {
    return type === 'premium' ? (
      <Crown className="w-5 h-5 text-yellow-500" />
    ) : (
      <Star className="w-5 h-5 text-blue-500" />
    );
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 hover:bg-green-700';
      case 'expired':
        return 'bg-red-600 hover:bg-red-700';
      case 'cancelled':
        return 'bg-gray-600 hover:bg-gray-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  }, []);

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'expired':
        return 'Expiré';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  }, []);

  const handleNavigateToPayment = useCallback(() => {
    setShowDetails(false);
    router.push('/payment');
  }, [router]);

  // Fonction sécurisée pour formater les dates
  const formatDate = useCallback((date: Date | string) => {
    try {
      if (date instanceof Date) {
        return date.toLocaleDateString('fr-FR');
      }
      if (typeof date === 'string') {
        return new Date(date).toLocaleDateString('fr-FR');
      }
      return 'Date invalide';
    } catch {
      return 'Date invalide';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="flex items-center space-x-2 text-sm"
        >
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Chargement...</span>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshSubscription}
          className="flex items-center space-x-2 text-sm text-red-400"
        >
          <span>Erreur</span>
        </Button>
      </div>
    );
  }

  // Composant compact pour l'en-tête (pas d'abonnement)
  if (!subscription) {
    return (
      <div className="relative" ref={menuRef}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 text-sm"
        >
          <CreditCard className="w-4 h-4" />
          <span>Abonnement</span>
          {showDetails ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </Button>

        {/* Menu déroulant */}
        {showDetails && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-white">Aucun Abonnement Actif</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Pour accéder au contenu premium, choisissez un plan d'abonnement
              </p>
              <Button
                onClick={handleNavigateToPayment}
                className="w-full bg-red-600 hover:bg-red-700"
                size="sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Choisir un Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center space-x-2 text-sm"
      >
        {getSubscriptionIcon(subscription.type)}
        <span>{subscription.type === 'premium' ? 'Premium' : 'Basic'}</span>
        <Badge className={getStatusColor(subscription.status)}>
          {getStatusText(subscription.status)}
        </Badge>
        {showDetails ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>

      {/* Menu déroulant avec détails */}
      {showDetails && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getSubscriptionIcon(subscription.type)}
                <span className="font-semibold text-white">
                  {subscription.type.toUpperCase()}
                </span>
                <Badge className={getStatusColor(subscription.status)}>
                  {getStatusText(subscription.status)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshSubscription}
                className="h-6 px-2"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>

            {/* Progression */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progression</span>
                <span className="text-white">{subscription.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${subscription.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">
                {subscription.daysRemaining} jours restants
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-gray-400">Début</span>
                  <p className="text-white text-xs">
                    {formatDate(subscription.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <div>
                  <span className="text-gray-400">Fin</span>
                  <p className="text-white text-xs">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-700">
              <Button 
                onClick={handleNavigateToPayment} 
                className="w-full"
                variant="outline"
                size="sm"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Continuer à regarder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

