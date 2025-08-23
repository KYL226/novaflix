const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Simuler la vérification du token comme dans l'API
function testToken(token) {
  try {
    console.log('🔍 Test du token...');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token valide');
    console.log('📋 Payload:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      subscription: decoded.subscription
    });
    
    // Vérifier l'abonnement comme dans l'API
    if (!decoded.subscription || decoded.subscription === 'free') {
      console.log('❌ Accès refusé: Abonnement requis (subscription: free)');
      return false;
    } else {
      console.log('✅ Accès autorisé: Abonnement premium détecté');
      return true;
    }
    
  } catch (err) {
    console.log('❌ Token invalide:', err.message);
    return false;
  }
}

// Demander le token à tester
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Entrez le token JWT à tester: ', (token) => {
  testToken(token.trim());
  rl.close();
});
