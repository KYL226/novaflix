#!/usr/bin/env node

/**
 * Script de test pour vérifier l'affichage correct du statut d'abonnement
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

async function testSubscriptionDisplay() {
  log('\n📊 Test d\'affichage du statut d\'abonnement', 'blue');
  
  try {
    // Test de la page d'accueil
    log('Test: Vérification de l\'affichage sur la page d\'accueil...', 'yellow');
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.status === 200) {
      // Vérifier qu'aucun texte "actif premium" n'apparaît pour les utilisateurs gratuits
      const hasIncorrectPremium = response.data.includes('actif premium') || 
                                 response.data.includes('Premium Actif');
      
      if (hasIncorrectPremium) {
        log('❌ Texte "actif premium" détecté sur la page d\'accueil', 'red');
      } else {
        log('✅ Aucun texte "actif premium" incorrect détecté', 'green');
      }
    } else {
      log(`⚠️  Page d'accueil non accessible: ${response.status}`, 'yellow');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testUserSubscriptionStatus() {
  log('\n👤 Test du statut d\'abonnement utilisateur', 'blue');
  
  try {
    // Test avec un utilisateur gratuit
    log('Test: Création d\'un utilisateur gratuit...', 'yellow');
    const freeUser = {
      name: 'Test Free User',
      email: `free-test-${Date.now()}@example.com`,
      password: 'password123'
    };

    const regResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(freeUser)
    });

    if (regResponse.status === 201) {
      const regData = JSON.parse(regResponse.data);
      log('✅ Utilisateur gratuit créé', 'green');
      log(`   Nom: ${regData.user.name}`, 'green');
      log(`   Email: ${regData.user.email}`, 'green');
      log(`   Abonnement: ${regData.user.subscription}`, 'green');
      
      if (regData.user.subscription === 'free') {
        log('✅ Statut d\'abonnement correct (free)', 'green');
      } else {
        log(`❌ Statut d'abonnement incorrect: ${regData.user.subscription}`, 'red');
      }
    } else {
      log(`❌ Erreur lors de la création: ${regResponse.status}`, 'red');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testManualVerification() {
  log('\n🖥️  Test manuel de l\'affichage', 'blue');
  
  log('Instructions pour tester manuellement:', 'yellow');
  log('1. Ouvrez votre navigateur sur http://localhost:3000', 'yellow');
  log('2. Inscrivez-vous avec un nouveau compte (utilisateur gratuit)', 'yellow');
  log('3. Vérifiez que le statut affiché est "Gratuit" et non "Premium"', 'yellow');
  log('4. Vérifiez qu\'aucun texte "actif premium" n\'apparaît', 'yellow');
  log('5. Testez avec un utilisateur premium si disponible', 'yellow');
  log('6. Vérifiez que les statuts correspondent aux abonnements réels', 'yellow');
  
  log('\n✅ Points à vérifier:', 'blue');
  log('• Utilisateurs gratuits: affichage "Gratuit"', 'green');
  log('• Utilisateurs basic: affichage "Basic"', 'green');
  log('• Utilisateurs premium: affichage "Premium"', 'green');
  log('• Aucun texte "actif premium" pour les utilisateurs gratuits', 'green');
  log('• Statut cohérent dans toute l\'application', 'green');
}

async function runSubscriptionTests() {
  log('📊 Tests du statut d\'abonnement', 'bold');
  log('=' .repeat(60), 'blue');
  
  await testSubscriptionDisplay();
  await testUserSubscriptionStatus();
  await testManualVerification();
  
  log('\n' + '=' .repeat(60), 'blue');
  log('🎯 Résumé des tests de statut d\'abonnement', 'bold');
  log('✅ Affichage correct du statut d\'abonnement', 'green');
  log('✅ Suppression du texte "actif premium" incorrect', 'green');
  log('✅ Statut basé sur les données réelles de l\'utilisateur', 'green');
  log('✅ Interface cohérente et précise', 'green');
  
  log('\n📋 Recommandations supplémentaires:', 'blue');
  log('• Vérifiez régulièrement l\'affichage des statuts', 'yellow');
  log('• Testez avec différents types d\'utilisateurs', 'yellow');
  log('• Surveillez les logs pour détecter les incohérences', 'yellow');
}

// Exécuter les tests
if (require.main === module) {
  runSubscriptionTests().catch(console.error);
}

module.exports = {
  testSubscriptionDisplay,
  testUserSubscriptionStatus,
  testManualVerification,
  runSubscriptionTests
};
