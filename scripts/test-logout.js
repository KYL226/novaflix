// scripts/test-logout.js
// Ce script simule ce qui se passe lors de la déconnexion

console.log('🔍 Test de déconnexion...');

// Vérifier l'état actuel du localStorage
console.log('📋 État actuel du localStorage:');
console.log('   Token:', localStorage.getItem('token') ? 'Présent' : 'Absent');
console.log('   User:', localStorage.getItem('user') ? 'Présent' : 'Absent');

if (localStorage.getItem('token')) {
  console.log('\n🔑 Token actuel trouvé');
  
  // Décoder le token pour voir son contenu
  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('📋 Payload du token:');
    console.log('   ID:', payload.id);
    console.log('   Email:', payload.email);
    console.log('   Role:', payload.role);
    console.log('   Subscription:', payload.subscription);
    console.log('   Expiration:', new Date(payload.exp * 1000).toLocaleString());
  } catch (error) {
    console.log('❌ Erreur lors du décodage du token:', error.message);
  }
  
  console.log('\n📋 Instructions pour forcer la déconnexion:');
  console.log('1. Ouvrez la console du navigateur');
  console.log('2. Exécutez: localStorage.clear()');
  console.log('3. Rechargez la page');
  console.log('4. Vous devriez être déconnecté');
  
} else {
  console.log('✅ Aucun token trouvé - utilisateur déjà déconnecté');
}

console.log('\n💡 Pour tester la reconnexion:');
console.log('1. Allez sur /auth');
console.log('2. Connectez-vous avec test@gmail.com');
console.log('3. Un nouveau token sera généré avec subscription: premium');
