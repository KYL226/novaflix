const fetch = require('node-fetch');

async function testMovieCreation() {
  try {
    console.log('🧪 Test de création de film via l\'API...');
    
    // Données de test
    const testMovie = {
      title: 'Film de Test API',
      description: 'Ceci est un film de test pour vérifier que l\'API fonctionne correctement',
      genre: ['Test', 'Action'],
      duration: 120,
      releaseYear: 2024,
      type: 'film',
      videoUrl: 'test/test.mp4',
      posterUrl: 'test/test.jpg',
      published: true
    };
    
    console.log('📤 Données à envoyer:', JSON.stringify(testMovie, null, 2));
    
    // Test sans authentification (devrait échouer avec 403)
    console.log('\n1️⃣ Test sans authentification...');
    try {
      const res1 = await fetch('http://localhost:3000/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testMovie)
      });
      
      const data1 = await res1.json();
      console.log(`   Status: ${res1.status}`);
      console.log(`   Réponse: ${JSON.stringify(data1, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    
    // Test avec données invalides (devrait échouer avec 400)
    console.log('\n2️⃣ Test avec données invalides...');
    const invalidMovie = { ...testMovie, title: '' }; // Titre vide
    
    try {
      const res2 = await fetch('http://localhost:3000/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidMovie)
      });
      
      const data2 = await res2.json();
      console.log(`   Status: ${res2.status}`);
      console.log(`   Réponse: ${JSON.stringify(data2, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    
    // Test avec type invalide (devrait échouer avec 400)
    console.log('\n3️⃣ Test avec type invalide...');
    const invalidTypeMovie = { ...testMovie, type: 'invalid_type' };
    
    try {
      const res3 = await fetch('http://localhost:3000/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidTypeMovie)
      });
      
      const data3 = await res3.json();
      console.log(`   Status: ${res3.status}`);
      console.log(`   Réponse: ${JSON.stringify(data3, null, 2)}`);
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
    
    console.log('\n🎉 Test terminé !');
    console.log('\n💡 Pour tester avec authentification, vous devez :');
    console.log('   1. Vous connecter en tant qu\'admin');
    console.log('   2. Récupérer le token depuis localStorage');
    console.log('   3. L\'utiliser dans l\'en-tête Authorization');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Vérifier que le serveur est en cours d'exécution
console.log('⚠️  Assurez-vous que votre serveur Next.js est en cours d\'exécution sur http://localhost:3000');
console.log('⚠️  Installez node-fetch si nécessaire: npm install node-fetch');

// Exécuter le script
testMovieCreation().catch(console.error);
