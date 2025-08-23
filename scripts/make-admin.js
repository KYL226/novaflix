const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function makeUserAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const usersCollection = db.collection('users');
    
    // Lister tous les utilisateurs
    console.log('\n👥 Utilisateurs disponibles :');
    const users = await usersCollection.find({}, { projection: { email: 1, name: 1, role: 1, _id: 0 } }).toArray();
    
    if (users.length === 0) {
      console.log('   Aucun utilisateur trouvé dans la base de données');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.name}) - Rôle: ${user.role || 'non défini'}`);
    });
    
    // Demander l'email de l'utilisateur à promouvoir
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('\nEntrez l\'email de l\'utilisateur à promouvoir admin : ', async (email) => {
      try {
        // Vérifier si l'utilisateur existe
        const user = await usersCollection.findOne({ email: email.trim() });
        
        if (!user) {
          console.log('❌ Utilisateur non trouvé');
          rl.close();
          return;
        }
        
        if (user.role === 'admin') {
          console.log('ℹ️  Cet utilisateur est déjà administrateur');
          rl.close();
          return;
        }
        
        // Demander confirmation
        rl.question(`Confirmer la promotion de ${user.name} (${user.email}) en administrateur ? (y/n): `, async (confirm) => {
          if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
            // Mettre à jour le rôle
            const result = await usersCollection.updateOne(
              { email: email.trim() },
              { $set: { role: 'admin', updatedAt: new Date() } }
            );
            
            if (result.modifiedCount > 0) {
              console.log(`✅ ${user.name} a été promu administrateur avec succès !`);
            } else {
              console.log('❌ Erreur lors de la mise à jour');
            }
          } else {
            console.log('❌ Opération annulée');
          }
          rl.close();
        });
        
      } catch (error) {
        console.error('❌ Erreur :', error);
        rl.close();
      }
    });
    
    // Attendre la réponse avant de continuer
    await new Promise(resolve => rl.on('close', resolve));
    
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
makeUserAdmin().catch(console.error);
