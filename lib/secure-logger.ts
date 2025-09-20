// lib/secure-logger.ts
/**
 * Utilitaire pour gérer les logs de manière sécurisée
 * Désactive automatiquement les logs en production pour éviter l'exposition d'informations sensibles
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  sensitive?: boolean; // Si true, ne jamais logger en production
  context?: string;
}

class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log sécurisé - ne s'affiche qu'en développement
   */
  secure(message: string, data?: any, options?: LogOptions) {
    if (this.isDevelopment) {
      this.log(message, data, options);
    }
  }

  /**
   * Log d'erreur sécurisé - ne s'affiche qu'en développement
   */
  secureError(message: string, error?: any, options?: LogOptions) {
    if (this.isDevelopment) {
      console.error(`🔒 [SECURE] ${message}`, error);
    }
  }

  /**
   * Log d'information générique - peut être affiché en production
   */
  info(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`ℹ️ ${message}`, data);
    }
  }

  /**
   * Log d'avertissement - peut être affiché en production
   */
  warn(message: string, data?: any) {
    console.warn(`⚠️ ${message}`, data);
  }

  /**
   * Log d'erreur critique - toujours affiché
   */
  error(message: string, error?: any) {
    console.error(`❌ ${message}`, error);
  }

  /**
   * Log de débogage - seulement en développement
   */
  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`🐛 [DEBUG] ${message}`, data);
    }
  }

  private log(message: string, data?: any, options?: LogOptions) {
    const prefix = options?.context ? `[${options.context}]` : '';
    const level = options?.level || 'info';
    
    switch (level) {
      case 'error':
        console.error(`🔒 ${prefix} ${message}`, data);
        break;
      case 'warn':
        console.warn(`🔒 ${prefix} ${message}`, data);
        break;
      case 'debug':
        console.log(`🔒 ${prefix} ${message}`, data);
        break;
      default:
        console.log(`🔒 ${prefix} ${message}`, data);
    }
  }
}

// Instance singleton
export const secureLogger = new SecureLogger();

// Fonctions utilitaires pour un usage facile
export const secureLog = (message: string, data?: any) => secureLogger.secure(message, data);
export const secureError = (message: string, error?: any) => secureLogger.secureError(message, error);
export const secureInfo = (message: string, data?: any) => secureLogger.info(message, data);
export const secureWarn = (message: string, data?: any) => secureLogger.warn(message, data);
export const secureDebug = (message: string, data?: any) => secureLogger.debug(message, data);

export default secureLogger;
