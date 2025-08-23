'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement minimum pour éviter le clignotement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-white mb-2">Novaflix</h2>
        <p className="text-gray-400">Chargement en cours...</p>
      </div>
    </div>
  );
}
