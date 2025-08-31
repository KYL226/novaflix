require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novaflix';

async function fixAllMovieUrls() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('novaflix');
    const moviesCollection = db.collection('movies');
    
    // Vérifier les fichiers disponibles
    const videosDir = path.join(process.cwd(), 'secure-media', 'videos');
    const imagesDir = path.join(process.cwd(), 'secure-media', 'images');
    
    const availableVideos = fs.readdirSync(videosDir);
    const availableImages = fs.readdirSync(imagesDir);
    
    console.log('\n📁 Fichiers vidéo disponibles:', availableVideos);
    console.log('📁 Fichiers image disponibles:', availableImages);
    
    // Récupérer tous les films
    const movies = await moviesCollection.find({}).toArray();
    
    console.log('\n🔧 Correction des URLs des films...');
    
    for (const movie of movies) {
      let needsUpdate = false;
      const updates = {};
      
      // Vérifier si le fichier vidéo existe
      if (!availableVideos.includes(movie.videoUrl)) {
        // Utiliser le premier fichier vidéo disponible
        const fallbackVideo = availableVideos[0] || 'test.mp4';
        updates.videoUrl = fallbackVideo;
        needsUpdate = true;
        console.log(`  - ${movie.title}: videoUrl corrigé de '${movie.videoUrl}' vers '${fallbackVideo}'`);
      }
      
      // Vérifier si le fichier image existe
      if (!availableImages.includes(movie.posterUrl)) {
        // Utiliser le premier fichier image disponible
        const fallbackImage = availableImages[0] || 'test.png';
        updates.posterUrl = fallbackImage;
        needsUpdate = true;
        console.log(`  - ${movie.title}: posterUrl corrigé de '${movie.posterUrl}' vers '${fallbackImage}'`);
      }
      
      // Mettre à jour si nécessaire
      if (needsUpdate) {
        await moviesCollection.updateOne(
          { _id: movie._id },
          { 
            $set: {
              ...updates,
              updatedAt: new Date()
            }
          }
        );
        console.log(`  ✅ ${movie.title} mis à jour`);
      } else {
        console.log(`  ℹ️  ${movie.title}: URLs correctes`);
      }
    }
    
    console.log('\n🎉 Correction terminée !');
    
    // Vérifier le résultat
    console.log('\n📋 Vérification finale :');
    const updatedMovies = await moviesCollection.find({}).toArray();
    updatedMovies.forEach(movie => {
      console.log(`- ${movie.title}: videoUrl='${movie.videoUrl}', posterUrl='${movie.posterUrl}'`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Connexion MongoDB fermée');
  }
}

fixAllMovieUrls().catch(console.error);
