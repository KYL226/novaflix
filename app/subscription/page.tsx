import SubscriptionStatus from '@/components/SubscriptionStatus';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Mon Abonnement</h1>
          <p className="text-gray-400 text-lg">
            Gérez et surveillez votre abonnement NovaFlix
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <SubscriptionStatus />
        </div>
      </div>
    </div>
  );
}
