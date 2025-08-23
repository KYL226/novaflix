# Scripts de Gestion de la Base de Données Novaflix

Ce dossier contient des scripts pour gérer et maintenir votre base de données MongoDB.

## 📋 Scripts Disponibles

### 1. `init-db.js` - Initialisation de la Base de Données
**Objectif :** Créer la structure initiale de la base de données avec des données d'exemple.

**Utilisation :**
```bash
node scripts/init-db.js
```

**Ce que fait le script :**
- ✅ Crée les collections `users`, `movies`, `subscriptions`
- ✅ Configure la validation des schémas
- ✅ Crée les index nécessaires
- ✅ Crée un utilisateur admin par défaut : `admin@novaflix.com` / `admin123`
- ✅ Ajoute des films d'exemple

**Quand l'utiliser :**
- Première installation
- Réinitialisation complète de la base
- Ajout de nouvelles collections

---

### 2. `check-db-structure.js` - Vérification de la Structure
**Objectif :** Vérifier et corriger la structure existante de la base de données.

**Utilisation :**
```bash
node scripts/check-db-structure.js
```

**Ce que fait le script :**
- 🔍 Vérifie que tous les utilisateurs ont un rôle défini
- 🔍 Ajoute automatiquement le rôle `user` aux utilisateurs sans rôle
- 🔍 Vérifie la présence d'utilisateurs admin
- 🔍 Propose de créer un admin si aucun n'existe
- 🔍 Vérifie les index et la structure des documents

**Quand l'utiliser :**
- Après une migration de données
- Quand des utilisateurs n'ont pas de rôle
- Vérification générale de l'intégrité

---

### 3. `make-admin.js` - Promotion d'Utilisateur en Admin
**Objectif :** Transformer un utilisateur existant en administrateur.

**Utilisation :**
```bash
node scripts/make-admin.js
```

**Ce que fait le script :**
- 👥 Liste tous les utilisateurs disponibles
- 🔐 Permet de choisir qui promouvoir admin
- ✅ Met à jour le rôle de l'utilisateur sélectionné
- 🔒 Demande confirmation avant modification

**Quand l'utiliser :**
- Créer un nouvel administrateur
- Donner des droits admin à un utilisateur existant
- Gestion des permissions

---

### 4. `test-auth.js` - Test de l'Authentification
**Objectif :** Vérifier que le système d'authentification fonctionne correctement.

**Utilisation :**
```bash
node scripts/test-auth.js
```

**Ce que fait le script :**
- 🧪 Teste la structure des utilisateurs
- 🧪 Vérifie la présence d'administrateurs
- 🧪 Détecte les problèmes de rôles
- 🧪 Vérifie les index et champs requis
- 💡 Donne des recommandations

**Quand l'utiliser :**
- Diagnostic des problèmes d'auth
- Vérification après modifications
- Test de l'intégrité de la base

---

## 🚀 Démarrage Rapide

### Étape 1 : Vérifier la Structure
```bash
node scripts/test-auth.js
```

### Étape 2 : Corriger les Problèmes (si nécessaire)
```bash
node scripts/check-db-structure.js
```

### Étape 3 : Créer un Admin (si nécessaire)
```bash
node scripts/make-admin.js
```

### Étape 4 : Réinitialiser (si tout échoue)
```bash
node scripts/init-db.js
```

---

## 🔧 Configuration Requise

### Variables d'Environnement
Assurez-vous d'avoir un fichier `.env.local` avec :
```env
MONGODB_URI=mongodb://localhost:27017/novaflix
# ou votre URI MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novaflix
```

### Dépendances
```bash
npm install mongodb bcryptjs dotenv
```

---

## 🐛 Résolution des Problèmes

### Problème : "Aucun administrateur trouvé"
**Solution :**
```bash
node scripts/make-admin.js
```

### Problème : "Utilisateurs sans rôle"
**Solution :**
```bash
node scripts/check-db-structure.js
```

### Problème : "Connexion MongoDB échouée"
**Vérifiez :**
- Votre URI MongoDB dans `.env.local`
- Que MongoDB est en cours d'exécution
- Vos permissions de connexion

---

## 📊 Structure de la Base de Données

### Collection `users`
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashé)",
  "name": "string",
  "role": "user" | "admin",
  "subscription": "free" | "basic" | "premium",
  "avatar": "string (optionnel)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection `movies`
```json
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "genre": ["string"],
  "duration": "number (minutes)",
  "releaseYear": "number",
  "videoUrl": "string",
  "posterUrl": "string",
  "type": "film" | "serie" | "documentaire",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 🎯 Bonnes Pratiques

1. **Toujours tester** avec `test-auth.js` après des modifications
2. **Sauvegarder** avant d'exécuter des scripts de modification
3. **Vérifier** les logs pour s'assurer du succès des opérations
4. **Utiliser** `check-db-structure.js` régulièrement pour maintenir l'intégrité

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs d'erreur
2. Exécutez `test-auth.js` pour diagnostiquer
3. Consultez la documentation MongoDB
4. Vérifiez vos variables d'environnement
