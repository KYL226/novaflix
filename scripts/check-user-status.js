const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function checkUserStatus() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const usersCollection = db.collection('users');
    const subscriptionsCollection = db.collection('subscriptions');
    
    // Vérifier l'utilisateur test2@gmail.com
    const user = await usersCollection.findOne({ email: 'test2@gmail.com' });
    
    if (user) {
      console.log('\n👤 Utilisateur trouvé:');
      console.log('   Email:', user.email);
      console.log('   Nom:', user.name);
      console.log('   Rôle:', user.role);
      console.log('   Subscription:', user.subscription);
      console.log('   ID:', user._id);
      console.log('   Créé le:', user.createdAt);
      console.log('   Mis à jour le:', user.updatedAt);
      
      // Vérifier la collection subscriptions
      const subscription = await subscriptionsCollection.findOne({ 
        userId: user._id 
      });
      
      console.log('\n📋 Subscription dans la collection subscriptions:');
      if (subscription) {
        console.log('   ID:', subscription._id);
        console.log('   Type:', subscription.type);
        console.log('   Status:', subscription.status);
        console.log('   Début:', subscription.startDate);
        console.log('   Fin:', subscription.endDate);
        console.log('   Prix:', subscription.price);
      } else {
        console.log('   ❌ Aucune subscription trouvée pour cet utilisateur');
      }
      
      // Vérifier les variables d'environnement
      console.log('\n🔑 Variables d\'environnement:');
      console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Définie' : '❌ MANQUANTE');
      console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Définie' : '❌ MANQUANTE');
      
      if (!process.env.JWT_SECRET) {
        console.log('\n🚨 PROBLÈME IDENTIFIÉ: JWT_SECRET manquante !');
        console.log('   Ajoutez cette ligne dans votre fichier .env.local:');
        console.log('   JWT_SECRET=un_secret_complexe_et_long_pour_jwt_2025_novaflix');
        console.log('   Puis redémarrez le serveur (npm run dev)');
      }
      
    } else {
      console.log('❌ Utilisateur test2@gmail.com non trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
checkUserStatus().catch(console.error);
