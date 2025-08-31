'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Play, 
  Image, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Info
} from 'lucide-react';

interface MediaTestResult {
  type: 'image' | 'video';
  path: string;
  status: 'success' | 'error' | 'loading';
  error?: string;
  responseTime?: number;
}

export default function MediaTest() {
  const [results, setResults] = useState<MediaTestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [userToken, setUserToken] = useState<string>('');
  const [userSubscription, setUserSubscription] = useState<string>('');

  useEffect(() => {
    // Récupérer le token et l'abonnement depuis le localStorage
    const token = localStorage.getItem('token') || '';
    const subscription = localStorage.getItem('userSubscription') || 'free';
    
    setUserToken(token);
    setUserSubscription(subscription);
  }, []);

  const testMediaAccess = async (type: 'image' | 'video', path: string) => {
    const startTime = Date.now();
    
    try {
      let url: string;
      
      if (type === 'image') {
        // Les images sont publiques
        url = `/api/secure-media/${path}`;
      } else {
        // Les vidéos nécessitent un token
        url = `/api/secure-media/${path}?token=${userToken}`;
      }

      const response = await fetch(url);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.ok) {
        return {
          type,
          path,
          status: 'success' as const,
          responseTime
        };
      } else {
        const errorText = await response.text();
        return {
          type,
          path,
          status: 'error' as const,
          error: `${response.status}: ${errorText}`,
          responseTime
        };
      }
    } catch (error) {
      const endTime = Date.now();
      return {
        type,
        path,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        responseTime: endTime - startTime
      };
    }
  };

  const testSecureMediaAPI = async () => {
    if (!userToken) {
      alert('Aucun token disponible. Veuillez vous connecter d\'abord.');
      return;
    }

    console.log('🧪 Test de l\'API de média sécurisé...');
    console.log('🔑 Token utilisé:', userToken.substring(0, 20) + '...');
    
    try {
      // Test avec le token dans les paramètres de requête
      const urlWithToken = `/api/secure-media/videos/test.mp4?token=${userToken}`;
      console.log('🔗 URL de test:', urlWithToken);
      
      const response = await fetch(urlWithToken);
      console.log('📡 Réponse de l\'API:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (response.ok) {
        console.log('✅ Accès autorisé à la vidéo');
        alert('✅ Accès autorisé ! L\'API fonctionne correctement.');
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur API:', errorText);
        alert(`❌ Erreur ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      alert(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setResults([]);

    const testCases = [
      { type: 'image' as const, path: 'images/poster1.jpg' },
      { type: 'image' as const, path: 'images/poster2.jpg' },
      { type: 'video' as const, path: 'videos/hist.mp4' },
      { type: 'video' as const, path: 'videos/sample.mp4' },
    ];

    const newResults: MediaTestResult[] = [];

    for (const testCase of testCases) {
      const result = await testMediaAccess(testCase.type, testCase.path);
      newResults.push(result);
      setResults([...newResults]);
      
      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsTesting(false);
  };

  const getStatusIcon = (status: MediaTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: MediaTestResult['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'loading':
        return 'text-blue-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Test d'accès aux médias sécurisés
          </CardTitle>
          <CardDescription>
            Vérifiez l'accès aux images et vidéos de votre application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Token utilisateur</Label>
              <div className="flex items-center gap-2">
                <Badge variant={userToken ? "default" : "secondary"}>
                  {userToken ? 'Token présent' : 'Aucun token'}
                </Badge>
                {userToken && (
                  <span className="text-xs text-gray-500">
                    {userToken.substring(0, 20)}...
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Abonnement</Label>
              <Badge 
                variant={userSubscription !== 'free' ? "default" : "secondary"}
                className={userSubscription !== 'free' ? 'bg-green-600' : ''}
              >
                {userSubscription === 'free' ? 'Gratuit' : userSubscription}
              </Badge>
            </div>
          </div>

          <Button 
            onClick={runAllTests}
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Tests en cours...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Lancer tous les tests
              </>
            )}
          </Button>

          <Button 
            onClick={testSecureMediaAPI}
            disabled={!userToken}
            variant="outline"
            className="w-full mt-2"
          >
            🧪 Tester l'API Média Sécurisé
          </Button>
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des tests</CardTitle>
            <CardDescription>
              Statut de l'accès aux différents types de médias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {result.type === 'image' ? (
                      <Image className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Video className="w-5 h-5 text-purple-500" />
                    )}
                    
                    <div>
                      <div className="font-medium">{result.path}</div>
                      <div className="text-sm text-gray-500">
                        {result.type === 'image' ? 'Image publique' : 'Vidéo sécurisée'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {result.responseTime && (
                      <span className="text-sm text-gray-500">
                        {result.responseTime}ms
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className={`font-medium ${getStatusColor(result.status)}`}>
                        {result.status === 'success' ? 'Succès' : 
                         result.status === 'error' ? 'Erreur' : 'En cours'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Résumé</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total:</span> {results.length}
                </div>
                <div>
                  <span className="font-medium">Succès:</span> {results.filter(r => r.status === 'success').length}
                </div>
                <div>
                  <span className="font-medium">Erreurs:</span> {results.filter(r => r.status === 'error').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils de dépannage */}
      {results.some(r => r.status === 'error') && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-yellow-600">Conseils de dépannage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert>
                <AlertTriangle className="w-4 h-4" />
                <AlertTitle>Problèmes d'autorisation (401/403)</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Vérifiez que vous êtes connecté et que votre token est valide</li>
                    <li>Assurez-vous d'avoir un abonnement actif (basic ou premium)</li>
                    <li>Vérifiez que le token n'a pas expiré</li>
                    <li>Testez d'abord la connexion via /auth/login</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertTitle>Mode test recommandé</AlertTitle>
                <AlertDescription>
                  Utilisez le système de paiement en mode test pour activer un abonnement 
                  et tester l'accès aux vidéos sécurisées.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant Label simple pour éviter les erreurs d'import
const Label = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);
