const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function updateUserSubscription() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const usersCollection = db.collection('users');
    
    // Mettre à jour l'utilisateur test@gmail.com
    const result = await usersCollection.updateOne(
      { email: 'test@gmail.com' },
      { 
        $set: { 
          subscription: 'premium',
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Utilisateur mis à jour avec succès');
      
      // Récupérer l'utilisateur mis à jour
      const updatedUser = await usersCollection.findOne({ email: 'test@gmail.com' });
      console.log('Utilisateur mis à jour:', {
        email: updatedUser.email,
        role: updatedUser.role,
        subscription: updatedUser.subscription
      });
      
      console.log('\n📋 Instructions:');
      console.log('1. Déconnectez-vous de l\'application');
      console.log('2. Reconnectez-vous avec test@gmail.com');
      console.log('3. Un nouveau token sera généré avec subscription: premium');
      
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
updateUserSubscription().catch(console.error);
