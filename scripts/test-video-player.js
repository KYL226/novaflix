require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function testVideoPlayer() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const movies = await db.collection('movies').find({}).toArray();
    
    // Vérifier les fichiers disponibles
    const videosDir = path.join(process.cwd(), 'secure-media', 'videos');
    const imagesDir = path.join(process.cwd(), 'secure-media', 'images');
    
    const availableVideos = fs.readdirSync(videosDir);
    const availableImages = fs.readdirSync(imagesDir);
    
    console.log('\n🔍 Test du lecteur vidéo');
    console.log('📁 Fichiers vidéo disponibles:', availableVideos);
    console.log('📁 Fichiers image disponibles:', availableImages);
    
    console.log('\n📋 Vérification des films :');
    
    let allValid = true;
    
    for (const movie of movies) {
      const videoExists = availableVideos.includes(movie.videoUrl);
      const imageExists = availableImages.includes(movie.posterUrl);
      
      console.log(`\n- ${movie.title}:`);
      console.log(`  videoUrl: '${movie.videoUrl}' ${videoExists ? '✅' : '❌'}`);
      console.log(`  posterUrl: '${movie.posterUrl}' ${imageExists ? '✅' : '❌'}`);
      
      if (!videoExists || !imageExists) {
        allValid = false;
      }
      
      // Construire l'URL complète pour tester
      const videoApiUrl = `/api/secure-media/videos/${movie.videoUrl}`;
      const imageApiUrl = `/api/secure-media/images/${movie.posterUrl}`;
      
      console.log(`  API vidéo: ${videoApiUrl}`);
      console.log(`  API image: ${imageApiUrl}`);
    }
    
    if (allValid) {
      console.log('\n🎉 Tous les films ont des URLs valides !');
      console.log('\n💡 Pour tester le lecteur vidéo :');
      console.log('1. Démarrez le serveur : npm run dev');
      console.log('2. Connectez-vous avec un compte premium');
      console.log('3. Allez sur la page d\'un film et cliquez sur "Regarder"');
    } else {
      console.log('\n⚠️  Certains films ont des URLs invalides');
      console.log('Exécutez : node scripts/fix-all-movie-urls.js');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

testVideoPlayer().catch(console.error);
