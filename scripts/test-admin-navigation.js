// scripts/test-admin-navigation.js
// Script pour tester la navigation admin

console.log('🧭 Test de la navigation admin');
console.log('==============================');

// Test 1: Vérifier que les fichiers existent
console.log('\n1. Vérification des fichiers...');
const fs = require('fs');
const path = require('path');

const files = [
  'app/admin/dashboard/page.tsx',
  'app/admin/movies/manage/page.tsx',
  'app/admin/movies/add/page.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
  }
});

// Test 2: Vérifier les liens de navigation
console.log('\n2. Vérification des liens de navigation...');
const dashboardPage = path.join(process.cwd(), 'app/admin/dashboard/page.tsx');
if (fs.existsSync(dashboardPage)) {
  const content = fs.readFileSync(dashboardPage, 'utf8');
  
  if (content.includes('/admin/movies/manage')) {
    console.log('✅ Lien vers "Gérer les Films" présent dans le dashboard');
  } else {
    console.log('❌ Lien vers "Gérer les Films" manquant dans le dashboard');
  }
  
  if (content.includes('/admin/movies/add')) {
    console.log('✅ Lien vers "Ajouter un Film" présent dans le dashboard');
  } else {
    console.log('❌ Lien vers "Ajouter un Film" manquant dans le dashboard');
  }
  
  if (content.includes('Actions Rapides')) {
    console.log('✅ Section "Actions Rapides" présente');
  } else {
    console.log('❌ Section "Actions Rapides" manquante');
  }
}

const managePage = path.join(process.cwd(), 'app/admin/movies/manage/page.tsx');
if (fs.existsSync(managePage)) {
  const content = fs.readFileSync(managePage, 'utf8');
  
  if (content.includes('/admin/dashboard')) {
    console.log('✅ Lien vers "Dashboard" présent dans la page de gestion');
  } else {
    console.log('❌ Lien vers "Dashboard" manquant dans la page de gestion');
  }
  
  if (content.includes('/admin/movies/add')) {
    console.log('✅ Lien vers "Ajouter un Film" présent dans la page de gestion');
  } else {
    console.log('❌ Lien vers "Ajouter un Film" manquant dans la page de gestion');
  }
}

// Test 3: Vérifier les icônes
console.log('\n3. Vérification des icônes...');
const iconFiles = [
  'app/admin/dashboard/page.tsx',
  'app/admin/movies/manage/page.tsx'
];

iconFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes('Settings')) {
      console.log(`✅ Icône Settings présente dans ${file}`);
    } else {
      console.log(`❌ Icône Settings manquante dans ${file}`);
    }
    
    if (content.includes('Home')) {
      console.log(`✅ Icône Home présente dans ${file}`);
    } else {
      console.log(`❌ Icône Home manquante dans ${file}`);
    }
    
    if (content.includes('Plus')) {
      console.log(`✅ Icône Plus présente dans ${file}`);
    } else {
      console.log(`❌ Icône Plus manquante dans ${file}`);
    }
  }
});

// Test 4: Vérifier la structure des dossiers
console.log('\n4. Vérification de la structure...');
const directories = [
  'app/admin',
  'app/admin/dashboard',
  'app/admin/movies',
  'app/admin/movies/add',
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

console.log('\n🎯 Résumé des tests:');
console.log('- Fichiers: Vérifiés');
console.log('- Liens de navigation: Vérifiés');
console.log('- Icônes: Vérifiées');
console.log('- Structure: Vérifiée');

console.log('\n📋 Instructions pour tester manuellement:');
console.log('1. Se connecter en tant qu\'admin');
console.log('2. Aller sur /admin/dashboard');
console.log('3. Vérifier la section "Actions Rapides"');
console.log('4. Cliquer sur "Gérer les Films"');
console.log('5. Vérifier les boutons "Dashboard" et "Ajouter un Film"');
console.log('6. Tester la navigation entre les pages');

console.log('\n🔍 Points à vérifier:');
console.log('- Bouton "Gérer les Films" dans le dashboard');
console.log('- Bouton "Dashboard" dans la page de gestion');
console.log('- Bouton "Ajouter un Film" dans les deux pages');
console.log('- Navigation fluide entre les pages');
console.log('- Icônes présentes et cohérentes');

console.log('\n✅ Test de la navigation admin terminé!');