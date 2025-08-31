'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { CheckCircle, AlertCircle, Info, X, CreditCard } from 'lucide-react';

export default function AuthNotification() {
  const { user, token, isLoading } = useAuth();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    if (isLoading) return;

    // Notification de connexion réussie
    if (user && token) {
      addNotification('success', `Bienvenue, ${user.name} ! Vous êtes maintenant connecté.`);
    }

    // Notification de déconnexion
    if (!user && !token && pathname !== '/auth') {
      addNotification('info', 'Vous avez été déconnecté. Veuillez vous reconnecter pour continuer.');
    }

    // Notification de navigation vers la page de paiement
    if (pathname === '/payment' && user) {
      addNotification('info', 'Page de paiement chargée. Votre session est maintenue.', 3000);
    }
  }, [user, token, isLoading, pathname]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string, duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = {
      id,
      type,
      message,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Supprimer automatiquement après la durée spécifiée
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-700';
      case 'error':
        return 'bg-red-900/90 border-red-700';
      case 'info':
        return 'bg-blue-900/90 border-blue-700';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBgColor(notification.type)} border rounded-lg p-4 text-white shadow-lg max-w-sm transition-all duration-300`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="text-sm">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
