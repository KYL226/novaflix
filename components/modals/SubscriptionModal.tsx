// modals/SubscriptionModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'basic' | 'premium') => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionType: plan }),
      });

      const data = await res.json();

      if (res.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Échec de l\'initiation du paiement');
      }
    } catch (err: any) {
      setError('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-white/20">
        <DialogHeader>
          <DialogTitle>Choisissez votre abonnement</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-lg">Abonnement Basique</h3>
            <p className="text-gray-400 text-sm">Accès aux films et séries</p>
            <p className="font-semibold mt-2">5 000 FCFA / mois</p>
            <Button
              onClick={() => handleSubscribe('basic')}
              disabled={loading}
              className="w-full mt-3 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Chargement...' : 'Souscrire'}
            </Button>
          </div>

          <div className="border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-lg">Abonnement Premium</h3>
            <p className="text-gray-400 text-sm">HD, 4K, téléchargements</p>
            <p className="font-semibold mt-2">10 000 FCFA / mois</p>
            <Button
              onClick={() => handleSubscribe('premium')}
              disabled={loading}
              variant="outline"
              className="w-full mt-3 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              {loading ? 'Chargement...' : 'Souscrire'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}