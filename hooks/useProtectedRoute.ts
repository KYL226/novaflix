'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useProtectedRoute(requireAdmin: boolean = false) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      console.log('🔍 useProtectedRoute - Vérification:', { user, requireAdmin });
      
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      if (!user) {
        console.log('❌ useProtectedRoute - Utilisateur non connecté, redirection vers /auth');
        router.push('/auth');
        return;
      }

      // Si la route nécessite des droits admin et que l'utilisateur n'est pas admin
      if (requireAdmin && user.role !== 'admin') {
        console.log('❌ useProtectedRoute - Rôle non admin:', user.role, 'redirection vers /');
        router.push('/');
        return;
      }

      console.log('✅ useProtectedRoute - Accès autorisé');
    }
  }, [user, isLoading, requireAdmin, router]);

  return { user, isLoading };
}
