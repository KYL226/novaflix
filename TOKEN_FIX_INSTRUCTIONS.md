# 🔧 Instructions pour résoudre l'erreur 401 - Token invalide

## 🚨 Problème identifié

L'erreur suivante se produit lors de la lecture des vidéos :
```
Erreur 401: Problème d'authentification. Vérifiez votre token et votre abonnement.
Failed to load resource: the server responded with a status of 401 (Unauthorized)
```

## 🔍 Cause du problème

Le token JWT stocké dans le localStorage de l'application a expiré ou n'est pas synchronisé avec le serveur.

## ✅ Solution

### Étape 1 : Générer un nouveau token

Exécutez le script pour générer un nouveau token valide :

```bash
node scripts/force-reconnect.js
```

### Étape 2 : Mettre à jour le token dans le navigateur

1. Ouvrez votre navigateur et allez sur `http://localhost:3000`
2. Ouvrez les DevTools (F12)
3. Allez dans la console
4. Exécutez les commandes suivantes (remplacez par les valeurs générées par le script) :

```javascript
// Remplacez par le nouveau token généré
localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTk2MjE3NDlhYzM5ZjcxYzY3MThkZiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJzdWJzY3JpcHRpb24iOiJwcmVtaXVtIiwiaWF0IjoxNzU2NjMxNjg1LCJleHAiOjE3NTcyMzY0ODV9.7KHQfErGGMOiwOm452eRJxrA_o4_wRWl3u-KXySKh2g");

// Remplacez par les données utilisateur
localStorage.setItem("user", '{"_id":"68a9621749ac39f71c6718df","email":"test2@gmail.com","name":"KABORE","role":"user","subscription":"premium"}');

// Rechargez la page
window.location.reload();
```

### Étape 3 : Tester la lecture vidéo

1. Après le rechargement, connectez-vous si nécessaire
2. Allez sur la page d'un film
3. Cliquez sur "Regarder"
4. La vidéo devrait maintenant se charger sans erreur

## 🔧 Modifications apportées

### 1. API secure-media améliorée

- Priorité donnée aux paramètres de requête pour le token
- Logs de débogage améliorés
- Meilleure gestion des erreurs

### 2. Composant SecureVideoPlayer amélioré

- Validation robuste des URLs vidéo
- Gestion d'erreur complète
- Messages d'erreur informatifs

### 3. Scripts de diagnostic créés

- `scripts/test-token-debug.js` : Vérifie la validité des tokens
- `scripts/force-reconnect.js` : Génère un nouveau token valide
- `scripts/test-api-directly.js` : Teste directement l'API

## 🎯 Résultat attendu

- ✅ Plus d'erreur 401 lors de la lecture vidéo
- ✅ Token valide et synchronisé
- ✅ Accès aux vidéos sécurisées fonctionnel
- ✅ Messages d'erreur clairs en cas de problème

## 📝 Notes importantes

- Le token JWT expire après 7 jours
- Les tokens sont stockés dans le localStorage du navigateur
- L'API secure-media vérifie l'abonnement premium pour les vidéos
- Les images restent accessibles sans authentification

## 🚀 Alternative : Reconnexion manuelle

Si le problème persiste, vous pouvez aussi :

1. Vous déconnecter de l'application
2. Vous reconnecter avec les identifiants :
   - Email : `test2@gmail.com`
   - Mot de passe : `test123`
3. Cela générera automatiquement un nouveau token valide
