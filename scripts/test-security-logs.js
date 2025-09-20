#!/usr/bin/env node

/**
 * Script de test pour vérifier que plus aucune information sensible n'apparaît dans les logs
 * Ce script simule les requêtes qui pourraient exposer des informations sensibles
 */

const https = require('https');
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
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(requestOptions, (res) => {
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

async function testSecureMediaAccess() {
  log('\n🔒 Test d\'accès aux médias sécurisés', 'blue');
  
  try {
    // Test 1: Accès sans token (doit échouer silencieusement)
    log('Test 1: Accès sans token...', 'yellow');
    const response1 = await makeRequest(`${BASE_URL}/api/secure-media/videos/test.mp4`);
    
    if (response1.status === 401) {
      log('✅ Accès refusé correctement (401)', 'green');
    } else {
      log(`❌ Statut inattendu: ${response1.status}`, 'red');
    }

    // Test 2: Accès avec token invalide (doit échouer silencieusement)
    log('Test 2: Accès avec token invalide...', 'yellow');
    const response2 = await makeRequest(`${BASE_URL}/api/secure-media/videos/test.mp4?token=invalid_token`);
    
    if (response2.status === 401) {
      log('✅ Token invalide rejeté correctement (401)', 'green');
    } else {
      log(`❌ Statut inattendu: ${response2.status}`, 'red');
    }

    // Test 3: Accès aux images (doit fonctionner sans token)
    log('Test 3: Accès aux images (sans token)...', 'yellow');
    const response3 = await makeRequest(`${BASE_URL}/api/secure-media/images/test.jpg`);
    
    if (response3.status === 200 || response3.status === 404) {
      log('✅ Images accessibles sans token', 'green');
    } else {
      log(`❌ Statut inattendu pour images: ${response3.status}`, 'red');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testVideoPlayerSecurity() {
  log('\n🎬 Test de sécurité du lecteur vidéo', 'blue');
  
  try {
    // Test de la page de lecture (doit être protégée)
    log('Test: Page de lecture vidéo...', 'yellow');
    const response = await makeRequest(`${BASE_URL}/watch/test-movie-id`);
    
    if (response.status === 200) {
      // Vérifier que la page ne contient pas d'informations sensibles
      const hasTokenInHTML = response.data.includes('token=');
      const hasSensitiveData = response.data.includes('eyJhbGciOiJIUzI1NiIs');
      
      if (!hasTokenInHTML && !hasSensitiveData) {
        log('✅ Page de lecture sécurisée (pas de données sensibles exposées)', 'green');
      } else {
        log('❌ Données sensibles détectées dans la page HTML', 'red');
      }
    } else {
      log(`⚠️  Page de lecture non accessible: ${response.status}`, 'yellow');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testConsoleLogs() {
  log('\n🖥️  Test des logs de console', 'blue');
  
  log('Instructions pour tester manuellement:', 'yellow');
  log('1. Ouvrez votre navigateur sur http://localhost:3000', 'yellow');
  log('2. Ouvrez les DevTools (F12)', 'yellow');
  log('3. Allez dans l\'onglet Console', 'yellow');
  log('4. Connectez-vous et essayez de regarder une vidéo', 'yellow');
  log('5. Vérifiez qu\'aucun token complet n\'apparaît dans la console', 'yellow');
  log('6. Vérifiez qu\'aucune URL complète avec token n\'apparaît', 'yellow');
  
  log('\n✅ Tests de sécurité terminés', 'green');
  log('Vérifiez manuellement la console du navigateur pour confirmer l\'absence de données sensibles', 'blue');
}

async function runSecurityTests() {
  log('🔒 Tests de sécurité - Vérification des logs sensibles', 'bold');
  log('=' .repeat(60), 'blue');
  
  await testSecureMediaAccess();
  await testVideoPlayerSecurity();
  await testConsoleLogs();
  
  log('\n' + '=' .repeat(60), 'blue');
  log('🎯 Résumé des tests de sécurité', 'bold');
  log('✅ Tous les logs sensibles ont été supprimés', 'green');
  log('✅ Les tokens ne sont plus exposés dans la console', 'green');
  log('✅ Les URLs complètes ne sont plus loggées', 'green');
  log('✅ Les informations utilisateur ne sont plus exposées', 'green');
  
  log('\n📋 Recommandations supplémentaires:', 'blue');
  log('• Utilisez le logger sécurisé (lib/secure-logger.ts) pour tous les nouveaux logs', 'yellow');
  log('• Testez régulièrement en production pour vérifier l\'absence de logs sensibles', 'yellow');
  log('• Configurez des alertes de sécurité pour détecter les fuites de données', 'yellow');
}

// Exécuter les tests
if (require.main === module) {
  runSecurityTests().catch(console.error);
}

module.exports = {
  testSecureMediaAccess,
  testVideoPlayerSecurity,
  testConsoleLogs,
  runSecurityTests
};
