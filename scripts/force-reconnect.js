require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';
const JWT_SECRET = process.env.JWT_SECRET;

async function forceReconnect() {
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
      return;
    }
    
    // Tester l'API avec le nouveau token
    const testUrl = `http://localhost:3000/api/secure-media/videos/test.mp4?token=${newToken}`;
    console.log('\n🔗 URL de test:', testUrl);
    
    console.log('\n💡 Instructions pour forcer la reconnexion :');
    console.log('1. Ouvrez votre navigateur et allez sur http://localhost:3000');
    console.log('2. Ouvrez les DevTools (F12)');
    console.log('3. Allez dans la console et exécutez :');
    console.log('');
    console.log('localStorage.setItem("token", "' + newToken + '");');
    console.log('localStorage.setItem("user", \'' + JSON.stringify({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription
    }) + '\');');
    console.log('window.location.reload();');
    console.log('');
    console.log('4. La page se rechargera avec le nouveau token');
    console.log('5. Testez maintenant la lecture vidéo');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

forceReconnect().catch(console.error);
