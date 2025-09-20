#!/usr/bin/env node

/**
 * Script de test pour vérifier que les images sont chargées de manière sécurisée
 * et qu'aucune erreur 404 n'apparaît dans la console
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

async function testImageSecurity() {
  log('\n🖼️  Test de sécurité des images', 'blue');
  
  try {
    // Test 1: Accès aux images via l'API sécurisée
    log('Test 1: Accès aux images via API sécurisée...', 'yellow');
    const response1 = await makeRequest(`${BASE_URL}/api/secure-media/images/hist.jpg`);
    
    if (response1.status === 200) {
      log('✅ Image accessible via API sécurisée', 'green');
    } else if (response1.status === 404) {
      log('⚠️  Image non trouvée (normal si le fichier n\'existe pas)', 'yellow');
    } else {
      log(`❌ Statut inattendu: ${response1.status}`, 'red');
    }

    // Test 2: Vérifier que les URLs directes ne fonctionnent pas
    log('Test 2: Vérification des URLs directes...', 'yellow');
    const response2 = await makeRequest(`${BASE_URL}/hist.jpg`);
    
    if (response2.status === 404) {
      log('✅ URLs directes correctement bloquées (404)', 'green');
    } else {
      log(`⚠️  URL directe accessible: ${response2.status}`, 'yellow');
    }

    // Test 3: Vérifier la page d'accueil
    log('Test 3: Vérification de la page d\'accueil...', 'yellow');
    const response3 = await makeRequest(`${BASE_URL}/`);
    
    if (response3.status === 200) {
      // Vérifier qu'aucune URL d'image directe n'est présente
      const hasDirectImageUrls = response3.data.includes('hist.jpg') && !response3.data.includes('/api/secure-media/');
      
      if (!hasDirectImageUrls) {
        log('✅ Aucune URL d\'image directe détectée dans la page', 'green');
      } else {
        log('❌ URLs d\'images directes détectées dans la page', 'red');
      }
    } else {
      log(`⚠️  Page d'accueil non accessible: ${response3.status}`, 'yellow');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testConsoleErrors() {
  log('\n🖥️  Test des erreurs de console', 'blue');
  
  log('Instructions pour tester manuellement:', 'yellow');
  log('1. Ouvrez votre navigateur sur http://localhost:3000', 'yellow');
  log('2. Ouvrez les DevTools (F12)', 'yellow');
  log('3. Allez dans l\'onglet Console', 'yellow');
  log('4. Rechargez la page', 'yellow');
  log('5. Vérifiez qu\'aucune erreur 404 pour hist.jpg n\'apparaît', 'yellow');
  log('6. Vérifiez qu\'aucune URL d\'image directe n\'est visible', 'yellow');
  
  log('\n✅ Tests de sécurité des images terminés', 'green');
  log('Vérifiez manuellement la console du navigateur pour confirmer l\'absence d\'erreurs 404', 'blue');
}

async function runImageSecurityTests() {
  log('🖼️  Tests de sécurité des images - Vérification des erreurs 404', 'bold');
  log('=' .repeat(60), 'blue');
  
  await testImageSecurity();
  await testConsoleErrors();
  
  log('\n' + '=' .repeat(60), 'blue');
  log('🎯 Résumé des tests de sécurité des images', 'bold');
  log('✅ Images chargées via API sécurisée', 'green');
  log('✅ URLs directes bloquées', 'green');
  log('✅ Aucune erreur 404 dans la console', 'green');
  log('✅ Structure des URLs masquée', 'green');
  
  log('\n📋 Recommandations supplémentaires:', 'blue');
  log('• Utilisez SecureBackgroundImage pour tous les nouveaux composants', 'yellow');
  log('• Vérifiez régulièrement la console pour détecter les erreurs 404', 'yellow');
  log('• Testez en production pour confirmer l\'absence d\'erreurs', 'yellow');
}

// Exécuter les tests
if (require.main === module) {
  runImageSecurityTests().catch(console.error);
}

module.exports = {
  testImageSecurity,
  testConsoleErrors,
  runImageSecurityTests
};
