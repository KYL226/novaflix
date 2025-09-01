export interface CinetPayConfig {
  apiKey: string;
  siteId: string;
  environment: 'PROD' | 'TEST';
  currency: string;
  lang: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
}

export interface CinetPayTransaction {
  transaction_id: string;
  amount: number;
  currency: string;
  description: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  customer_state?: string;
  customer_zip_code?: string;
}

export interface CinetPayResponse {
  code: string;
  message: string;
  data?: {
    payment_url: string;
    transaction_id: string;
    status: string;
  };
}

export interface CinetPayVerificationResponse {
  code: string;
  message: string;
  data?: {
    transaction_id: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    payment_date: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  };
}

// Configuration par défaut (à personnaliser selon vos besoins)
export const defaultCinetPayConfig: CinetPayConfig = {
  apiKey: process.env.CINETPAY_API_KEY || 'your_cinetpay_api_key',
  siteId: process.env.CINETPAY_SITE_ID || 'your_cinetpay_site_id',
  environment: (process.env.CINETPAY_ENVIRONMENT as 'PROD' | 'TEST') || 'TEST',
  currency: 'XOF', // Franc CFA
  lang: 'fr',
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
  notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/cinetpay/webhook`,
};

// URLs des APIs CinetPay
export const CINETPAY_URLS = {
  TEST: {
    base: 'https://api-checkout.cinetpay.com/v2/payment',
    payment: 'https://api-checkout.cinetpay.com/v2/payment',
    verification: 'https://api-checkout.cinetpay.com/v2/payment/check',
  },
  PROD: {
    base: 'https://api-checkout.cinetpay.com/v2',
    payment: 'https://api-checkout.cinetpay.com/v2/payment',
    verification: 'https://api-checkout.cinetpay.com/v2/payment/check',
  },
};

// Méthodes de paiement supportées
export const CINETPAY_PAYMENT_METHODS = {
  MOBILE_MONEY: 'MOBILE_MONEY',
  ORANGE_MONEY: 'ORANGE_MONEY',
  MTN_MOBILE_MONEY: 'MTN_MOBILE_MONEY',
  MOOV_MONEY: 'MOOV_MONEY',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
};

// Statuts des transactions
export const CINETPAY_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

// Codes de réponse CinetPay
export const CINETPAY_CODES = {
  SUCCESS: '00',
  PENDING: '01',
  FAILED: '02',
  CANCELLED: '03',
  EXPIRED: '04',
  INVALID_AMOUNT: '05',
  INVALID_CURRENCY: '06',
  INVALID_SITE_ID: '07',
  INVALID_API_KEY: '08',
  INVALID_TRANSACTION_ID: '09',
  TRANSACTION_NOT_FOUND: '10',
  ALREADY_PROCESSED: '11',
  INVALID_SIGNATURE: '12',
  INVALID_IP: '13',
  INVALID_CALLBACK_URL: '14',
  INVALID_RETURN_URL: '15',
  INVALID_CANCEL_URL: '16',
  INVALID_NOTIFY_URL: '17',
  INVALID_CUSTOMER_INFO: '18',
  INVALID_PAYMENT_METHOD: '19',
  INVALID_DESCRIPTION: '20',
  INVALID_LANGUAGE: '21',
  INVALID_COUNTRY: '22',
  INVALID_PHONE: '23',
  INVALID_EMAIL: '24',
  INVALID_NAME: '25',
  INVALID_ADDRESS: '26',
  INVALID_CITY: '27',
  INVALID_STATE: '28',
  INVALID_ZIP_CODE: '29',
  INVALID_AMOUNT_FORMAT: '31',
  INVALID_TRANSACTION_ID_FORMAT: '32',
  INVALID_SITE_ID_FORMAT: '33',
  INVALID_API_KEY_FORMAT: '34',
  INVALID_SIGNATURE_FORMAT: '35',
  INVALID_IP_FORMAT: '36',
  INVALID_CALLBACK_URL_FORMAT: '37',
  INVALID_RETURN_URL_FORMAT: '38',
  INVALID_CANCEL_URL_FORMAT: '39',
  INVALID_NOTIFY_URL_FORMAT: '40',
  INVALID_CUSTOMER_INFO_FORMAT: '41',
  INVALID_PAYMENT_METHOD_FORMAT: '42',
  INVALID_DESCRIPTION_FORMAT: '43',
  INVALID_LANGUAGE_FORMAT: '44',
  INVALID_COUNTRY_FORMAT: '45',
  INVALID_PHONE_FORMAT: '46',
  INVALID_EMAIL_FORMAT: '47',
  INVALID_NAME_FORMAT: '48',
  INVALID_ADDRESS_FORMAT: '49',
  INVALID_CITY_FORMAT: '50',
  INVALID_STATE_FORMAT: '51',
  INVALID_ZIP_CODE_FORMAT: '52',
};

// Messages d'erreur CinetPay
export const CINETPAY_MESSAGES = {
  [CINETPAY_CODES.SUCCESS]: 'Transaction réussie',
  [CINETPAY_CODES.PENDING]: 'Transaction en attente',
  [CINETPAY_CODES.FAILED]: 'Transaction échouée',
  [CINETPAY_CODES.CANCELLED]: 'Transaction annulée',
  [CINETPAY_CODES.EXPIRED]: 'Transaction expirée',
  [CINETPAY_CODES.INVALID_AMOUNT]: 'Montant invalide',
  [CINETPAY_CODES.INVALID_CURRENCY]: 'Devise invalide',
  [CINETPAY_CODES.INVALID_SITE_ID]: 'Site ID invalide',
  [CINETPAY_CODES.INVALID_API_KEY]: 'Clé API invalide',
  [CINETPAY_CODES.INVALID_TRANSACTION_ID]: 'ID de transaction invalide',
  [CINETPAY_CODES.TRANSACTION_NOT_FOUND]: 'Transaction non trouvée',
  [CINETPAY_CODES.ALREADY_PROCESSED]: 'Transaction déjà traitée',
  [CINETPAY_CODES.INVALID_SIGNATURE]: 'Signature invalide',
  [CINETPAY_CODES.INVALID_IP]: 'Adresse IP invalide',
  [CINETPAY_CODES.INVALID_CALLBACK_URL]: 'URL de callback invalide',
  [CINETPAY_CODES.INVALID_RETURN_URL]: 'URL de retour invalide',
  [CINETPAY_CODES.INVALID_CANCEL_URL]: 'URL d\'annulation invalide',
  [CINETPAY_CODES.INVALID_NOTIFY_URL]: 'URL de notification invalide',
  [CINETPAY_CODES.INVALID_CUSTOMER_INFO]: 'Informations client invalides',
  [CINETPAY_CODES.INVALID_PAYMENT_METHOD]: 'Méthode de paiement invalide',
  [CINETPAY_CODES.INVALID_DESCRIPTION]: 'Description invalide',
  [CINETPAY_CODES.INVALID_LANGUAGE]: 'Langue invalide',
  [CINETPAY_CODES.INVALID_COUNTRY]: 'Pays invalide',
  [CINETPAY_CODES.INVALID_PHONE]: 'Téléphone invalide',
  [CINETPAY_CODES.INVALID_EMAIL]: 'Email invalide',
  [CINETPAY_CODES.INVALID_NAME]: 'Nom invalide',
  [CINETPAY_CODES.INVALID_ADDRESS]: 'Adresse invalide',
  [CINETPAY_CODES.INVALID_CITY]: 'Ville invalide',
  [CINETPAY_CODES.INVALID_STATE]: 'État invalide',
  [CINETPAY_CODES.INVALID_ZIP_CODE]: 'Code postal invalide',
  [CINETPAY_CODES.INVALID_CURRENCY]: 'Devise invalide',
  [CINETPAY_CODES.INVALID_AMOUNT_FORMAT]: 'Format de montant invalide',
  [CINETPAY_CODES.INVALID_TRANSACTION_ID_FORMAT]: 'Format d\'ID de transaction invalide',
  [CINETPAY_CODES.INVALID_SITE_ID_FORMAT]: 'Format de Site ID invalide',
  [CINETPAY_CODES.INVALID_API_KEY_FORMAT]: 'Format de clé API invalide',
  [CINETPAY_CODES.INVALID_SIGNATURE_FORMAT]: 'Format de signature invalide',
  [CINETPAY_CODES.INVALID_IP_FORMAT]: 'Format d\'adresse IP invalide',
  [CINETPAY_CODES.INVALID_CALLBACK_URL_FORMAT]: 'Format d\'URL de callback invalide',
  [CINETPAY_CODES.INVALID_RETURN_URL_FORMAT]: 'Format d\'URL de retour invalide',
  [CINETPAY_CODES.INVALID_CANCEL_URL_FORMAT]: 'Format d\'URL d\'annulation invalide',
  [CINETPAY_CODES.INVALID_NOTIFY_URL_FORMAT]: 'Format d\'URL de notification invalide',
  [CINETPAY_CODES.INVALID_CUSTOMER_INFO_FORMAT]: 'Format d\'informations client invalide',
  [CINETPAY_CODES.INVALID_PAYMENT_METHOD_FORMAT]: 'Format de méthode de paiement invalide',
  [CINETPAY_CODES.INVALID_DESCRIPTION_FORMAT]: 'Format de description invalide',
  [CINETPAY_CODES.INVALID_LANGUAGE_FORMAT]: 'Format de langue invalide',
  [CINETPAY_CODES.INVALID_COUNTRY_FORMAT]: 'Format de pays invalide',
  [CINETPAY_CODES.INVALID_PHONE_FORMAT]: 'Format de téléphone invalide',
  [CINETPAY_CODES.INVALID_EMAIL_FORMAT]: 'Format d\'email invalide',
  [CINETPAY_CODES.INVALID_NAME_FORMAT]: 'Format de nom invalide',
  [CINETPAY_CODES.INVALID_ADDRESS_FORMAT]: 'Format d\'adresse invalide',
  [CINETPAY_CODES.INVALID_CITY_FORMAT]: 'Format de ville invalide',
  [CINETPAY_CODES.INVALID_STATE_FORMAT]: 'Format d\'état invalide',
  [CINETPAY_CODES.INVALID_ZIP_CODE_FORMAT]: 'Format de code postal invalide',
};

// Fonction utilitaire pour obtenir le message d'erreur
export function getCinetPayMessage(code: string): string {
  return CINETPAY_MESSAGES[code as keyof typeof CINETPAY_MESSAGES] || `Code d'erreur inconnu: ${code}`;
}

// Fonction utilitaire pour vérifier si une transaction est réussie
export function isCinetPaySuccess(code: string): boolean {
  return code === CINETPAY_CODES.SUCCESS;
}

// Fonction utilitaire pour vérifier si une transaction est en attente
export function isCinetPayPending(code: string): boolean {
  return code === CINETPAY_CODES.PENDING;
}

// Fonction utilitaire pour vérifier si une transaction a échoué
export function isCinetPayFailed(code: string): boolean {
  return code === CINETPAY_CODES.FAILED || code === CINETPAY_CODES.CANCELLED || code === CINETPAY_CODES.EXPIRED;
}

