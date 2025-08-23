const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function checkSubscriptionSchema() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    
    // Vérifier les collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections disponibles:');
    collections.forEach(col => console.log('   -', col.name));
    
    // Vérifier le schéma de la collection subscriptions
    const subscriptionsCollection = db.collection('subscriptions');
    
    // Essayer de récupérer les options de la collection
    try {
      const options = await db.command({ listCollections: 1, filter: { name: "subscriptions" } });
      console.log('\n🔍 Options de la collection subscriptions:');
      console.log(JSON.stringify(options, null, 2));
    } catch (e) {
      console.log('❌ Impossible de récupérer les options de la collection');
    }
    
    // Vérifier s'il y a des documents existants
    const existingDocs = await subscriptionsCollection.find({}).limit(1).toArray();
    console.log('\n📄 Documents existants dans subscriptions:');
    if (existingDocs.length > 0) {
      console.log('Structure du premier document:');
      console.log(JSON.stringify(existingDocs[0], null, 2));
    } else {
      console.log('   Aucun document trouvé');
    }
    
    // Essayer d'insérer un document simple pour voir l'erreur exacte
    console.log('\n🧪 Test d\'insertion d\'un document simple...');
    try {
      const testDoc = {
        userId: "68a9621749ac39f71c6718df",
        type: "premium",
        status: "active"
      };
      
      const result = await subscriptionsCollection.insertOne(testDoc);
      console.log('✅ Document simple inséré avec succès:', result.insertedId);
      
      // Supprimer le document de test
      await subscriptionsCollection.deleteOne({ _id: result.insertedId });
      console.log('🗑️ Document de test supprimé');
      
    } catch (error) {
      console.log('❌ Erreur lors de l\'insertion du document simple:');
      console.log('   Code:', error.code);
      console.log('   Message:', error.message);
      if (error.errInfo && error.errInfo.details) {
        console.log('   Détails de validation:');
        console.log(JSON.stringify(error.errInfo.details, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

checkSubscriptionSchema().catch(console.error);
