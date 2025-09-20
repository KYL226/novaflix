// scripts/test-admin-debug.js
// Script pour déboguer l'authentification admin

console.log('🔍 Debug de l\'authentification admin');
console.log('===================================');

// Test 1: Vérifier que les fichiers existent
console.log('\n1. Vérification des fichiers...');
const fs = require('fs');
const path = require('path');

const files = [
  'hooks/useProtectedRoute.ts',
  'contexts/AuthContext.tsx',
  'lib/withAdminAuth.ts',
  'lib/auth.ts',
  'app/admin/movies/manage/page.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Test 2: Vérifier la structure des dossiers
console.log('\n2. Vérification de la structure...');
const directories = [
  'hooks',
  'contexts',
  'lib',
  'app/admin/movies/manage'
];

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${dir} existe`);
  } else {
    console.log(`❌ ${dir} manquant`);
  }
});

// Test 3: Vérifier les imports
console.log('\n3. Vérification des imports...');
const managePage = path.join(process.cwd(), 'app/admin/movies/manage/page.tsx');
if (fs.existsSync(managePage)) {
  const content = fs.readFileSync(managePage, 'utf8');
  
  if (content.includes('useProtectedRoute')) {
    console.log('✅ useProtectedRoute importé');
  } else {
    console.log('❌ useProtectedRoute non importé');
  }
  
  if (content.includes('requireAdmin')) {
    console.log('✅ requireAdmin utilisé');
  } else {
    console.log('❌ requireAdmin non utilisé');
  }
  
  if (content.includes('isLoading')) {
    console.log('✅ isLoading géré');
  } else {
    console.log('❌ isLoading non géré');
  }
}

// Test 4: Vérifier les logs de debug
console.log('\n4. Vérification des logs de debug...');
const hookFile = path.join(process.cwd(), 'hooks/useProtectedRoute.ts');
if (fs.existsSync(hookFile)) {
  const content = fs.readFileSync(hookFile, 'utf8');
  
  if (content.includes('console.log')) {
    console.log('✅ Logs de debug présents dans useProtectedRoute');
  } else {
    console.log('❌ Logs de debug manquants dans useProtectedRoute');
  }
}

const contextFile = path.join(process.cwd(), 'contexts/AuthContext.tsx');
if (fs.existsSync(contextFile)) {
  const content = fs.readFileSync(contextFile, 'utf8');
  
  if (content.includes('console.log')) {
    console.log('✅ Logs de debug présents dans AuthContext');
  } else {
    console.log('❌ Logs de debug manquants dans AuthContext');
  }
}

console.log('\n🎯 Résumé du debug:');
console.log('- Fichiers: Vérifiés');
console.log('- Structure: Vérifiée');
console.log('- Imports: Vérifiés');
console.log('- Logs: Ajoutés pour le debug');

console.log('\n📋 Instructions pour déboguer:');
console.log('1. Ouvrir la console du navigateur');
console.log('2. Aller sur /admin/movies/manage');
console.log('3. Vérifier les logs dans la console:');
console.log('   - AuthContext - performAuthCheck');
console.log('   - useProtectedRoute - Vérification');
console.log('   - withAdminAuth - Token décodé');
console.log('4. Vérifier le token dans localStorage');
console.log('5. Vérifier le rôle de l\'utilisateur');

console.log('\n🔍 Points à vérifier:');
console.log('- Token présent dans localStorage');
console.log('- Utilisateur présent dans localStorage');
console.log('- Rôle de l\'utilisateur = "admin"');
console.log('- Token valide et non expiré');
console.log('- Redirection correcte en cas d\'erreur');

console.log('\n✅ Debug de l\'authentification admin terminé!');
