require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';
const JWT_SECRET = process.env.JWT_SECRET;

async function getCurrentUserToken() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    
    // Trouver l'utilisateur test2@gmail.com
    const user = await db.collection('users').findOne({ 
      email: 'test2@gmail.com'
    });
    
    if (!user) {
      console.log('❌ Utilisateur test2@gmail.com non trouvé');
      return;
    }
    
    console.log('\n👤 Utilisateur trouvé:', {
      id: user._id.toString(),
      email: user.email,
      subscription: user.subscription,
      role: user.role
    });
    
    // Générer un nouveau token
    const newToken = jwt.sign(
      { 
        id: user._id.toString(), 
        email: user.email, 
        role: user.role,
        subscription: user.subscription || 'free'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('\n🔑 Nouveau token généré:', newToken);
    console.log('🔍 Token (premiers caractères):', newToken.substring(0, 50) + '...');
    
    // Vérifier le token
    try {
      const decoded = jwt.verify(newToken, JWT_SECRET);
      console.log('\n✅ Token vérifié:', {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        subscription: decoded.subscription,
        iat: new Date(decoded.iat * 1000).toISOString(),
        exp: new Date(decoded.exp * 1000).toISOString(),
        isExpired: Date.now() > decoded.exp * 1000
      });
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
    }
    
    // Tester l'API avec le nouveau token
    const testUrl = `http://localhost:3000/api/secure-media/videos/test.mp4?token=${newToken}`;
    console.log('\n🔗 URL de test:', testUrl);
    
    console.log('\n💡 Instructions :');
    console.log('1. Copiez le token ci-dessus');
    console.log('2. Ouvrez les DevTools de votre navigateur');
    console.log('3. Allez dans Application > Local Storage > http://localhost:3000');
    console.log('4. Remplacez la valeur de "token" par le nouveau token');
    console.log('5. Rechargez la page et testez la lecture vidéo');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

getCurrentUserToken().catch(console.error);
