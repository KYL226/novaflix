const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function testAuthentication() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const usersCollection = db.collection('users');
    
    console.log('\n🔍 Test de l\'authentification...');
    
    // Test 1: Vérifier la structure des utilisateurs
    console.log('\n1️⃣ Vérification de la structure des utilisateurs :');
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      console.log('   ❌ Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`   ✅ ${users.length} utilisateur(s) trouvé(s)`);
    
    users.forEach((user, index) => {
      const hasRole = user.role && (user.role === 'user' || user.role === 'admin');
      const status = hasRole ? '✅' : '❌';
      console.log(`   ${status} ${index + 1}. ${user.email} - Rôle: ${user.role || 'MANQUANT'}`);
    });
    
    // Test 2: Vérifier les utilisateurs admin
    console.log('\n2️⃣ Vérification des administrateurs :');
    const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();
    
    if (adminUsers.length === 0) {
      console.log('   ❌ Aucun administrateur trouvé');
      console.log('   💡 Utilisez le script make-admin.js pour créer un admin');
    } else {
      console.log(`   ✅ ${adminUsers.length} administrateur(s) trouvé(s) :`);
      adminUsers.forEach(admin => {
        console.log(`      - ${admin.email} (${admin.name})`);
      });
    }
    
    // Test 3: Vérifier les utilisateurs normaux
    console.log('\n3️⃣ Vérification des utilisateurs normaux :');
    const normalUsers = await usersCollection.find({ role: 'user' }).toArray();
    
    if (normalUsers.length === 0) {
      console.log('   ⚠️  Aucun utilisateur normal trouvé');
    } else {
      console.log(`   ✅ ${normalUsers.length} utilisateur(s) normal(aux) trouvé(s)`);
    }
    
    // Test 4: Vérifier les utilisateurs sans rôle
    console.log('\n4️⃣ Vérification des utilisateurs sans rôle :');
    const usersWithoutRole = await usersCollection.find({ role: { $exists: false } }).toArray();
    
    if (usersWithoutRole.length > 0) {
      console.log(`   ❌ ${usersWithoutRole.length} utilisateur(s) sans rôle détecté(s) :`);
      usersWithoutRole.forEach(user => {
        console.log(`      - ${user.email} (${user.name})`);
      });
      console.log('   💡 Utilisez le script check-db-structure.js pour corriger');
    } else {
      console.log('   ✅ Tous les utilisateurs ont un rôle défini');
    }
    
    // Test 5: Vérifier les champs requis
    console.log('\n5️⃣ Vérification des champs requis :');
    const requiredFields = ['email', 'password', 'name', 'role'];
    const sampleUser = users[0];
    
    if (sampleUser) {
      const missingFields = requiredFields.filter(field => !(field in sampleUser));
      
      if (missingFields.length > 0) {
        console.log(`   ❌ Champs manquants : ${missingFields.join(', ')}`);
      } else {
        console.log('   ✅ Tous les champs requis sont présents');
      }
      
      console.log('   - Champs présents :', Object.keys(sampleUser));
    }
    
    // Test 6: Vérifier les index
    console.log('\n6️⃣ Vérification des index :');
    const indexes = await usersCollection.indexes();
    const hasEmailIndex = indexes.some(index => index.key.email === 1);
    
    if (hasEmailIndex) {
      console.log('   ✅ Index sur email présent');
    } else {
      console.log('   ❌ Index sur email manquant');
    }
    
    console.log('\n🎉 Test d\'authentification terminé !');
    
    // Recommandations
    if (adminUsers.length === 0) {
      console.log('\n💡 RECOMMANDATIONS :');
      console.log('   1. Créez un utilisateur administrateur avec make-admin.js');
      console.log('   2. Ou réinitialisez la base avec init-db.js');
    }
    
    if (usersWithoutRole.length > 0) {
      console.log('\n⚠️  PROBLÈMES DÉTECTÉS :');
      console.log('   1. Exécutez check-db-structure.js pour corriger les rôles manquants');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
testAuthentication().catch(console.error);
