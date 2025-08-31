# 🔧 Guide de Résolution des Problèmes - NovaFlix

## 🚨 Erreurs Courantes et Solutions

### 1. Erreur 500 (Internal Server Error)

#### Symptômes
- Page blanche ou erreur 500
- Console affiche des erreurs de build
- Erreurs de compilation TypeScript

#### Causes Possibles
- Conflits de noms de composants
- Imports manquants ou incorrects
- Erreurs de syntaxe

#### Solutions

##### A. Conflit de Noms de Composants
```typescript
// ❌ PROBLÈME: Import et définition locale avec le même nom
import { Progress } from '@/components/ui/progress';
const Progress = ({ value }) => <div>...</div>;

// ✅ SOLUTION: Renommer le composant local
import { Progress } from '@/components/ui/progress';
const ProgressBar = ({ value }) => <div>...</div>;
```

##### B. Vérifier les Imports
```typescript
// Vérifiez que tous les composants UI existent
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
```

##### C. Redémarrer le Serveur
```bash
# Arrêter le serveur (Ctrl+C)
# Puis redémarrer
npm run dev
```

### 2. Erreur 401 (Unauthorized) sur les Médias

#### Symptômes
- Impossible d'accéder aux vidéos
- Message "Accès refusé" ou "Token requis"
- Erreur 401 dans la console

#### Solutions

##### A. Vérifier la Connexion
1. Allez sur `/auth/login`
2. Connectez-vous avec vos identifiants
3. Vérifiez que le token est stocké dans le localStorage

##### B. Vérifier l'Abonnement
1. Allez sur `/subscription`
2. Vérifiez le statut de votre abonnement
3. Si pas d'abonnement, utilisez le système de paiement en mode test

##### C. Tester l'Accès
1. Allez sur `/test`
2. Cliquez sur "Lancer tous les tests"
3. Vérifiez les résultats

### 3. Problèmes de Build/Compilation

#### Symptômes
- Erreurs TypeScript
- Composants non trouvés
- Erreurs de webpack

#### Solutions

##### A. Nettoyer le Cache
```bash
# Supprimer les dossiers de build
rm -rf .next
rm -rf node_modules/.cache

# Réinstaller les dépendances
npm install

# Redémarrer
npm run dev
```

##### B. Vérifier les Dépendances
```bash
# Vérifier les versions
npm list

# Mettre à jour si nécessaire
npm update
```

##### C. Vérifier la Configuration TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 4. Problèmes de Navigation

#### Symptômes
- Routes non trouvées (404)
- Erreurs de redirection
- Pages qui ne se chargent pas

#### Solutions

##### A. Vérifier la Structure des Dossiers
```
app/
├── payment/
│   ├── page.tsx
│   └── simulate/
│       └── page.tsx
├── test/
│   └── page.tsx
├── test-nav/
│   └── page.tsx
└── subscription/
    └── page.tsx
```

##### B. Vérifier les Imports dans les Composants
```typescript
// ✅ Correct
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ❌ Incorrect
import { useRouter } from 'next/router'; // Next.js 12
```

### 5. Problèmes de Base de Données

#### Symptômes
- Erreurs 500 sur les APIs
- Données non sauvegardées
- Erreurs de connexion

#### Solutions

##### A. Vérifier la Connexion
```typescript
// lib/models.ts
export const db = {
  getUsers: () => collection(db, 'users'),
  getSubscriptions: () => collection(db, 'subscriptions'),
  // ...
};
```

##### B. Vérifier les Variables d'Environnement
```env
# .env.local
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
```

### 6. Problèmes de Paiement en Mode Test

#### Symptômes
- Simulation qui échoue
- Abonnement non activé
- Erreurs lors de la validation

#### Solutions

##### A. Vérifier le Mode Test
```typescript
// lib/test-config.ts
export const isTestMode = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         process.env.PAYMENT_TEST_MODE === 'true';
};
```

##### B. Vérifier les APIs
1. Testez `/api/payments/initiate`
2. Testez `/api/payments/verify`
3. Vérifiez les logs du serveur

### 7. Problèmes de Performance

#### Symptômes
- Pages lentes à charger
- Délais d'affichage
- Erreurs de timeout

#### Solutions

##### A. Optimiser les Images
```typescript
// Utiliser next/image pour l'optimisation
import Image from 'next/image';

<Image 
  src="/api/secure-media/images/poster1.jpg"
  alt="Poster"
  width={300}
  height={450}
  priority
/>
```

##### B. Lazy Loading des Composants
```typescript
// Charger les composants lourds à la demande
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Chargement...</div>
});
```

## 🧪 Tests de Diagnostic

### 1. Test Automatique
Ouvrez `test-simple.html` dans votre navigateur pour tester automatiquement :
- Statut de l'application
- Accessibilité des routes
- Fonctionnement des médias
- Système de paiement

### 2. Test Manuel des Routes
```bash
# Testez chaque route manuellement
curl http://localhost:3000/
curl http://localhost:3000/payment
curl http://localhost:3000/test
curl http://localhost:3000/test-nav
```

### 3. Test des APIs
```bash
# Test de l'API de paiement
curl -X POST http://localhost:3000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{"subscriptionType":"basic","testMode":true}'

# Test des médias sécurisés
curl http://localhost:3000/api/secure-media/images/poster1.jpg
curl http://localhost:3000/api/secure-media/videos/hist.mp4
```

## 📋 Checklist de Résolution

- [ ] Redémarrer le serveur de développement
- [ ] Vérifier la console du navigateur
- [ ] Vérifier les logs du serveur
- [ ] Tester les routes une par une
- [ ] Vérifier les imports et exports
- [ ] Nettoyer le cache (.next, node_modules/.cache)
- [ ] Vérifier la configuration TypeScript
- [ ] Tester avec le fichier de test HTML
- [ ] Vérifier la connexion à la base de données

## 🆘 En Cas de Problème Persistant

1. **Consultez les logs** : Vérifiez la console et les logs serveur
2. **Testez isolément** : Testez chaque composant séparément
3. **Vérifiez les versions** : Assurez-vous que Next.js et React sont à jour
4. **Recherchez les erreurs** : Utilisez la recherche d'erreurs dans votre éditeur
5. **Documentez le problème** : Notez les étapes pour reproduire l'erreur

## 📞 Support

- **Documentation** : Consultez `PAYMENT_TEST_GUIDE.md`
- **Résumé de solution** : Voir `SOLUTION_SUMMARY.md`
- **Configuration** : Vérifiez `lib/test-config.ts`

---

**Note** : La plupart des problèmes peuvent être résolus en redémarrant le serveur et en vérifiant la console pour les erreurs spécifiques.
