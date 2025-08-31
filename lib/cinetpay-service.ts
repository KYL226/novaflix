import { 
  CinetPayConfig, 
  CinetPayTransaction, 
  CinetPayResponse, 
  CinetPayVerificationResponse,
  CINETPAY_URLS,
  CINETPAY_CODES,
  getCinetPayMessage,
  isCinetPaySuccess,
  isCinetPayPending,
  isCinetPayFailed
} from './cinetpay-config';

export class CinetPayService {
  private config: CinetPayConfig;

  constructor(config?: Partial<CinetPayConfig>) {
    this.config = { ...this.getDefaultConfig(), ...config };
  }

  private getDefaultConfig(): CinetPayConfig {
    return {
      apiKey: process.env.CINETPAY_API_KEY || '',
      siteId: process.env.CINETPAY_SITE_ID || '',
      environment: (process.env.CINETPAY_ENVIRONMENT as 'PROD' | 'TEST') || 'TEST',
      currency: 'XOF',
      lang: 'fr',
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/cinetpay/webhook`,
    };
  }

  /**
   * Initialise un paiement CinetPay
   */
  async initiatePayment(transaction: CinetPayTransaction): Promise<CinetPayResponse> {
    try {
      // Validation des paramètres
      if (!this.config.apiKey || !this.config.siteId) {
        throw new Error('Configuration CinetPay manquante: API_KEY et SITE_ID requis');
      }

      if (!transaction.amount || transaction.amount <= 0) {
        throw new Error('Montant invalide');
      }

      if (!transaction.transaction_id) {
        throw new Error('ID de transaction requis');
      }

      // Préparation des données pour CinetPay
      const paymentData = {
        apikey: this.config.apiKey,
        site_id: this.config.siteId,
        transaction_id: transaction.transaction_id,
        amount: transaction.amount,
        currency: transaction.currency || this.config.currency,
        description: transaction.description,
        return_url: transaction.return_url || this.config.returnUrl,
        cancel_url: transaction.cancel_url || this.config.cancelUrl,
        notify_url: transaction.notify_url || this.config.notifyUrl,
        lang: this.config.lang,
        customer_name: transaction.customer_name,
        customer_email: transaction.customer_email,
        customer_phone: transaction.customer_phone,
        customer_address: transaction.customer_address,
        customer_city: transaction.customer_city,
        customer_country: transaction.customer_country,
        customer_state: transaction.customer_state,
        customer_zip_code: transaction.customer_zip_code,
      };

      console.log('🚀 Initiation du paiement CinetPay:', {
        transaction_id: paymentData.transaction_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        environment: this.config.environment
      });

      // Appel à l'API CinetPay
      const response = await fetch(CINETPAY_URLS[this.config.environment].payment, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      const result: CinetPayResponse = await response.json();
      
      console.log('📡 Réponse CinetPay:', result);

      // Vérification de la réponse
      if (result.code === CINETPAY_CODES.SUCCESS && result.data?.payment_url) {
        console.log('✅ Paiement initié avec succès');
        return result;
      } else {
        const errorMessage = getCinetPayMessage(result.code) || result.message;
        console.error('❌ Erreur CinetPay:', errorMessage);
        throw new Error(`Erreur CinetPay: ${errorMessage}`);
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'initiation du paiement:', error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async verifyPayment(transactionId: string): Promise<CinetPayVerificationResponse> {
    try {
      if (!this.config.apiKey || !this.config.siteId) {
        throw new Error('Configuration CinetPay manquante: API_KEY et SITE_ID requis');
      }

      if (!transactionId) {
        throw new Error('ID de transaction requis');
      }

      console.log('🔍 Vérification du paiement:', transactionId);

      // Préparation des données de vérification
      const verificationData = {
        apikey: this.config.apiKey,
        site_id: this.config.siteId,
        transaction_id: transactionId,
      };

      // Appel à l'API de vérification CinetPay
      const response = await fetch(CINETPAY_URLS[this.config.environment].verification, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      const result: CinetPayVerificationResponse = await response.json();
      
      console.log('📡 Réponse de vérification CinetPay:', result);

      // Vérification de la réponse
      if (result.code === CINETPAY_CODES.SUCCESS && result.data) {
        console.log('✅ Vérification réussie');
        return result;
      } else {
        const errorMessage = getCinetPayMessage(result.code) || result.message;
        console.error('❌ Erreur de vérification CinetPay:', errorMessage);
        throw new Error(`Erreur de vérification: ${errorMessage}`);
      }

    } catch (error) {
      console.error('❌ Erreur lors de la vérification du paiement:', error);
      throw error;
    }
  }

  /**
   * Génère un ID de transaction unique
   */
  generateTransactionId(prefix: string = 'NOVAFLIX'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Vérifie si une transaction est réussie
   */
  isTransactionSuccess(response: CinetPayVerificationResponse): boolean {
    return isCinetPaySuccess(response.code);
  }

  /**
   * Vérifie si une transaction est en attente
   */
  isTransactionPending(response: CinetPayVerificationResponse): boolean {
    return isCinetPayPending(response.code);
  }

  /**
   * Vérifie si une transaction a échoué
   */
  isTransactionFailed(response: CinetPayVerificationResponse): boolean {
    return isCinetPayFailed(response.code);
  }

  /**
   * Obtient le message d'erreur pour un code donné
   */
  getErrorMessage(code: string): string {
    return getCinetPayMessage(code);
  }

  /**
   * Valide la configuration CinetPay
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.apiKey) {
      errors.push('Clé API CinetPay manquante');
    }

    if (!this.config.siteId) {
      errors.push('Site ID CinetPay manquant');
    }

    if (!this.config.returnUrl) {
      errors.push('URL de retour manquante');
    }

    if (!this.config.cancelUrl) {
      errors.push('URL d\'annulation manquante');
    }

    if (!this.config.notifyUrl) {
      errors.push('URL de notification manquante');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtient la configuration actuelle
   */
  getConfig(): CinetPayConfig {
    return { ...this.config };
  }

  /**
   * Met à jour la configuration
   */
  updateConfig(newConfig: Partial<CinetPayConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Instance singleton du service
export const cinetPayService = new CinetPayService();

// Fonction utilitaire pour créer une instance avec une configuration personnalisée
export function createCinetPayService(config: Partial<CinetPayConfig>): CinetPayService {
  return new CinetPayService(config);
}

