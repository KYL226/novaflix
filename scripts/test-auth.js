// scripts/test-auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('🔍 Test de l\'authentification JWT...');
console.log('🔑 JWT_SECRET présent:', !!process.env.JWT_SECRET);
console.log('🔑 JWT_SECRET longueur:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET manquant dans les variables d\'environnement');
  process.exit(1);
}

// Créer un token de test
const testUser = {
  id: 'test123',
  email: 'test@example.com',
  role: 'user',
  subscription: 'premium'
};

try {
  console.log('🧪 Création d\'un token de test...');
  const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('✅ Token créé:', token.substring(0, 20) + '...');
  
  console.log('🧪 Vérification du token...');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token vérifié:', decoded);
  
  console.log('🧪 Test d\'expiration...');
  const expiredToken = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '0s' });
  try {
    jwt.verify(expiredToken, process.env.JWT_SECRET);
    console.log('❌ Le token expiré devrait avoir échoué');
  } catch (error) {
    console.log('✅ Token expiré correctement rejeté:', error.message);
    }
    
  } catch (error) {
  console.error('❌ Erreur lors du test JWT:', error);
  process.exit(1);
}

console.log('🎉 Tous les tests JWT ont réussi !');
