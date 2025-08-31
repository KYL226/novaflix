import PaymentDebug from '@/components/PaymentDebug';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🐛 Debug du Système de Paiement</h1>
          <p className="text-gray-600">
            Testez chaque étape du processus de paiement pour identifier et résoudre les problèmes
          </p>
        </div>
        
        <PaymentDebug />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Cette page vous permet de diagnostiquer le système de paiement étape par étape
          </p>
        </div>
      </div>
    </div>
  );
}
