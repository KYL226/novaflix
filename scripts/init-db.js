const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function initDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db('novaflix');

    const existingCollections = (await db.listCollections().toArray()).map(c => c.name);

    // === Création conditionnelle de la collection 'users' ===
    if (!existingCollections.includes('users')) {
      await db.createCollection('users', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password', 'name', 'role'],
            properties: {
              email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
              password: { bsonType: 'string', minLength: 6 },
              name: { bsonType: 'string', minLength: 2 },
              role: { enum: ['user', 'admin'] },
              subscription: { enum: ['free', 'basic', 'premium'] }
            }
          }
        }
      });
      console.log('✅ Collection "users" créée');
    } else {
      console.log('ℹ️ Collection "users" déjà existante');
    }

    // === Création conditionnelle de la collection 'movies' ===
    if (!existingCollections.includes('movies')) {
      await db.createCollection('movies', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'description', 'genre', 'duration', 'releaseYear', 'videoUrl', 'posterUrl', 'type'],
            properties: {
              title: { bsonType: 'string', minLength: 1 },
              description: { bsonType: 'string', minLength: 10 },
              genre: { bsonType: 'array', items: { bsonType: 'string' } },
              duration: { bsonType: 'int', minimum: 1 },
              releaseYear: { bsonType: 'int', minimum: 1900, maximum: 2030 },
              videoUrl: { bsonType: 'string' },
              posterUrl: { bsonType: 'string' },
              type: { enum: ['film', 'serie', 'documentaire'] }
            }
          }
        }
      });
      console.log('✅ Collection "movies" créée');
    } else {
      console.log('ℹ️ Collection "movies" déjà existante');
    }

    // === Création conditionnelle de la collection 'subscriptions' ===
    if (!existingCollections.includes('subscriptions')) {
      await db.createCollection('subscriptions', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['userId', 'type', 'startDate', 'endDate', 'status', 'paymentMethod'],
            properties: {
              userId: { bsonType: 'objectId' },
              type: { enum: ['basic', 'premium'] },
              startDate: { bsonType: 'date' },
              endDate: { bsonType: 'date' },
              status: { enum: ['active', 'expired', 'cancelled'] },
              paymentMethod: { enum: ['mobile_money', 'credit_card', 'paypal'] }
            }
          }
        }
      });
      console.log('✅ Collection "subscriptions" créée');
    } else {
      console.log('ℹ️ Collection "subscriptions" déjà existante');
    }

    // === Création des index (sans risque de doublon) ===
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('movies').createIndex({ title: 'text', description: 'text' });
    await db.collection('movies').createIndex({ type: 1 });
    await db.collection('movies').createIndex({ genre: 1 });
    await db.collection('subscriptions').createIndex({ userId: 1 });

    console.log('✅ Index créés');

    // === Comptage des documents existants ===
    const userCount = await db.collection('users').countDocuments();
    const movieCount = await db.collection('movies').countDocuments();

    // === Ajout d'un admin si la collection users est vide ===
    if (userCount === 0) {
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123', 12);

      await db.collection('users').insertOne({
        email: 'admin@novaflix.com',
        password: admin123,
        name: 'Administrateur',
        role: 'admin',
        subscription: 'premium',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Utilisateur admin créé (admin@novaflix.com / admin123)');
    }

    // === Ajout de films d'exemple si collection vide ===
    if (movieCount === 0) {
      const sampleMovies = [
        {
          title: 'Inception',
          description: 'Un voleur qui pénètre dans les rêves des autres pour voler leurs secrets les plus intimes.',
          genre: ['Science-fiction', 'Thriller', 'Action'],
          duration: 148,
          releaseYear: 2010,
          videoUrl: 'inception.mp4',
          posterUrl: 'inception.jpg',
          type: 'film',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Breaking Bad',
          description: 'Un professeur de chimie devient fabricant de drogue pour assurer l\'avenir financier de sa famille.',
          genre: ['Drame', 'Crime', 'Thriller'],
          duration: 47,
          releaseYear: 2008,
          videoUrl: 'breaking-bad.mp4',
          posterUrl: 'breaking-bad.jpg',
          type: 'serie',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Planet Earth II',
          description: 'Une exploration époustouflante de la nature sauvage de notre planète.',
          genre: ['Documentaire', 'Nature', 'Aventure'],
          duration: 60,
          releaseYear: 2016,
          videoUrl: 'planet-earth-ii.mp4',
          posterUrl: 'planet-earth-ii.jpg',
          type: 'documentaire',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'The Dark Knight',
          description: 'Batman affronte le chaos créé par le Joker dans Gotham City.',
          genre: ['Action', 'Drame', 'Crime'],
          duration: 152,
          releaseYear: 2008,
          videoUrl: 'dark-knight.mp4',
          posterUrl: 'dark-knight.jpg',
          type: 'film',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Stranger Things',
          description: 'Quand un jeune garçon disparaît, sa mère doit affronter des forces surnaturelles.',
          genre: ['Drame', 'Fantasy', 'Horreur'],
          duration: 50,
          releaseYear: 2016,
          videoUrl: 'stranger-things.mp4',
          posterUrl: 'stranger-things.jpg',
          type: 'serie',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await db.collection('movies').insertMany(sampleMovies);
      console.log(`✅ ${sampleMovies.length} films d'exemple créés`);
    }

    console.log('\n🎉 Base de données initialisée avec succès !');
    console.log('\n📋 Récapitulatif :');
    console.log(`   - Utilisateurs : ${await db.collection('users').countDocuments()}`);
    console.log(`   - Films : ${await db.collection('movies').countDocuments()}`);
    console.log(`   - Abonnements : ${await db.collection('subscriptions').countDocuments()}`);

    if (userCount === 0) {
      console.log('\n🔑 Connexion admin :');
      console.log('   Email : admin@novaflix.com');
      console.log('   Mot de passe : admin123');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
initDatabase().catch(console.error);
