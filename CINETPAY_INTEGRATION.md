# 🚀 Intégration CinetPay - NovaFlix

## 📋 Vue d'ensemble

Ce document décrit l'intégration complète de l'API CinetPay dans l'application NovaFlix pour gérer les paiements d'abonnement.

## 🔧 Configuration

### 1. Variables d'Environnement

Créez un fichier `.env.local` avec les variables suivantes :

```bash
# Configuration CinetPay
CINETPAY_API_KEY=your_cinetpay_api_key_here
CINETPAY_SITE_ID=your_cinetpay_site_id_here
CINETPAY_ENVIRONMENT=TEST  # ou PROD pour la production

# Configuration de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here

# Mode test
TEST_MODE_ENABLED=true
PAYMENT_TEST_MODE=true
```

### 2. Obtention des Clés CinetPay

1. Créez un compte sur [CinetPay](https://www.cinetpay.com/)
2. Accédez à votre dashboard
3. Récupérez votre `API_KEY` et `SITE_ID`
4. Configurez vos URLs de callback dans le dashboard CinetPay

## 🏗️ Architecture

### Structure des Fichiers

```
lib/
├── cinetpay-config.ts      # Configuration et types CinetPay
├── cinetpay-service.ts     # Service d'interaction avec l'API CinetPay

app/api/payments/
├── initiate/route.ts       # Initiation des paiements
├── verify/route.ts         # Vérification des paiements
└── cinetpay/
    └── webhook/route.ts    # Webhook CinetPay

app/payment/
├── page.tsx               # Page de sélection des plans
├── success/page.tsx       # Page de succès
└── cancel/page.tsx        # Page d'annulation
```

## 🔄 Flux de Paiement

### 1. Mode Test (Simulation)

```
Utilisateur → Sélection Plan → API Initiate → Simulation → Page Success
```

### 2. Mode Production (CinetPay)

```
Utilisateur → Sélection Plan → API Initiate → CinetPay → Webhook → Page Success
```

## 📡 API Endpoints

### POST /api/payments/initiate

**Request Body:**
```json
{
  "subscriptionType": "basic" | "premium",
  "testMode": boolean,
  "customerInfo": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "country": "string",
    "state": "string",
    "zipCode": "string"
  }
}
```

**Response (Mode Test):**
```json
{
  "success": true,
  "transactionId": "TEST_1234567890_ABC123",
  "plan": {
    "type": "basic",
    "price": 5000,
    "currency": "XOF",
    "name": "Basic"
  },
  "redirectUrl": "/payment/simulate?plan=basic&txn_id=TEST_1234567890_ABC123",
  "testMode": true
}
```

**Response (Mode Production):**
```json
{
  "success": true,
  "transactionId": "NOVAFLIX_1234567890_ABC123",
  "plan": {
    "type": "premium",
    "price": 12000,
    "currency": "XOF",
    "name": "Premium"
  },
  "redirectUrl": "https://checkout.cinetpay.com/...",
  "cinetPayData": {
    "paymentUrl": "https://checkout.cinetpay.com/...",
    "status": "PENDING",
    "message": "Paiement initié avec succès"
  },
  "testMode": false
}
```

### GET /api/payments/verify

**Query Parameters:**
- `txn_id`: ID de la transaction
- `plan`: Type d'abonnement
- `user_id`: ID de l'utilisateur (optionnel)

**Response:**
```json
{
  "success": true,
  "status": "success" | "pending" | "failed",
  "transaction_id": "string",
  "plan": "string",
  "amount": 5000,
  "currency": "XOF",
  "payment_method": "MOBILE_MONEY",
  "payment_date": "2024-01-15T10:30:00Z"
}
```

### POST /api/payments/cinetpay/webhook

**Request Body (CinetPay):**
```json
{
  "transaction_id": "string",
  "amount": 5000,
  "currency": "XOF",
  "status": "SUCCESS",
  "payment_method": "MOBILE_MONEY",
  "payment_date": "2024-01-15T10:30:00Z",
  "customer_name": "string",
  "customer_email": "string",
  "customer_phone": "string",
  "signature": "string"
}
```

## 🎯 Fonctionnalités

### Plans d'Abonnement

- **Basic**: 5,000 XOF/mois
  - Films populaires
  - Qualité HD
  - Sans publicité
  - Support standard

- **Premium**: 12,000 XOF/mois
  - Tous les films et séries
  - Qualité 4K Ultra HD
  - Téléchargement hors ligne
  - Contenu exclusif
  - Sans publicité
  - Support prioritaire

### Méthodes de Paiement Supportées

- **Mobile Money**: Orange Money, MTN Mobile Money, Moov Money
- **Cartes Bancaires**: Visa, Mastercard
- **Virements Bancaires**

## 🔒 Sécurité

### Webhook Signature

La vérification de signature des webhooks CinetPay est implémentée mais temporairement désactivée pour le développement.

**À implémenter en production :**
```typescript
function verifyWebhookSignature(body: any, signature: string): boolean {
  // Implémenter selon la documentation CinetPay
  // Vérifier que le webhook provient bien de CinetPay
}
```

### Validation des Données

- Validation des montants
- Validation des types d'abonnement
- Validation des informations client
- Gestion des erreurs CinetPay

## 🧪 Mode Test

### Activation

Le mode test est activé par défaut. Pour le désactiver :

1. Modifiez `TEST_MODE_ENABLED=false` dans `.env.local`
2. Ou utilisez le toggle dans l'interface utilisateur

### Simulation

En mode test :
- Aucun vrai paiement n'est effectué
- Les transactions sont simulées
- Redirection vers `/payment/simulate`
- Validation automatique des paiements

## 🚀 Déploiement

### 1. Préparation

1. Configurez vos variables d'environnement
2. Testez en mode TEST
3. Configurez vos URLs de callback dans CinetPay

### 2. Production

1. Changez `CINETPAY_ENVIRONMENT=PROD`
2. Utilisez vos vraies clés API
3. Configurez vos domaines de production
4. Testez les webhooks

### 3. URLs de Callback

Configurez dans votre dashboard CinetPay :

- **Return URL**: `https://votre-domaine.com/payment/success`
- **Cancel URL**: `https://votre-domaine.com/payment/cancel`
- **Notify URL**: `https://votre-domaine.com/api/payments/cinetpay/webhook`

## 📊 Monitoring

### Logs

Tous les événements sont loggés avec des emojis pour faciliter le débogage :

- 🚀 Initiation du paiement
- 📡 Réponse CinetPay
- ✅ Succès
- ❌ Erreurs
- ⏳ En attente
- 🔍 Vérification

### Métriques

- Taux de succès des paiements
- Temps de traitement
- Erreurs par type
- Statistiques par plan

## 🐛 Dépannage

### Erreurs Communes

1. **Configuration manquante**
   - Vérifiez vos variables d'environnement
   - Assurez-vous que `CINETPAY_API_KEY` et `CINETPAY_SITE_ID` sont définis

2. **Webhook non reçu**
   - Vérifiez l'URL de notification dans CinetPay
   - Assurez-vous que votre serveur est accessible depuis Internet

3. **Paiement non confirmé**
   - Vérifiez les logs de l'API de vérification
   - Contrôlez le statut dans le dashboard CinetPay

### Debug

Utilisez la page `/debug` pour tester chaque étape du processus de paiement.

## 📚 Ressources

- [Documentation CinetPay](https://docs.cinetpay.com/)
- [Dashboard CinetPay](https://admin.cinetpay.com/)
- [Support CinetPay](https://www.cinetpay.com/support)

## 🔄 Mises à Jour

### Version 1.0.0
- Intégration initiale CinetPay
- Support des modes test et production
- Gestion des webhooks
- Interface utilisateur complète

### Prochaines Étapes
- [ ] Vérification de signature des webhooks
- [ ] Intégration base de données
- [ ] Emails de confirmation
- [ ] Gestion des renouvellements
- [ ] Support multi-devises
- [ ] Analytics avancées

## 📞 Support

Pour toute question ou problème :

- **Email**: support@novaflix.com
- **Documentation**: Ce fichier et les commentaires dans le code
- **Issues**: Utilisez le système de gestion des problèmes de votre projet

---

**Note**: Cette intégration est conçue pour être robuste et facilement maintenable. Tous les composants sont modulaires et peuvent être étendus selon vos besoins spécifiques.
