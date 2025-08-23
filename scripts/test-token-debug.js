const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Token de test (remplacez par votre token actuel)
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTk2MjE3NDlhYzM5ZjcxYzY3MThkZiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJzdWJzY3JpcHRpb24iOiJwcmVtaXVtIiwiaWF0IjoxNzU1OTM0ODQ5LCJleHAiOjE3NTY1Mzk2NDl9.b7s_kww-EBoy1wRsk7UTOIHzqDiNPXsvaJyzq1lsYQU';

function testTokenStepByStep() {
  console.log('🔍 Test du token étape par étape...\n');
  
  // Étape 1: Vérifier JWT_SECRET
  console.log('1️⃣ Vérification de JWT_SECRET:');
  console.log('   JWT_SECRET:', JWT_SECRET ? '✅ Définie' : '❌ MANQUANTE');
  console.log('   Longueur:', JWT_SECRET ? JWT_SECRET.length : 0);
  console.log('');
  
  // Étape 2: Décoder le token sans vérification
  console.log('2️⃣ Décodage du token (sans vérification):');
  try {
    const decodedWithoutVerification = jwt.decode(testToken);
    console.log('   ✅ Token décodé avec succès');
    console.log('   Payload:', JSON.stringify(decodedWithoutVerification, null, 2));
    console.log('');
  } catch (error) {
    console.log('   ❌ Erreur lors du décodage:', error.message);
    console.log('');
  }
  
  // Étape 3: Vérifier le token avec JWT_SECRET
  console.log('3️⃣ Vérification du token avec JWT_SECRET:');
  try {
    const decoded = jwt.verify(testToken, JWT_SECRET);
    console.log('   ✅ Token vérifié avec succès');
    console.log('   Payload:', JSON.stringify(decoded, null, 2));
    console.log('');
    
    // Étape 4: Vérifier les champs critiques
    console.log('4️⃣ Vérification des champs critiques:');
    console.log('   id:', decoded.id ? '✅ Présent' : '❌ MANQUANT');
    console.log('   email:', decoded.email ? '✅ Présent' : '❌ MANQUANT');
    console.log('   role:', decoded.role ? '✅ Présent' : '❌ MANQUANT');
    console.log('   subscription:', decoded.subscription ? '✅ Présent' : '❌ MANQUANT');
    console.log('   subscription value:', decoded.subscription);
    console.log('');
    
    // Étape 5: Test de la logique de l'API
    console.log('5️⃣ Test de la logique de l\'API secure-media:');
    if (!decoded.subscription || decoded.subscription === 'free') {
      console.log('   ❌ Accès refusé: Abonnement requis (subscription: free)');
      console.log('   Raison: subscription est', decoded.subscription);
    } else {
      console.log('   ✅ Accès autorisé: Abonnement premium détecté');
      console.log('   Type d\'abonnement:', decoded.subscription);
    }
    
  } catch (err) {
    console.log('   ❌ Token invalide:', err.message);
    console.log('');
    
    // Étape 6: Diagnostic de l'erreur
    console.log('6️⃣ Diagnostic de l\'erreur:');
    if (err.name === 'JsonWebTokenError') {
      console.log('   Type d\'erreur: JWT malformé ou signature invalide');
    } else if (err.name === 'TokenExpiredError') {
      console.log('   Type d\'erreur: Token expiré');
    } else if (err.name === 'NotBeforeError') {
      console.log('   Type d\'erreur: Token pas encore valide');
    } else {
      console.log('   Type d\'erreur:', err.name);
    }
  }
}

// Exécuter le test
testTokenStepByStep();
