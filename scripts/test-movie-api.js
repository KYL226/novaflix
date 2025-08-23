const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function testMovieAPI() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const moviesCollection = db.collection('movies');
    
    console.log('\n🔍 Test de l\'API de création de films...');
    
    // Test 1: Vérifier la collection movies
    console.log('\n1️⃣ Vérification de la collection movies :');
    const movieCount = await moviesCollection.countDocuments();
    console.log(`   - Nombre total de films : ${movieCount}`);
    
    // Test 2: Vérifier la structure des films existants
    console.log('\n2️⃣ Vérification de la structure des films :');
    const sampleMovie = await moviesCollection.findOne();
    if (sampleMovie) {
      const requiredFields = ['title', 'description', 'genre', 'duration', 'releaseYear', 'type', 'videoUrl', 'posterUrl'];
      const missingFields = requiredFields.filter(field => !(field in sampleMovie));
      
      if (missingFields.length > 0) {
        console.log(`   ⚠️  Champs manquants : ${missingFields.join(', ')}`);
      } else {
        console.log('   ✅ Tous les champs requis sont présents');
      }
      
      console.log('   - Champs présents :', Object.keys(sampleMovie));
    } else {
      console.log('   ℹ️  Aucun film trouvé dans la base');
    }
    
    // Test 3: Vérifier les index
    console.log('\n3️⃣ Vérification des index :');
    const indexes = await moviesCollection.indexes();
    const hasTitleIndex = indexes.some(index => index.key.title === 1);
    const hasTypeIndex = indexes.some(index => index.key.type === 1);
    const hasGenreIndex = indexes.some(index => index.key.genre === 1);
    
    if (hasTitleIndex) console.log('   ✅ Index sur title présent');
    else console.log('   ❌ Index sur title manquant');
    
    if (hasTypeIndex) console.log('   ✅ Index sur type présent');
    else console.log('   ❌ Index sur type manquant');
    
    if (hasGenreIndex) console.log('   ✅ Index sur genre présent');
    else console.log('   ❌ Index sur genre manquant');
    
    // Test 4: Créer un film de test
    console.log('\n4️⃣ Test de création d\'un film :');
    const testMovie = {
      title: 'Film de Test',
      description: 'Ceci est un film de test pour vérifier l\'API',
      genre: ['Test', 'Drame'],
      duration: 120,
      releaseYear: 2024,
      type: 'film',
      videoUrl: 'test/test.mp4',
      posterUrl: 'test/test.jpg',
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    try {
      const result = await moviesCollection.insertOne(testMovie);
      console.log(`   ✅ Film de test créé avec l'ID : ${result.insertedId}`);
      
      // Supprimer le film de test
      await moviesCollection.deleteOne({ _id: result.insertedId });
      console.log('   ✅ Film de test supprimé');
    } catch (error) {
      console.log(`   ❌ Erreur lors de la création du film de test : ${error.message}`);
    }
    
    // Test 5: Vérifier les types de films
    console.log('\n5️⃣ Types de films disponibles :');
    const types = await moviesCollection.distinct('type');
    console.log(`   - Types trouvés : ${types.join(', ')}`);
    
    // Test 6: Vérifier les genres
    console.log('\n6️⃣ Genres disponibles :');
    const genres = await moviesCollection.distinct('genre');
    const uniqueGenres = [...new Set(genres.flat())];
    console.log(`   - Genres uniques : ${uniqueGenres.join(', ')}`);
    
    console.log('\n🎉 Test de l\'API terminé !');
    
    // Recommandations
    if (movieCount === 0) {
      console.log('\n💡 RECOMMANDATIONS :');
      console.log('   1. Ajoutez des films via l\'interface admin');
      console.log('   2. Ou utilisez le script init-db.js pour ajouter des films d\'exemple');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
testMovieAPI().catch(console.error);
