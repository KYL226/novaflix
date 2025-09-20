// scripts/setup-upload-directories.js
// Script pour créer les dossiers d'upload et tester le système

const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration des dossiers d\'upload...');

// Créer les dossiers nécessaires
const directories = [
  'secure-media',
  'secure-media/videos',
  'secure-media/images'
];

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Dossier créé: ${dir}`);
  } else {
    console.log(`ℹ️ Dossier existe déjà: ${dir}`);
  }
});

// Vérifier les permissions
directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  try {
    fs.accessSync(fullPath, fs.constants.W_OK);
    console.log(`✅ Permissions d'écriture OK: ${dir}`);
  } catch (error) {
    console.log(`❌ Pas de permissions d'écriture: ${dir}`);
  }
});

// Créer un fichier de test pour vérifier
const testFile = path.join(process.cwd(), 'secure-media', 'test.txt');
try {
  fs.writeFileSync(testFile, 'Test de création de fichier');
  fs.unlinkSync(testFile);
  console.log('✅ Test de création/suppression de fichier réussi');
} catch (error) {
  console.log('❌ Erreur lors du test de création de fichier:', error.message);
}

console.log('\n📁 Structure des dossiers:');
console.log('novaflix/');
console.log('├── secure-media/');
console.log('│   ├── videos/     (pour les fichiers vidéo)');
console.log('│   └── images/     (pour les images poster)');
console.log('└── ...');

console.log('\n🎯 Prochaines étapes:');
console.log('1. Tester l\'upload de fichiers sur /admin/movies/add');
console.log('2. Vérifier que les fichiers apparaissent dans secure-media/');
console.log('3. Tester la lecture des fichiers via l\'API secure-media');

console.log('\n✅ Configuration terminée!');
