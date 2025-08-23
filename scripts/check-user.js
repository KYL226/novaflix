const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function checkUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const usersCollection = db.collection('users');
    
    // Vérifier l'utilisateur test@gmail.com
    const user = await usersCollection.findOne({ email: 'test@gmail.com' });
    
    if (user) {
      console.log('👤 Utilisateur trouvé:');
      console.log('   Email:', user.email);
      console.log('   Nom:', user.name);
      console.log('   Rôle:', user.role);
      console.log('   Subscription:', user.subscription);
      console.log('   ID:', user._id);
      console.log('   Créé le:', user.createdAt);
      console.log('   Mis à jour le:', user.updatedAt);
      
      // Vérifier la collection subscriptions
      const subscriptionsCollection = db.collection('subscriptions');
      const subscriptions = await subscriptionsCollection.find({}).toArray();
      
      console.log('\n📋 Collection subscriptions:');
      if (subscriptions.length === 0) {
        console.log('   Aucune subscription trouvée');
      } else {
        subscriptions.forEach((sub, index) => {
          console.log(`   ${index + 1}. UserID: ${sub.userId}, Type: ${sub.type}, Status: ${sub.status}`);
        });
      }
      
    } else {
      console.log('❌ Utilisateur test@gmail.com non trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
checkUser().catch(console.error);
