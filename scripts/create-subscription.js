const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function createSubscription() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const subscriptionsCollection = db.collection('subscriptions');
    
    // Vérifier si l'utilisateur existe
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: 'test2@gmail.com' });
    
    if (!user) {
      console.log('❌ Utilisateur test2@gmail.com non trouvé');
      return;
    }
    
    console.log('👤 Utilisateur trouvé:', user.email, '(ID:', user._id, ')');
    
    // Vérifier si une subscription existe déjà
    const existingSubscription = await subscriptionsCollection.findOne({ userId: user._id.toString() });
    
    if (existingSubscription) {
      console.log('⚠️  Une subscription existe déjà pour cet utilisateur');
      console.log('   Type:', existingSubscription.type);
      console.log('   Status:', existingSubscription.status);
      console.log('   Expire le:', existingSubscription.endDate);
      return;
    }
    
    // Créer la nouvelle subscription
    const subscription = {
      userId: user._id.toString(),
      type: 'premium',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
      status: 'active',
      paymentMethod: 'credit_card',
      price: 19.99,
      currency: 'EUR',
      billingCycle: 'monthly',
      autoRenew: true,
      features: [
        '4K Ultra HD',
        'Écrans multiples (jusqu\'à 4)',
        'Téléchargements illimités',
        'Contenu exclusif',
        'Pas de publicités',
        'Support prioritaire'
      ],
      metadata: {
        planName: 'Premium Plus',
        maxProfiles: 5,
        maxQuality: '4K',
        offlineViewing: true
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insérer la subscription
    const result = await subscriptionsCollection.insertOne(subscription);
    
    if (result.acknowledged) {
      console.log('✅ Subscription premium créée avec succès !');
      console.log('   ID:', result.insertedId);
      console.log('   Type:', subscription.type);
      console.log('   Status:', subscription.status);
      console.log('   Expire le:', subscription.endDate.toLocaleDateString());
      
      console.log('\n📋 Instructions:');
      console.log('1. Déconnectez-vous de l\'application');
      console.log('2. Reconnectez-vous avec test2@gmail.com');
      console.log('3. Testez une vidéo - elle devrait fonctionner !');
      
    } else {
      console.log('❌ Erreur lors de la création de la subscription');
    }
    
  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
createSubscription().catch(console.error);
