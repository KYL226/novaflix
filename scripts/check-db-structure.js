const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function checkDatabaseStructure() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    
    // Vérifier la collection users
    console.log('\n🔍 Vérification de la collection users...');
    const usersCollection = db.collection('users');
    
    // Compter les utilisateurs
    const userCount = await usersCollection.countDocuments();
    console.log(`   - Nombre total d'utilisateurs : ${userCount}`);
    
    // Vérifier les utilisateurs sans rôle
    const usersWithoutRole = await usersCollection.find({ role: { $exists: false } }).toArray();
    if (usersWithoutRole.length > 0) {
      console.log(`   ⚠️  ${usersWithoutRole.length} utilisateur(s) sans rôle détecté(s)`);
      
      // Ajouter le rôle 'user' par défaut aux utilisateurs sans rôle
      const result = await usersCollection.updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user', updatedAt: new Date() } }
      );
      console.log(`   ✅ ${result.modifiedCount} utilisateur(s) mis à jour avec le rôle 'user'`);
    } else {
      console.log('   ✅ Tous les utilisateurs ont un rôle défini');
    }
    
    // Vérifier les utilisateurs admin
    const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();
    console.log(`   - Utilisateurs admin : ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('   ⚠️  Aucun utilisateur admin trouvé');
      
      // Demander si on veut créer un admin
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Voulez-vous créer un utilisateur admin ? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          const bcrypt = require('bcryptjs');
          const adminPassword = await bcrypt.hash('admin123', 12);
          
          await usersCollection.insertOne({
            email: 'admin@novaflix.com',
            password: adminPassword,
            name: 'Administrateur',
            role: 'admin',
            subscription: 'premium',
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          console.log('   ✅ Utilisateur admin créé (admin@novaflix.com / admin123)');
        }
        rl.close();
      });
      
      // Attendre la réponse avant de continuer
      await new Promise(resolve => rl.on('close', resolve));
    } else {
      console.log('   ✅ Utilisateurs admin présents :');
      adminUsers.forEach(user => {
        console.log(`      - ${user.email} (${user.name})`);
      });
    }
    
    // Vérifier la structure des documents utilisateurs
    console.log('\n🔍 Vérification de la structure des documents...');
    const sampleUser = await usersCollection.findOne();
    if (sampleUser) {
      const requiredFields = ['email', 'password', 'name', 'role'];
      const missingFields = requiredFields.filter(field => !(field in sampleUser));
      
      if (missingFields.length > 0) {
        console.log(`   ⚠️  Champs manquants : ${missingFields.join(', ')}`);
      } else {
        console.log('   ✅ Structure des documents utilisateurs correcte');
      }
      
      console.log('   - Champs présents :', Object.keys(sampleUser));
    }
    
    // Vérifier les index
    console.log('\n🔍 Vérification des index...');
    const indexes = await usersCollection.indexes();
    const hasEmailIndex = indexes.some(index => index.key.email === 1);
    
    if (!hasEmailIndex) {
      console.log('   ⚠️  Index sur email manquant, création...');
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log('   ✅ Index sur email créé');
    } else {
      console.log('   ✅ Index sur email présent');
    }
    
    console.log('\n🎉 Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
checkDatabaseStructure().catch(console.error);
