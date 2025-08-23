const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function updateUsersSchema() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const usersCollection = db.collection('users');
    
    console.log('\n🔍 Mise à jour du schéma des utilisateurs...');
    
    // Compter les utilisateurs
    const userCount = await usersCollection.countDocuments();
    console.log(`   - Nombre total d'utilisateurs : ${userCount}`);
    
    // Vérifier les utilisateurs sans champ banned
    const usersWithoutBanned = await usersCollection.find({ 
      banned: { $exists: false } 
    }).toArray();
    
    if (usersWithoutBanned.length > 0) {
      console.log(`   ⚠️  ${usersWithoutBanned.length} utilisateur(s) sans champ 'banned' détecté(s)`);
      
      // Ajouter le champ banned = false par défaut
      const result = await usersCollection.updateMany(
        { banned: { $exists: false } },
        { $set: { banned: false, updatedAt: new Date() } }
      );
      
      console.log(`   ✅ ${result.modifiedCount} utilisateur(s) mis à jour avec banned: false`);
    } else {
      console.log('   ✅ Tous les utilisateurs ont déjà le champ banned');
    }
    
    // Vérifier les utilisateurs sans champ updatedAt
    const usersWithoutUpdatedAt = await usersCollection.find({ 
      updatedAt: { $exists: false } 
    }).toArray();
    
    if (usersWithoutUpdatedAt.length > 0) {
      console.log(`   ⚠️  ${usersWithoutUpdatedAt.length} utilisateur(s) sans champ 'updatedAt' détecté(s)`);
      
      // Ajouter le champ updatedAt
      const result = await usersCollection.updateMany(
        { updatedAt: { $exists: false } },
        { $set: { updatedAt: new Date() } }
      );
      
      console.log(`   ✅ ${result.modifiedCount} utilisateur(s) mis à jour avec updatedAt`);
    } else {
      console.log('   ✅ Tous les utilisateurs ont déjà le champ updatedAt');
    }
    
    // Afficher un exemple d'utilisateur pour vérifier la structure
    console.log('\n🔍 Vérification de la structure finale...');
    const sampleUser = await usersCollection.findOne();
    if (sampleUser) {
      console.log('   ✅ Structure des documents utilisateurs :');
      console.log('   - Champs présents :', Object.keys(sampleUser));
      
      // Vérifier les champs requis
      const requiredFields = ['email', 'password', 'name', 'role', 'banned'];
      const missingFields = requiredFields.filter(field => !(field in sampleUser));
      
      if (missingFields.length > 0) {
        console.log(`   ❌ Champs manquants : ${missingFields.join(', ')}`);
      } else {
        console.log('   ✅ Tous les champs requis sont présents');
      }
    }
    
    console.log('\n🎉 Mise à jour du schéma terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
updateUsersSchema().catch(console.error);
