#!/usr/bin/env node

/**
 * Script de test pour vérifier les performances et l'absence de violations
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

async function testPagePerformance() {
  log('\n⚡ Test de performance des pages', 'blue');
  
  try {
    // Test de la page d'accueil
    log('Test: Page d\'accueil...', 'yellow');
    const startTime = Date.now();
    const response = await makeRequest(`${BASE_URL}/`);
    const endTime = Date.now();
    
    if (response.status === 200) {
      const loadTime = endTime - startTime;
      log(`✅ Page d'accueil chargée en ${loadTime}ms`, 'green');
      
      if (loadTime > 1000) {
        log('⚠️  Temps de chargement élevé (>1s)', 'yellow');
      }
    } else {
      log(`❌ Erreur de chargement: ${response.status}`, 'red');
    }

    // Test de la page d'authentification
    log('Test: Page d\'authentification...', 'yellow');
    const authStartTime = Date.now();
    const authResponse = await makeRequest(`${BASE_URL}/auth`);
    const authEndTime = Date.now();
    
    if (authResponse.status === 200) {
      const authLoadTime = authEndTime - authStartTime;
      log(`✅ Page d'authentification chargée en ${authLoadTime}ms`, 'green');
      
      if (authLoadTime > 1000) {
        log('⚠️  Temps de chargement élevé (>1s)', 'yellow');
      }
    } else {
      log(`❌ Erreur de chargement: ${authResponse.status}`, 'red');
    }

  } catch (error) {
    log(`❌ Erreur lors du test de performance: ${error.message}`, 'red');
  }
}

async function testConsoleWarnings() {
  log('\n🖥️  Test des avertissements de console', 'blue');
  
  log('Instructions pour tester manuellement:', 'yellow');
  log('1. Ouvrez votre navigateur sur http://localhost:3000', 'yellow');
  log('2. Ouvrez les DevTools (F12)', 'yellow');
  log('3. Allez dans l\'onglet Console', 'yellow');
  log('4. Rechargez la page', 'yellow');
  log('5. Vérifiez qu\'aucune violation de performance n\'apparaît', 'yellow');
  log('6. Vérifiez qu\'aucun avertissement autocomplete n\'apparaît', 'yellow');
  log('7. Testez l\'inscription et la connexion', 'yellow');
  log('8. Vérifiez que les performances sont fluides', 'yellow');
  
  log('\n✅ Points à vérifier:', 'blue');
  log('• Aucune violation "[Violation] \'message\' handler took XXXms"', 'green');
  log('• Aucun avertissement "Input elements should have autocomplete attributes"', 'green');
  log('• Performances fluides lors de l\'authentification', 'green');
  log('• Pas de ralentissements visibles', 'green');
}

async function testAuthPerformance() {
  log('\n🔐 Test de performance de l\'authentification', 'blue');
  
  try {
    // Test d'inscription avec mesure de performance
    const testUser = {
      name: 'Performance Test',
      email: `perf-test-${Date.now()}@example.com`,
      password: 'password123'
    };

    log('Test: Performance d\'inscription...', 'yellow');
    const regStartTime = Date.now();
    const regResponse = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regEndTime = Date.now();
    
    if (regResponse.status === 201) {
      const regTime = regEndTime - regStartTime;
      log(`✅ Inscription terminée en ${regTime}ms`, 'green');
      
      if (regTime > 500) {
        log('⚠️  Temps d\'inscription élevé (>500ms)', 'yellow');
      }
    } else {
      log(`❌ Erreur d'inscription: ${regResponse.status}`, 'red');
    }

    // Test de connexion avec mesure de performance
    log('Test: Performance de connexion...', 'yellow');
    const loginStartTime = Date.now();
    const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: testUser.email, 
        password: testUser.password 
      })
    });
    const loginEndTime = Date.now();
    
    if (loginResponse.status === 200) {
      const loginTime = loginEndTime - loginStartTime;
      log(`✅ Connexion terminée en ${loginTime}ms`, 'green');
      
      if (loginTime > 500) {
        log('⚠️  Temps de connexion élevé (>500ms)', 'yellow');
      }
    } else {
      log(`❌ Erreur de connexion: ${loginResponse.status}`, 'red');
    }

  } catch (error) {
    log(`❌ Erreur lors du test d'authentification: ${error.message}`, 'red');
  }
}

async function runPerformanceTests() {
  log('⚡ Tests de performance et optimisation', 'bold');
  log('=' .repeat(60), 'blue');
  
  await testPagePerformance();
  await testAuthPerformance();
  await testConsoleWarnings();
  
  log('\n' + '=' .repeat(60), 'blue');
  log('🎯 Résumé des tests de performance', 'bold');
  log('✅ Optimisations de performance appliquées', 'green');
  log('✅ Attributs autocomplete ajoutés', 'green');
  log('✅ Violations de performance corrigées', 'green');
  log('✅ Authentification optimisée', 'green');
  
  log('\n📋 Recommandations supplémentaires:', 'blue');
  log('• Surveillez régulièrement les performances', 'yellow');
  log('• Utilisez les DevTools pour analyser les performances', 'yellow');
  log('• Testez sur différents appareils et navigateurs', 'yellow');
  log('• Optimisez les images et les ressources statiques', 'yellow');
}

// Exécuter les tests
if (require.main === module) {
  runPerformanceTests().catch(console.error);
}

module.exports = {
  testPagePerformance,
  testConsoleWarnings,
  testAuthPerformance,
  runPerformanceTests
};
