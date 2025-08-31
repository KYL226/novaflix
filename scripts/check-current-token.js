require('dotenv').config({ path: '.env.local' });
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Token extrait des logs du terminal (remplacez par le token actuel)
const currentToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTk2MjE3NDlhYzM5ZjcxYzY3MThkZiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJzdWJzY3JpcHRpb24iOiJwcmVtaXVtIiwiaWF0IjoxNzU2NjMwOTQ5LCJleHAiOjE3NTcyMzU3NDl9.6FqyTTI72Ld8cyHBM0Rr9cEDel5hvSo8mXKQ4Or6XDg';

function checkCurrentToken() {
  console.log('🔍 Vérification du token actuel...\n');
  
  console.log('1️⃣ Token actuel:', currentToken.substring(0, 50) + '...');
  console.log('🔑 JWT_SECRET:', JWT_SECRET ? 'Défini' : 'Non défini');
  console.log('');
  
  // Décoder le token sans vérification
  try {
    const decoded = jwt.decode(currentToken);
    console.log('2️⃣ Token décodé (sans vérification):', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      subscription: decoded.subscription,
      iat: new Date(decoded.iat * 1000).toISOString(),
      exp: new Date(decoded.exp * 1000).toISOString(),
      isExpired: Date.now() > decoded.exp * 1000
    });
    console.log('');
  } catch (error) {
    console.log('❌ Erreur lors du décodage:', error.message);
    console.log('');
  }
  
  // Vérifier le token
  try {
    const verified = jwt.verify(currentToken, JWT_SECRET);
    console.log('3️⃣ Token vérifié avec succès:', {
      id: verified.id,
      email: verified.email,
      role: verified.role,
      subscription: verified.subscription,
      iat: new Date(verified.iat * 1000).toISOString(),
      exp: new Date(verified.exp * 1000).toISOString(),
      isExpired: Date.now() > verified.exp * 1000
    });
    console.log('');
    
    // Vérifier l'abonnement
    if (!verified.subscription || verified.subscription === 'free') {
      console.log('❌ Problème: Abonnement requis mais utilisateur a:', verified.subscription);
    } else {
      console.log('✅ Abonnement valide:', verified.subscription);
    }
    
  } catch (error) {
    console.log('❌ Erreur lors de la vérification:', error.message);
    console.log('Type d\'erreur:', error.name);
    console.log('');
  }
  
  // Tester l'URL
  const testUrl = `http://localhost:3000/api/secure-media/videos/test.mp4?token=${currentToken}`;
  console.log('4️⃣ URL de test:', testUrl);
  console.log('');
  
  console.log('💡 Instructions de test :');
  console.log('1. Assurez-vous que le serveur est démarré (npm run dev)');
  console.log('2. Ouvrez un navigateur en mode privé');
  console.log('3. Collez l\'URL de test dans la barre d\'adresse');
  console.log('4. Vérifiez la réponse du serveur');
}

checkCurrentToken();
