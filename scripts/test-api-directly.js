const https = require('https');
const http = require('http');

// Token extrait des logs
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTk2MjE3NDlhYzM5ZjcxYzY3MThkZiIsImVtYWlsIjoidGVzdDJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJzdWJzY3JpcHRpb24iOiJwcmVtaXVtIiwiaWF0IjoxNzU2NjMwOTQ5LCJleHAiOjE3NTcyMzU3NDl9.6FqyTTI72Ld8cyHBM0Rr9cEDel5hvSo8mXKQ4Or6XDg';

const testUrl = `http://localhost:3000/api/secure-media/videos/test.mp4?token=${token}`;

console.log('🔍 Test direct de l\'API secure-media...');
console.log('🔗 URL:', testUrl);
console.log('🔑 Token:', token.substring(0, 20) + '...');
console.log('');

const req = http.get(testUrl, (res) => {
  console.log('📊 Statut de la réponse:', res.statusCode);
  console.log('📋 Headers de réponse:', res.headers);
  console.log('');
  
  if (res.statusCode === 200) {
    console.log('✅ Succès ! Le fichier devrait se télécharger');
  } else {
    console.log('❌ Erreur:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Corps de la réponse:', data);
    });
  }
});

req.on('error', (error) => {
  console.error('❌ Erreur de requête:', error.message);
});

req.end();
