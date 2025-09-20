// scripts/test-admin-auth.js
// Script pour tester l'authentification admin

console.log('🔐 Test de l\'authentification admin');
console.log('==================================');

// Test 1: Vérifier que les hooks existent
console.log('\n1. Vérification des hooks...');
const fs = require('fs');
const path = require('path');

const hookFiles = [
  'hooks/useProtectedRoute.ts',
  'contexts/AuthContext.tsx',
  'lib/withAdminAuth.ts',
  'lib/auth.ts'
];

hookFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Test 2: Vérifier les pages admin
console.log('\n2. Vérification des pages admin...');
const adminPages = [
  'app/admin/movies/add/page.tsx',
  'app/admin/movies/manage/page.tsx',
  'app/admin/dashboard/page.tsx'
];

adminPages.forEach(page => {
  const fullPath = path.join(process.cwd(), page);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${page} existe`);
  } else {
    console.log(`❌ ${page} manquant`);
  }
});

// Test 3: Vérifier les APIs admin
console.log('\n3. Vérification des APIs admin...');
const adminAPIs = [
  'app/api/admin/upload/route.ts',
  'app/api/admin/movies/route.ts'
];

adminAPIs.forEach(api => {
  const fullPath = path.join(process.cwd(), api);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${api} existe`);
  } else {
    console.log(`❌ ${api} manquant`);
  }
});

// Test 4: Vérifier la structure des dossiers
console.log('\n4. Vérification de la structure des dossiers...');
console.log('novaflix/');
console.log('├── hooks/');
console.log('│   └── useProtectedRoute.ts     (hook de protection)');
console.log('├── contexts/');
console.log('│   └── AuthContext.tsx          (contexte d\'authentification)');
console.log('├── lib/');
console.log('│   ├── withAdminAuth.ts         (middleware admin)');
console.log('│   └── auth.ts                  (utilitaires d\'auth)');
console.log('├── app/');
console.log('│   ├── api/admin/');
console.log('│   │   ├── upload/              (API d\'upload)');
console.log('│   │   └── movies/              (API de gestion des films)');
console.log('│   └── admin/');
console.log('│       ├── dashboard/           (tableau de bord admin)');
console.log('│       └── movies/');
console.log('│           ├── add/             (ajouter un film)');
console.log('│           └── manage/          (gérer les films)');

console.log('\n🎯 Résumé des tests:');
console.log('- Hooks: useProtectedRoute et AuthContext');
console.log('- Pages admin: add, manage, dashboard');
console.log('- APIs admin: upload et movies');
console.log('- Middleware: withAdminAuth');
console.log('- Utilitaires: auth.ts');

console.log('\n📋 Instructions pour tester manuellement:');
console.log('1. Se connecter en tant qu\'admin');
console.log('2. Aller sur /admin/movies/manage');
console.log('3. Vérifier que la page se charge sans erreur "Non autorisé"');
console.log('4. Tester l\'ajout d\'un film sur /admin/movies/add');
console.log('5. Vérifier que les films apparaissent dans la liste');

console.log('\n🔍 Debug en cas de problème:');
console.log('- Vérifier le token dans localStorage');
console.log('- Vérifier le rôle de l\'utilisateur');
console.log('- Vérifier les logs de l\'API admin/movies');
console.log('- Vérifier les logs de withAdminAuth');

console.log('\n✅ Test de l\'authentification admin terminé!');
