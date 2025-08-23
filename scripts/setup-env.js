const fs = require('fs');
const path = require('path');

const envContent = `# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/novaflix

# JWT Secret (générer une clé sécurisée en production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configuration des médias
NEXT_PUBLIC_MEDIA_URL=/api/secure-media
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env.local créé avec succès !');
  console.log('📝 N\'oubliez pas de :');
  console.log('   1. Installer MongoDB localement ou modifier MONGODB_URI');
  console.log('   2. Changer JWT_SECRET en production');
} catch (error) {
  console.error('❌ Erreur lors de la création du fichier .env.local:', error);
}