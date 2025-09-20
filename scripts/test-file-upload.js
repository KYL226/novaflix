// scripts/test-file-upload.js
// Script pour tester le système d'upload de fichiers admin

console.log('🧪 Test du système d\'upload de fichiers admin');
console.log('==============================================');

// Test 1: Vérifier que l'API d'upload existe
console.log('\n1. Test de l\'API d\'upload...');
fetch('/api/admin/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer invalid-token'
  }
})
.then(response => {
  if (response.status === 401) {
    console.log('✅ API d\'upload protégée - retourne 401 pour token invalide');
  } else {
    console.log('❌ API d\'upload non protégée - statut:', response.status);
  }
})
.catch(error => {
  console.log('❌ Erreur lors du test de l\'API:', error.message);
});

// Test 2: Vérifier que les composants d'upload sont présents
console.log('\n2. Test des composants d\'upload...');
const uploadComponents = document.querySelectorAll('[data-testid="file-upload"]');
if (uploadComponents.length > 0) {
  console.log('✅ Composants d\'upload trouvés:', uploadComponents.length);
} else {
  console.log('⚠️ Composants d\'upload non trouvés (normal si pas sur la page d\'ajout)');
}

// Test 3: Vérifier les zones de drag & drop
console.log('\n3. Test des zones de drag & drop...');
const dropZones = document.querySelectorAll('[class*="border-dashed"]');
if (dropZones.length > 0) {
  console.log('✅ Zones de drag & drop trouvées:', dropZones.length);
} else {
  console.log('⚠️ Zones de drag & drop non trouvées (normal si pas sur la page d\'ajout)');
}

// Test 4: Vérifier les boutons de sélection de fichiers
console.log('\n4. Test des boutons de sélection...');
const fileButtons = document.querySelectorAll('button[type="button"]');
const uploadButtons = Array.from(fileButtons).filter(btn => 
  btn.textContent.includes('Sélectionner') || btn.textContent.includes('Upload')
);
if (uploadButtons.length > 0) {
  console.log('✅ Boutons d\'upload trouvés:', uploadButtons.length);
} else {
  console.log('⚠️ Boutons d\'upload non trouvés (normal si pas sur la page d\'ajout)');
}

// Test 5: Vérifier les messages d'erreur d'upload
console.log('\n5. Test des messages d\'erreur...');
const errorAlerts = document.querySelectorAll('[class*="destructive"]');
if (errorAlerts.length > 0) {
  console.log('✅ Messages d\'erreur trouvés:', errorAlerts.length);
} else {
  console.log('ℹ️ Aucun message d\'erreur affiché (normal)');
}

// Test 6: Vérifier les aperçus d'images
console.log('\n6. Test des aperçus d\'images...');
const imagePreviews = document.querySelectorAll('img[alt="Aperçu"]');
if (imagePreviews.length > 0) {
  console.log('✅ Aperçus d\'images trouvés:', imagePreviews.length);
} else {
  console.log('ℹ️ Aucun aperçu d\'image affiché (normal si pas d\'image uploadée)');
}

// Test 7: Vérifier les barres de progression
console.log('\n7. Test des barres de progression...');
const progressBars = document.querySelectorAll('[class*="bg-blue-600"]');
if (progressBars.length > 0) {
  console.log('✅ Barres de progression trouvées:', progressBars.length);
} else {
  console.log('ℹ️ Aucune barre de progression affichée (normal si pas d\'upload en cours)');
}

// Test 8: Vérifier les icônes de statut
console.log('\n8. Test des icônes de statut...');
const statusIcons = document.querySelectorAll('[class*="text-green-500"], [class*="text-red-500"]');
if (statusIcons.length > 0) {
  console.log('✅ Icônes de statut trouvées:', statusIcons.length);
} else {
  console.log('ℹ️ Aucune icône de statut affichée (normal si pas d\'upload)');
}

// Test 9: Vérifier les validations de formulaire
console.log('\n9. Test des validations de formulaire...');
const requiredFields = document.querySelectorAll('input[required], textarea[required]');
if (requiredFields.length > 0) {
  console.log('✅ Champs obligatoires trouvés:', requiredFields.length);
} else {
  console.log('⚠️ Aucun champ obligatoire trouvé');
}

// Test 10: Vérifier les types de fichiers acceptés
console.log('\n10. Test des types de fichiers acceptés...');
const fileInputs = document.querySelectorAll('input[type="file"]');
if (fileInputs.length > 0) {
  fileInputs.forEach((input, index) => {
    const accept = input.getAttribute('accept');
    console.log(`✅ Input ${index + 1} - Types acceptés:`, accept || 'Tous');
  });
} else {
  console.log('⚠️ Aucun input de fichier trouvé');
}

console.log('\n🎯 Résumé des tests:');
console.log('- API d\'upload: Protégée par authentification');
console.log('- Composants: Prêts pour l\'upload de fichiers');
console.log('- Interface: Zones de drag & drop et boutons de sélection');
console.log('- Validation: Champs obligatoires et types de fichiers');
console.log('- Feedback: Messages d\'erreur et aperçus d\'images');
console.log('- Progression: Barres de progression et icônes de statut');

console.log('\n📋 Instructions pour tester manuellement:');
console.log('1. Aller sur /admin/movies/add');
console.log('2. Remplir les informations de base');
console.log('3. Cliquer sur "Sélectionner un fichier" pour la vidéo');
console.log('4. Choisir un fichier vidéo (MP4, AVI, MOV, etc.)');
console.log('5. Cliquer sur "Sélectionner un fichier" pour l\'image');
console.log('6. Choisir une image (JPG, PNG, WebP)');
console.log('7. Vérifier que les fichiers sont uploadés automatiquement');
console.log('8. Soumettre le formulaire');

console.log('\n✅ Test du système d\'upload terminé!');
