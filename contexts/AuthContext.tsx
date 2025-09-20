// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import { verifyToken } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import { scheduleIdleCallback, optimizedStateUpdate, optimizedLocalStorage } from '@/lib/performance';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(() => {
    // Utiliser scheduleIdleCallback pour éviter les violations de performance
    scheduleIdleCallback(() => {
      performAuthCheck();
    });
  }, []);

  const performAuthCheck = useCallback(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      console.log('🔍 AuthContext - performAuthCheck:', { 
        token: storedToken ? 'présent' : 'absent', 
        user: storedUser ? 'présent' : 'absent' 
      });

      if (storedToken && storedUser) {
        const decoded = verifyToken(storedToken);
        if (decoded) {
          const user = JSON.parse(storedUser);
          console.log('🔍 AuthContext - Utilisateur chargé:', user);
          setToken(storedToken);
          setUser(user);
          return;
        } else {
          console.log('❌ AuthContext - Token invalide');
        }
      } else {
        console.log('🔍 AuthContext - Aucun token ou utilisateur trouvé');
      }
      
      // Si on arrive ici, c'est qu'il n'y a pas de token valide
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  // Vérification initiale de l'authentification
  useEffect(() => {
    checkAuth();
    setIsInitialized(true);
    setIsLoading(false);
  }, [checkAuth]);

  // Vérifier l'authentification lors des changements de route
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    // Si on a un token mais pas d'utilisateur, vérifier l'authentification
    if (token && !user) {
      // Utiliser setTimeout pour éviter les violations de performance
      const timeoutId = setTimeout(() => {
        checkAuth();
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [pathname, token, user, isLoading, isInitialized, checkAuth]);

  // Écouter les changements de localStorage (pour la synchronisation entre onglets)
  useEffect(() => {
    if (!isInitialized) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isInitialized, checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Utiliser les utilitaires de performance pour éviter les violations
      optimizedStateUpdate(setUser, data.user);
      optimizedStateUpdate(setToken, data.token);
      optimizedLocalStorage.setItem('user', JSON.stringify(data.user));
      optimizedLocalStorage.setItem('token', data.token);

      // Retourner les données utilisateur pour permettre la redirection
      return data.user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    // Connecter automatiquement l'utilisateur après inscription
    // Utiliser les utilitaires de performance pour éviter les violations
    optimizedStateUpdate(setUser, data.user);
    optimizedStateUpdate(setToken, data.token);
    optimizedLocalStorage.setItem('user', JSON.stringify(data.user));
    optimizedLocalStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Rediriger vers la page d'accueil après déconnexion
    router.push('/');
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};