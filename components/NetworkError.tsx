'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface NetworkErrorProps {
  error: string;
  onRetry: () => void;
  className?: string;
}

export default function NetworkError({ error, onRetry, className = '' }: NetworkErrorProps) {
  const isNetworkError = error.includes('réseau') || 
                        error.includes('connexion') || 
                        error.includes('fetch') ||
                        error.includes('network');

  return (
    <div className={`text-center p-6 ${className}`}>
      <Alert variant="destructive" className="max-w-md mx-auto mb-4">
        <div className="flex items-center gap-2">
          {isNetworkError ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <Wifi className="h-4 w-4" />
          )}
          <AlertDescription>
            {isNetworkError 
              ? 'Problème de connexion réseau'
              : 'Une erreur s\'est produite'
            }
          </AlertDescription>
        </div>
      </Alert>
      
      <p className="text-gray-400 mb-4 text-sm">
        {error}
      </p>
      
      <div className="space-y-2">
        <Button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
        
        {isNetworkError && (
          <p className="text-xs text-gray-500">
            Vérifiez votre connexion internet et réessayez
          </p>
        )}
      </div>
    </div>
  );
}
