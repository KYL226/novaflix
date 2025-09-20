#!/usr/bin/env node

/**
 * Script de test pour vérifier le flux d'authentification complet
 * Teste l'inscription, la connexion et l'affichage des données utilisateur
 */

const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Couleurs pour l'affichage
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testRegistration() {
  log('\n📝 Test d\'inscription', 'blue');
  
  try {
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'password123'
    };

    const response = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    if (response.status === 201) {
      const data = JSON.parse(response.data);
      
      if (data.user && data.token) {
        log('✅ Inscription réussie avec token', 'green');
        log(`   Nom: ${data.user.name}`, 'green');
        log(`   Email: ${data.user.email}`, 'green');
        log(`   Rôle: ${data.user.role}`, 'green');
        log(`   Abonnement: ${data.user.subscription}`, 'green');
        log(`   Token généré: ${data.token ? 'Oui' : 'Non'}`, 'green');
        
        return { user: data.user, token: data.token };
      } else {
        log('❌ Données utilisateur manquantes dans la réponse', 'red');
        return null;
      }
    } else {
      log(`❌ Erreur d'inscription: ${response.status}`, 'red');
      log(`   Réponse: ${response.data}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Erreur lors du test d'inscription: ${error.message}`, 'red');
    return null;
  }
}

async function testLogin(email, password) {
  log('\n🔐 Test de connexion', 'blue');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
      const data = JSON.parse(response.data);
      
      if (data.user && data.token) {
        log('✅ Connexion réussie', 'green');
        log(`   Nom: ${data.user.name}`, 'green');
        log(`   Email: ${data.user.email}`, 'green');
        log(`   Rôle: ${data.user.role}`, 'green');
        log(`   Abonnement: ${data.user.subscription}`, 'green');
        
        return { user: data.user, token: data.token };
      } else {
        log('❌ Données utilisateur manquantes dans la réponse', 'red');
        return null;
      }
    } else {
      log(`❌ Erreur de connexion: ${response.status}`, 'red');
      log(`   Réponse: ${response.data}`, 'red');
      return null;
    }
  } catch (error) {
    log(`❌ Erreur lors du test de connexion: ${error.message}`, 'red');
    return null;
  }
}

async function testUserDataDisplay() {
  log('\n👤 Test d\'affichage des données utilisateur', 'blue');
  
  log('Instructions pour tester manuellement:', 'yellow');
  log('1. Ouvrez votre navigateur sur http://localhost:3000', 'yellow');
  log('2. Inscrivez-vous avec un nouveau compte', 'yellow');
  log('3. Vérifiez que vous êtes automatiquement connecté', 'yellow');
  log('4. Vérifiez que votre nom s\'affiche correctement dans le header', 'yellow');
  log('5. Allez sur la page de profil et vérifiez les informations', 'yellow');
  log('6. Déconnectez-vous et reconnectez-vous', 'yellow');
  log('7. Vérifiez que les données persistent', 'yellow');
}

async function runAuthTests() {
  log('🔐 Tests du flux d\'authentification', 'bold');
  log('=' .repeat(60), 'blue');
  
  // Test d'inscription
  const registrationResult = await testRegistration();
  
  if (registrationResult) {
    // Test de connexion avec le compte créé
    await testLogin(registrationResult.user.email, 'password123');
  }
  
  // Instructions pour les tests manuels
  await testUserDataDisplay();
  
  log('\n' + '=' .repeat(60), 'blue');
  log('🎯 Résumé des tests d\'authentification', 'bold');
  
  if (registrationResult) {
    log('✅ Inscription avec connexion automatique', 'green');
    log('✅ Token généré correctement', 'green');
    log('✅ Données utilisateur complètes', 'green');
  } else {
    log('❌ Problèmes détectés dans le flux d\'inscription', 'red');
  }
  
  log('\n📋 Points à vérifier manuellement:', 'blue');
  log('• L\'inscription connecte automatiquement l\'utilisateur', 'yellow');
  log('• Le nom utilisateur s\'affiche correctement (pas "inconnu")', 'yellow');
  log('• Aucune erreur 401 dans la console', 'yellow');
  log('• Les données persistent après rechargement', 'yellow');
}

// Exécuter les tests
if (require.main === module) {
  runAuthTests().catch(console.error);
}

module.exports = {
  testRegistration,
  testLogin,
  testUserDataDisplay,
  runAuthTests
};
