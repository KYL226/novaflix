'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Home, RefreshCw, CreditCard } from 'lucide-react';

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txn_id = searchParams.get('txn_id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <CardTitle className="text-red-600">Paiement Annulé</CardTitle>
              <CardDescription>
                Votre paiement a été annulé ou a échoué
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Détails de la transaction */}
              {txn_id && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <span className="font-medium text-gray-600">Transaction ID:</span>
                    <p className="text-gray-900 font-mono text-xs break-all">{txn_id}</p>
                  </div>
                </div>
              )}

              {/* Message d'explication */}
              <div className="text-center text-gray-600">
                <p className="mb-2">
                  Le processus de paiement a été interrompu. Cela peut être dû à :
                </p>
                <ul className="text-sm space-y-1 text-left">
                  <li>• Annulation de votre part</li>
                  <li>• Problème technique temporaire</li>
                  <li>• Expiration de la session de paiement</li>
                  <li>• Erreur lors du traitement</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/payment')} 
                  className="w-full"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Réessayer le Paiement
                </Button>
                
                <Button 
                  onClick={() => router.push('/')} 
                  className="w-full"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Retour à l'Accueil
                </Button>
              </div>

              {/* Support */}
              <div className="text-center text-sm text-gray-500">
                <p>
                  Si vous rencontrez des problèmes, contactez notre support :
                </p>
                <p className="font-medium text-blue-600">
                  support@novaflix.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

