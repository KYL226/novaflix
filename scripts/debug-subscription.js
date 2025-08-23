const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function debugSubscription() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const subscriptionsCollection = db.collection('subscriptions');
    const usersCollection = db.collection('users');
    
    // Vérifier l'utilisateur
    const user = await usersCollection.findOne({ email: 'test2@gmail.com' });
    console.log('\n👤 Utilisateur:');
    console.log('   ID:', user._id);
    console.log('   ID (string):', user._id.toString());
    console.log('   Type de l\'ID:', typeof user._id);
    
    // Lister TOUS les documents de subscriptions
    console.log('\n📋 Tous les documents dans subscriptions:');
    const allSubs = await subscriptionsCollection.find({}).toArray();
    console.log('   Nombre total:', allSubs.length);
    
    allSubs.forEach((sub, index) => {
      console.log(`\n   Document ${index + 1}:`);
      console.log('     _id:', sub._id);
      console.log('     userId:', sub.userId);
      console.log('     userId type:', typeof sub.userId);
      console.log('     type:', sub.type);
      console.log('     status:', sub.status);
    });
    
    // Recherche exacte avec ObjectId
    console.log('\n🔍 Recherche avec ObjectId:');
    const subWithObjectId = await subscriptionsCollection.findOne({ 
      userId: user._id 
    });
    console.log('   Résultat avec ObjectId:', subWithObjectId ? 'Trouvé' : 'Non trouvé');
    
    // Recherche avec string
    console.log('\n🔍 Recherche avec string:');
    const subWithString = await subscriptionsCollection.findOne({ 
      userId: user._id.toString() 
    });
    console.log('   Résultat avec string:', subWithString ? 'Trouvé' : 'Non trouvé');
    
    // Recherche avec regex pour voir s'il y a des variations
    console.log('\n🔍 Recherche avec regex (userId contient):');
    const subWithRegex = await subscriptionsCollection.findOne({ 
      userId: { $regex: user._id.toString().slice(-8) } 
    });
    console.log('   Résultat avec regex:', subWithRegex ? 'Trouvé' : 'Non trouvé');
    
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

debugSubscription().catch(console.error);
