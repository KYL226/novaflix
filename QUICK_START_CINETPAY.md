# 🚀 Démarrage Rapide - CinetPay NovaFlix

## ⚡ Installation en 5 Minutes

### 1. Configuration des Variables d'Environnement

Copiez le fichier `cinetpay.env` vers `.env.local` :

```bash
cp cinetpay.env .env.local
```

Modifiez `.env.local` avec vos vraies valeurs :

```bash
# Remplacez par vos vraies clés CinetPay
CINETPAY_API_KEY=your_real_api_key_here
CINETPAY_SITE_ID=your_real_site_id_here

# Gardez en TEST pour le développement
CINETPAY_ENVIRONMENT=TEST
```

### 2. Démarrage de l'Application

```bash
npm run dev
```

### 3. Test de l'Intégration

1. Allez sur `http://localhost:3000/payment`
2. Sélectionnez un plan (Basic ou Premium)
3. Cliquez sur "Procéder au Paiement (Test)"
4. Testez le processus de simulation

## 🔑 Obtention des Clés CinetPay

### Étape 1: Créer un Compte
- Allez sur [CinetPay](https://www.cinetpay.com/)
- Cliquez sur "Créer un compte"
- Remplissez le formulaire d'inscription

### Étape 2: Accéder au Dashboard
- Connectez-vous à votre compte
- Accédez à la section "API & Intégration"

### Étape 3: Récupérer les Clés
- **API Key**: Clé d'authentification pour l'API
- **Site ID**: Identifiant unique de votre site
- **Environment**: TEST (développement) ou PROD (production)

### Étape 4: Configurer les URLs
Dans votre dashboard CinetPay, configurez :

```
Return URL: http://localhost:3000/payment/success
Cancel URL: http://localhost:3000/payment/cancel
Notify URL: http://localhost:3000/api/payments/cinetpay/webhook
```

## 🧪 Test du Mode Production

### 1. Activer le Mode Production

Dans l'interface utilisateur :
- Allez sur `/payment`
- Cliquez sur "🌐 Mode Production"

### 2. Remplir les Informations Client

- Nom complet
- Email
- Téléphone
- Adresse (optionnel)

### 3. Tester le Paiement

- Sélectionnez un plan
- Cliquez sur "Payer avec CinetPay"
- Vous serez redirigé vers CinetPay

## 📱 Test des Méthodes de Paiement

### Mobile Money (Mode Test)
- **Orange Money**: Utilisez un numéro de test
- **MTN Mobile Money**: Numéro de test fourni
- **Moov Money**: Numéro de test fourni

### Cartes Bancaires (Mode Test)
- **Numéro**: 4242 4242 4242 4242
- **Date**: Date future quelconque
- **CVC**: 123

## 🔍 Debug et Monitoring

### Page de Debug
Allez sur `/debug` pour tester chaque étape individuellement.

### Logs de la Console
Tous les événements sont loggés avec des emojis :
- 🚀 Initiation
- 📡 Réponse CinetPay
- ✅ Succès
- ❌ Erreurs

### Vérification des Paiements
Utilisez `/api/payments/verify?txn_id=VOTRE_ID` pour vérifier un paiement.

## 🚨 Problèmes Courants

### Erreur: "Configuration CinetPay manquante"
**Solution**: Vérifiez que `CINETPAY_API_KEY` et `CINETPAY_SITE_ID` sont définis dans `.env.local`

### Erreur: "Webhook non reçu"
**Solution**: 
- Vérifiez l'URL de notification dans CinetPay
- Assurez-vous que votre serveur est accessible

### Paiement non confirmé
**Solution**:
- Vérifiez les logs de l'API
- Contrôlez le statut dans le dashboard CinetPay

## 📚 Ressources Utiles

- **Documentation complète**: `CINETPAY_INTEGRATION.md`
- **Dashboard CinetPay**: [admin.cinetpay.com](https://admin.cinetpay.com/)
- **Support CinetPay**: [cinetpay.com/support](https://www.cinetpay.com/support)

## 🎯 Prochaines Étapes

1. **Testez en mode TEST** jusqu'à ce que tout fonctionne
2. **Configurez vos vraies clés** CinetPay
3. **Testez en mode PRODUCTION** avec de petits montants
4. **Configurez vos domaines** de production
5. **Activez la vérification** des signatures webhook

## 📞 Support

- **Email**: support@novaflix.com
- **Documentation**: Lisez `CINETPAY_INTEGRATION.md`
- **Debug**: Utilisez la page `/debug`

---

**💡 Conseil**: Commencez toujours par le mode TEST pour valider votre intégration avant de passer en production !
