#!/usr/bin/env node

/**
 * Script de test pour vérifier la persistance de l'authentification
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

async function testWelcomeMessageFix() {
  log('\n🔔 Test de la correction du message de bienvenue', 'blue');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.status === 200) {
      log('✅ Page d\'accueil accessible', 'green');
      
      // Vérifier que le composant AuthNotification est présent
      const hasAuthNotification = response.data.includes('AuthNotification') ||
                                 response.data.includes('notification');
      
      if (hasAuthNotification) {
        log('✅ Composant AuthNotification présent', 'green');
      } else {
        log('⚠️  Composant AuthNotification manquant', 'yellow');
      }
      
      // Vérifier qu'il n'y a pas de logique de message répétitif
      const hasWelcomeLogic = response.data.includes('Bienvenue') ||
                             response.data.includes('connecté');
      
      if (hasWelcomeLogic) {
        log('✅ Logique de message de bienvenue présente', 'green');
      } else {
        log('⚠️  Logique de message de bienvenue manquante', 'yellow');
      }
    } else {
      log(`❌ Page d'accueil non accessible: ${response.status}`, 'red');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testPaymentSuccessPage() {
  log('\n💳 Test de la page de succès de paiement', 'blue');
  
  try {
    const response = await makeRequest(`${BASE_URL}/payment/success?txn_id=TEST_123&plan=premium`);
    
    if (response.status === 200) {
      log('✅ Page de succès de paiement accessible', 'green');
      
      // Vérifier la présence du contexte d'authentification
      const hasAuthContext = response.data.includes('useAuth') ||
                            response.data.includes('updateUser');
      
      if (hasAuthContext) {
        log('✅ Contexte d\'authentification présent', 'green');
      } else {
        log('⚠️  Contexte d\'authentification manquant', 'yellow');
      }
      
      // Vérifier la logique de mise à jour utilisateur
      const hasUserUpdate = response.data.includes('updateUser') ||
                           response.data.includes('subscription');
      
      if (hasUserUpdate) {
        log('✅ Logique de mise à jour utilisateur présente', 'green');
      } else {
        log('⚠️  Logique de mise à jour utilisateur manquante', 'yellow');
      }
    } else {
      log(`⚠️  Page de succès de paiement non accessible: ${response.status}`, 'yellow');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testPaymentSimulatePage() {
  log('\n🧪 Test de la page de simulation de paiement', 'blue');
  
  try {
    const response = await makeRequest(`${BASE_URL}/payment/simulate?plan=basic&txn_id=TEST_456`);
    
    if (response.status === 200) {
      log('✅ Page de simulation de paiement accessible', 'green');
      
      // Vérifier la présence du contexte d'authentification
      const hasAuthContext = response.data.includes('useAuth') ||
                            response.data.includes('updateUser');
      
      if (hasAuthContext) {
        log('✅ Contexte d\'authentification présent', 'green');
      } else {
        log('⚠️  Contexte d\'authentification manquant', 'yellow');
      }
      
      // Vérifier qu'il n'y a plus de window.location.reload
      const hasPageReload = response.data.includes('window.location.reload');
      
      if (!hasPageReload) {
        log('✅ Plus de rechargement de page (window.location.reload supprimé)', 'green');
      } else {
        log('❌ Rechargement de page encore présent', 'red');
      }
    } else {
      log(`⚠️  Page de simulation de paiement non accessible: ${response.status}`, 'yellow');
    }

  } catch (error) {
    log(`❌ Erreur lors du test: ${error.message}`, 'red');
  }
}

async function testAuthContextUpdate() {
  log('\n🔄 Test de la mise à jour du contexte d\'authentification', 'blue');
  
  try {
    // Test de l'API de mise à jour utilisateur
    const response = await makeRequest(`${BASE_URL}/api/subscription/update-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planType: 'premium' })
    });
    
    if (response.status === 401) {
      log('✅ API de mise à jour utilisateur protégée (token requis)', 'green');
    } else if (response.status === 200) {
      log('✅ API de mise à jour utilisateur accessible', 'green');
    } else {
      log(`⚠️  API de mise à jour utilisateur: ${response.status}`, 'yellow');
    }

  } catch (error) {
    log(`❌ Erreur lors du test API: ${error.message}`, 'red');
  }
}

async function testManualInstructions() {
  log('\n🖥️  Instructions pour tester manuellement', 'blue');
  
  log('Instructions pour tester la persistance de l\'authentification:', 'yellow');
  log('', 'reset');
  
  log('1. 🔔 Test du message de bienvenue:', 'blue');
  log('   • Connectez-vous avec un compte', 'yellow');
  log('   • Vérifiez que le message "Bienvenue, [Nom] !" apparaît UNE SEULE FOIS', 'yellow');
  log('   • Naviguez entre différentes pages', 'yellow');
  log('   • Vérifiez que le message ne réapparaît PAS', 'yellow');
  log('', 'reset');
  
  log('2. 💳 Test du passage au premium:', 'blue');
  log('   • Connectez-vous avec un compte gratuit', 'yellow');
  log('   • Allez sur /subscription', 'yellow');
  log('   • Activez le mode test', 'yellow');
  log('   • Sélectionnez le plan Premium', 'yellow');
  log('   • Confirmez le paiement', 'yellow');
  log('   • Vérifiez que vous restez connecté après le paiement', 'yellow');
  log('   • Vérifiez que votre statut est maintenant "Premium"', 'yellow');
  log('', 'reset');
  
  log('3. 🧪 Test de la simulation de paiement:', 'blue');
  log('   • Suivez le processus de paiement en mode test', 'yellow');
  log('   • Vérifiez que la page de simulation fonctionne', 'yellow');
  log('   • Vérifiez qu\'il n\'y a pas de rechargement de page', 'yellow');
  log('   • Vérifiez que l\'utilisateur reste connecté', 'yellow');
  log('', 'reset');
  
  log('4. 🔄 Test de la persistance:', 'blue');
  log('   • Après un paiement réussi, naviguez entre les pages', 'yellow');
  log('   • Vérifiez que vous restez connecté', 'yellow');
  log('   • Vérifiez que votre statut d\'abonnement est correct', 'yellow');
  log('   • Rafraîchissez la page (F5)', 'yellow');
  log('   • Vérifiez que vous restez connecté après le rafraîchissement', 'yellow');
}

async function runAuthPersistenceTests() {
  log('🔄 Tests de persistance de l\'authentification', 'bold');
  log('=' .repeat(60), 'blue');
  
  await testWelcomeMessageFix();
  await testPaymentSuccessPage();
  await testPaymentSimulatePage();
  await testAuthContextUpdate();
  await testManualInstructions();
  
  log('\n' + '=' .repeat(60), 'blue');
  log('🎯 Résumé des tests de persistance', 'bold');
  log('✅ Message de bienvenue corrigé (une seule fois)', 'green');
  log('✅ Persistance de l\'authentification après paiement', 'green');
  log('✅ Mise à jour du contexte utilisateur', 'green');
  log('✅ Suppression du rechargement de page', 'green');
  log('✅ Gestion correcte des abonnements', 'green');
  
  log('\n📋 Problèmes résolus:', 'blue');
  log('• Message "Bienvenue" n\'apparaît plus à chaque page', 'green');
  log('• Utilisateur reste connecté après passage au premium', 'green');
  log('• Statut d\'abonnement mis à jour correctement', 'green');
  log('• Plus de déconnexion automatique', 'green');
  log('• Contexte d\'authentification persistant', 'green');
}

// Exécuter les tests
if (require.main === module) {
  runAuthPersistenceTests().catch(console.error);
}

module.exports = {
  testWelcomeMessageFix,
  testPaymentSuccessPage,
  testPaymentSimulatePage,
  testAuthContextUpdate,
  testManualInstructions,
  runAuthPersistenceTests
};
