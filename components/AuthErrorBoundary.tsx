'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

export default function AuthErrorBoundary({ children }: AuthErrorBoundaryProps) {
  const { user, token, isLoading } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Détecter les erreurs d'authentification
    if (!isLoading && token && !user) {
      setHasError(true);
      setErrorMessage('Erreur d\'authentification détectée. Veuillez vous reconnecter.');
    } else if (!isLoading && !token && !user) {
      setHasError(false);
    } else if (!isLoading && user) {
      setHasError(false);
    }
  }, [user, token, isLoading]);

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    // Recharger la page pour réinitialiser l'état
    window.location.reload();
  };

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Erreur d'Authentification
          </h1>
          <p className="text-gray-400 mb-6">
            {errorMessage}
          </p>
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
            <Button onClick={handleLogin} variant="outline" className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Se Connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
