// app/payment/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed' | 'verifying'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      const url = new URL(window.location.href);
      const txn_id = url.searchParams.get('txn_id');
      const user_id = url.searchParams.get('user_id');
      const plan = url.searchParams.get('plan');

      if (!txn_id || !user_id || !plan) {
        setError('Données de paiement manquantes');
        setStatus('failed');
        return;
      }

      setStatus('verifying');

      try {
        const res = await fetch(`/api/payments/verify?txn_id=${txn_id}&user_id=${user_id}&plan=${plan}`);
        const data = await res.json();

        if (data.success) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        setError('Erreur de vérification');
        setStatus('failed');
      }
    };

    verify();
  }, []);

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full">
        {status === 'verifying' && (
          <Alert className="bg-blue-900 border-blue-700">
            <Loader2 className="w-5 h-5 animate-spin" />
            <AlertTitle className="ml-2">Vérification en cours...</AlertTitle>
            <AlertDescription>Connexion au réseau de paiement.</AlertDescription>
          </Alert>
        )}

        {status === 'success' && (
          <Alert className="bg-green-900 border-green-700">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <AlertTitle className="ml-2">Paiement réussi !</AlertTitle>
            <AlertDescription>Votre abonnement est activé.</AlertDescription>
          </Alert>
        )}

        {status === 'failed' && (
          <Alert variant="destructive">
            <XCircle className="w-5 h-5" />
            <AlertTitle className="ml-2">Échec du paiement</AlertTitle>
            <AlertDescription>
              {error || 'Le paiement n\'a pas pu être confirmé. Veuillez réessayer.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 text-center">
          <Button
            onClick={handleContinue}
            disabled={status === 'verifying'}
            className="bg-red-600 hover:bg-red-700"
          >
            Retour au catalogue
          </Button>
        </div>
      </div>
    </div>
  );
}