'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Une erreur inattendue s'est produite
              </AlertDescription>
            </Alert>
            
            <p className="text-gray-400 mb-6">
              L'application a rencontré un problème. Veuillez réessayer.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Recharger la page
              </Button>
              
              <Button
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
