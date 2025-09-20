// lib/performance.ts
/**
 * Utilitaires pour optimiser les performances et éviter les violations
 */

/**
 * Exécute une fonction de manière asynchrone pour éviter les violations de performance
 * Utilise requestIdleCallback si disponible, sinon setTimeout
 */
export const scheduleIdleCallback = (callback: () => void): void => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
};

/**
 * Exécute une fonction avec un délai minimal pour éviter les violations de performance
 */
export const scheduleAsync = (callback: () => void, delay: number = 0): void => {
  setTimeout(callback, delay);
};

/**
 * Debounce une fonction pour éviter les appels trop fréquents
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle une fonction pour limiter la fréquence d'exécution
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Mesure les performances d'une fonction
 */
export const measurePerformance = <T extends (...args: any[]) => any>(
  func: T,
  name: string = 'Function'
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    
    if (end - start > 16) { // Plus de 16ms (60fps)
      console.warn(`⚠️ ${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  }) as T;
};

/**
 * Optimise les mises à jour d'état pour éviter les violations de performance
 */
export const optimizedStateUpdate = <T>(
  setter: (value: T) => void,
  value: T
): void => {
  scheduleIdleCallback(() => {
    setter(value);
  });
};

/**
 * Optimise les opérations localStorage pour éviter les violations de performance
 */
export const optimizedLocalStorage = {
  setItem: (key: string, value: string): void => {
    scheduleIdleCallback(() => {
      localStorage.setItem(key, value);
    });
  },
  
  getItem: (key: string): string | null => {
    return localStorage.getItem(key);
  },
  
  removeItem: (key: string): void => {
    scheduleIdleCallback(() => {
      localStorage.removeItem(key);
    });
  }
};
