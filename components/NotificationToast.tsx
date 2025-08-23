'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationToastProps {
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  onClose: () => void;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-green-500 bg-green-500/10 text-green-400',
    iconClassName: 'text-green-500'
  },
  error: {
    icon: XCircle,
    className: 'border-red-500 bg-red-500/10 text-red-400',
    iconClassName: 'text-red-500'
  },
  warning: {
    icon: AlertCircle,
    className: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    iconClassName: 'text-yellow-500'
  },
  info: {
    icon: Info,
    className: 'border-blue-500 bg-blue-500/10 text-blue-400',
    iconClassName: 'text-blue-500'
  }
};

export default function NotificationToast({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = notificationConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Attendre l'animation de sortie
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Alert className={`min-w-80 border ${config.className}`}>
        <div className="flex items-start gap-3">
          <IconComponent className={`h-5 w-5 mt-0.5 ${config.iconClassName}`} />
          
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{title}</h4>
            <AlertDescription className="text-sm opacity-90">
              {message}
            </AlertDescription>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}

// Hook pour gérer les notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
  }>>([]);

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  };
}
