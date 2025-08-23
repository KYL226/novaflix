# 🎬 Novaflix - Plateforme de Streaming

Une application de streaming moderne inspirée de Netflix, construite avec Next.js 14, TypeScript, Tailwind CSS et MongoDB.

## ✨ Fonctionnalités

### 🎭 Contenu
- **Films, séries et documentaires** avec interface moderne
- **Recherche avancée** avec filtres multiples
- **Système de favoris** pour sauvegarder vos contenus préférés
- **Lecture vidéo sécurisée** avec authentification

### 👤 Utilisateurs
- **Authentification complète** (inscription, connexion, déconnexion)
- **Profils personnalisables** avec avatars
- **Gestion des abonnements** (Gratuit, Basique, Premium)
- **Système de rôles** (utilisateur, administrateur)

### 🎨 Interface
- **Design responsive** optimisé pour tous les appareils
- **Thème sombre** par défaut avec support du thème clair
- **Navigation intuitive** avec catégories et filtres
- **Animations fluides** et transitions élégantes

### 🔒 Sécurité
- **Authentification JWT** sécurisée
- **Accès aux médias protégé** par abonnement
- **Validation des données** côté serveur
- **Gestion des erreurs** robuste

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- MongoDB 6+
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd novaflix
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration de l'environnement
```bash
npm run setup
# ou
node scripts/setup-env.js
```

Cela créera un fichier `.env.local` avec les variables nécessaires.

### 4. Configurer MongoDB
- Assurez-vous que MongoDB est en cours d'exécution
- Modifiez `MONGODB_URI` dans `.env.local` si nécessaire
- La base de données `novaflix` sera créée automatiquement

### 5. Lancer l'application
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Structure du projet

```
novaflix/
├── app/                    # App Router Next.js 14
│   ├── api/               # API Routes
│   ├── admin/             # Pages d'administration
│   ├── auth/              # Authentification
│   ├── films/             # Pages des films
│   ├── series/            # Pages des séries
│   ├── watch/             # Lecteur vidéo
│   └── layout.tsx         # Layout principal
├── components/             # Composants React
│   ├── ui/                # Composants UI de base
│   ├── modals/            # Modales et dialogues
│   └── ...                # Composants métier
├── contexts/               # Contextes React
├── hooks/                  # Hooks personnalisés
├── lib/                    # Utilitaires et configurations
├── types/                  # Types TypeScript
└── secure-media/           # Médias sécurisés
```

## 🔧 Configuration

### Variables d'environnement

```env
# Base de données
MONGODB_URI=lien vers mongodb

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MEDIA_URL=/api/secure-media
```

### Base de données

L'application utilise MongoDB avec les collections suivantes :
- `users` - Utilisateurs et profils
- `movies` - Films, séries et documentaires
- `subscriptions` - Abonnements utilisateur
- `ratings` - Notes et évaluations (optionnel)

## 📱 Utilisation

### Première connexion
1. Créez un compte utilisateur
2. Choisissez un plan d'abonnement
3. Parcourez le catalogue de contenu
4. Ajoutez des films à vos favoris

### Navigation
- **Accueil** : Découvrez du contenu recommandé
- **Films/Séries** : Parcourez par catégorie
- **Recherche** : Trouvez du contenu spécifique
- **Profil** : Gérez vos informations et abonnement

### Administration
- **Dashboard** : Statistiques et vue d'ensemble
- **Gestion des utilisateurs** : Modération et support
- **Gestion du contenu** : Ajout et modification de films
- **Abonnements** : Suivi des souscriptions

## 🛠️ Développement

### Scripts disponibles
```bash
npm run dev          # Développement
npm run build        # Production
npm run start        # Démarrer en production
npm run lint         # Vérification du code
npm run setup        # Configuration initiale
```

### Ajout de contenu
1. Placez vos fichiers vidéo dans `secure-media/videos/`
2. Placez vos images dans `secure-media/images/`
3. Utilisez l'interface d'administration pour créer les entrées

### Personnalisation
- **Thèmes** : Modifiez `tailwind.config.ts`
- **Composants** : Personnalisez dans `components/ui/`
- **Styles** : Ajustez `app/globals.css`

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres plateformes
- **Netlify** : Compatible avec Next.js
- **Railway** : Déploiement simple
- **Docker** : Containerisation possible

## 🔒 Sécurité

- **HTTPS** obligatoire en production
- **Validation des entrées** côté serveur
- **Rate limiting** sur les APIs
- **Sanitisation des données** utilisateur
- **Gestion des sessions** sécurisée

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Issues** : Signalez les bugs sur GitHub
- **Discussions** : Questions et suggestions
- **Documentation** : Consultez la structure du code

## 🎯 Roadmap

- [ ] Système de commentaires et notes
- [ ] Téléchargements hors ligne
- [ ] Support multi-langues
- [ ] Intégration paiement (Stripe)
- [ ] Application mobile React Native
- [ ] Système de recommandations IA
- [ ] Support HDR et Dolby Atmos

---

**Novaflix** - Votre plateforme de streaming de nouvelle génération 🚀
