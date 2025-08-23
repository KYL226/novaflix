const fetch = require('node-fetch');

async function testApiDirectly() {
  console.log('🧪 Test direct de l\'API secure-media...\n');
  
  const baseUrl = 'http://localhost:3000';
  const videoPath = '/api/secure-media/videos/hist.mp4';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTk2MjE3NDlhYzM5ZjcxYzY3MThkZiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJzdWJzY3JpcHRpb24iOiJwcmVtaXVtIiwiaWF0IjoxNzU1OTM0ODQ5LCJleHAiOjE3NTY1Mzk2NDl9.b7s_kww-EBoy1wRsk7UTOIHzqDiNPXsvaJyzq1lsYQU';
  
  console.log('1️⃣ Test sans token:');
  try {
    const response1 = await fetch(`${baseUrl}${videoPath}`);
    console.log('   Status:', response1.status);
    console.log('   Message:', response1.statusText);
    console.log('');
  } catch (error) {
    console.log('   ❌ Erreur de connexion:', error.message);
    console.log('');
  }
  
  console.log('2️⃣ Test avec token dans l\'URL:');
  try {
    const response2 = await fetch(`${baseUrl}${videoPath}?token=${token}`);
    console.log('   Status:', response2.status);
    console.log('   Message:', response2.statusText);
    if (response2.ok) {
      console.log('   ✅ Succès ! La vidéo est accessible');
    } else {
      const errorText = await response2.text();
      console.log('   ❌ Erreur:', errorText);
    }
    console.log('');
  } catch (error) {
    console.log('   ❌ Erreur de connexion:', error.message);
    console.log('');
  }
  
  console.log('3️⃣ Test avec token dans le header Authorization:');
  try {
    const response3 = await fetch(`${baseUrl}${videoPath}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('   Status:', response3.status);
    console.log('   Message:', response3.statusText);
    if (response3.ok) {
      console.log('   ✅ Succès ! La vidéo est accessible');
    } else {
      const errorText = await response3.text();
      console.log('   ❌ Erreur:', errorText);
    }
    console.log('');
  } catch (error) {
    console.log('   ❌ Erreur de connexion:', error.message);
    console.log('');
  }
  
  console.log('4️⃣ Test avec token dans les cookies:');
  try {
    const response4 = await fetch(`${baseUrl}${videoPath}`, {
      headers: {
        'Cookie': `token=${token}`
      }
    });
    console.log('   Status:', response4.status);
    console.log('   Message:', response4.statusText);
    if (response4.ok) {
      console.log('   ✅ Succès ! La vidéo est accessible');
    } else {
      const errorText = await response4.text();
      console.log('   ❌ Erreur:', errorText);
    }
    console.log('');
  } catch (error) {
    console.log('   ❌ Erreur de connexion:', error.message);
    console.log('');
  }
  
  console.log('5️⃣ Vérification du serveur:');
  try {
    const response5 = await fetch(`${baseUrl}/api/movies`);
    console.log('   Status API movies:', response5.status);
    if (response5.ok) {
      console.log('   ✅ Serveur Next.js fonctionne');
    } else {
      console.log('   ❌ Problème avec le serveur Next.js');
    }
  } catch (error) {
    console.log('   ❌ Serveur Next.js inaccessible:', error.message);
  }
}

// Exécuter le test
testApiDirectly().catch(console.error);
