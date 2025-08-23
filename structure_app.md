novaflix/
│
├── app/                          # Pages et API Routes (App Router)
│   ├── layout.tsx                # Structure globale (Header, Footer)
│   ├── page.tsx                  # Page d'accueil (catalogue)
│   ├── not-found.tsx             # Page 404
│   │
│   ├── auth/                     # Pages d'authentification
│   │   └── page.tsx              # Login / Register
│   │
│   ├── films/                    # Liste des films
│   │   └── page.tsx
│   │
│   ├── series/                   # Liste des séries
│   │   └── page.tsx
│   │
│   ├── documentaires/            # Liste des documentaires
│   │   └── page.tsx
│   │
│   ├── watch/                    # Lecteur vidéo
│   │   └── [id]/page.tsx         # Sécurisé
│   │
│   ├── payment/                  # Paiements
│   │   └── callback/page.tsx     # Retour après paiement
│   │
│   ├── admin/                    # Interface admin
│   │   ├── dashboard/page.tsx    # Tableau de bord
│   │   ├── movies/
│   │   │   ├── add/page.tsx      # Ajouter un film
│   │   │   └── manage/page.tsx   # Gérer les films
│   │   ├── users/page.tsx        # Gérer les utilisateurs
│   │   └── subscriptions/
│   │       └── manage/page.tsx   # Gérer les abonnements
│   │
│   └── api/                      # API Routes (backend)
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── me/route.ts
│       │
│       ├── movies/
│       │   ├── route.ts          # GET /movies (liste)
│       │   └── [id]/route.ts     # GET /movies/[id]
│       │
│       ├── payments/
│       │   ├── initiate/route.ts
│       │   └── verify/route.ts
│       │
│       ├── secure-media/
│       │   └── [...path]/route.ts # Accès sécurisé aux vidéos/images
│       │
│       └── admin/                # Routes admin
│           ├── users/route.ts
│           ├── movies/route.ts
│           └── stats/route.ts
│
├── components/                   # Composants React
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── MovieCard.tsx
│   ├── MovieRow.tsx
│   ├── CategorySelector.tsx
│   ├── SearchResults.tsx
│   ├── SecureVideoPlayer.tsx
│   ├── SecureImage.tsx
│   ├── UserProfile.tsx
│   ├── AvatarSelector.tsx
│   ├── LoadingSpinner.tsx
│   ├── PageTransition.tsx
│   │
│   └── modals/                   # Modales
│       ├── MovieDetailsModal.tsx
│       ├── SubscriptionModal.tsx
│       ├── DownloadsModal.tsx
│       └── SettingsModal.tsx
│   │
│   └── ui/                       # Composants Shadcn/ui (générés automatiquement)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── form.tsx
│       ├── dialog.tsx
│       ├── sheet.tsx
│       ├── popover.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── navigation-menu.tsx
│       ├── menubar.tsx
│       ├── toast.tsx
│       ├── alert.tsx
│       ├── progress.tsx
│       └── toggle.tsx
│
├── contexts/                     # Contexte global
│   └── AuthContext.tsx           # Gestion de l'état d'authentification
│
├── hooks/                        # Hooks personnalisés
│   ├── useAuth.ts                # Hook pour accéder à l'auth
│   ├── useMovies.ts              # Pour charger les films
│   └── useProtectedRoute.ts      # Protéger les pages (ex: /watch)
│
├── lib/                          # Services backend
│   ├── api.ts                    # Client API (fetch vers les routes)
│   ├── auth.ts                   # Fonctions d'auth (login, register)
│   ├── mongodb.ts                # Connexion à MongoDB
│   ├── models.ts                 # Modèles de données (User, Movie, etc.)
│   ├── payment.ts                # Gestion des paiements (mobile money)
│   └── utils.ts                  # Fonctions utilitaires (formatDate, etc.)
│
├── types/                        # Types TypeScript
│   └── index.ts                  # Interfaces User, Movie, Subscription, etc.
│
├── public/                       # Fichiers statiques publics
│   ├── logo.svg
│   ├── favicon.ico
│   └── images/                   # Images libres d'accès (ex: background)
│       └── hero-bg.jpg
│
├── secure-media/                 # Fichiers protégés (accès contrôlé)
│   ├── images/                   # Posters, avatars, etc.
│   │   └── movie-poster-1.jpg
│   └── videos/                   # Vidéos sécurisées
│       └── film-1.mp4
│
├── scripts/                      # Scripts utilitaires
│   ├── setup-env.js              # Génère .env.local
│   └── fix-video-urls.js         # Corrige les chemins des vidéos
│
├── data/                         # Données statiques (optionnel)
│   └── genres.json               # Liste des genres (action, drame, etc.)
│
├── .env.local                    # Variables d'environnement
├── next.config.js                # Configuration Next.js
├── tailwind.config.ts            # Configuration Tailwind
├── tsconfig.json                 # Configuration TypeScript
├── package.json                  # Dépendances et scripts
├── components.json               # Configuration Shadcn/ui
└── README.md                     # Documentation du projet