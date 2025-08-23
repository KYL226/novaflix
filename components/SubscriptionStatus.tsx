'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Lock, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionStatus() {
  const { user } = useAuth();

  if (!user) return null;

  const getSubscriptionInfo = () => {
    switch (user.subscription) {
      case 'premium':
        return {
          label: 'Premium',
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          icon: Crown,
          description: 'Accès illimité à tout le contenu'
        };
      case 'basic':
        return {
          label: 'Basique',
          color: 'bg-blue-600',
          icon: CreditCard,
          description: 'Accès limité au contenu'
        };
      default:
        return {
          label: 'Gratuit',
          color: 'bg-gray-600',
          icon: Lock,
          description: 'Contenu limité'
        };
    }
  };

  const subscriptionInfo = getSubscriptionInfo();
  const IconComponent = subscriptionInfo.icon;

  return (
    <div className="flex items-center space-x-3">
      <Badge className={`${subscriptionInfo.color} text-white`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {subscriptionInfo.label}
      </Badge>
      
      {user.subscription === 'free' && (
        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
          <Link href="/subscription">
            <Crown className="w-3 h-3 mr-1" />
            S'abonner
          </Link>
        </Button>
      )}
      
      {user.subscription && user.subscription !== 'free' && (
        <span className="text-xs text-gray-400 hidden md:block">
          {subscriptionInfo.description}
        </span>
      )}
    </div>
  );
}
