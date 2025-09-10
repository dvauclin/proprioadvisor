import axios from 'axios';

const BASE_URL = 'https://proprioadvisor.fr';
const URLS_TO_TEST = [
  '/', // Page d'accueil
  '/conciergerie/paris', // Page de ville existante
  '/conciergerie/marseille', // Autre page de ville
  '/conciergerie-details/mana-conciergerie', // Page de détails (requiert une conciergerie avec ce slug)
  '/conciergerie/ville-qui-n-existe-pas' // Doit retourner les valeurs par défaut
];

// Couleurs pour la console
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const log = (color, message) => console.log(`${color}${message}${RESET}`);

const checkUrl = async (path) => {
  const url = `${BASE_URL}${path}`;
  log(BOLD, `\n--- Vérification de : ${url} ---`);

  try {
    const response = await axios.get(url, {
      // Simuler un bot pour s'assurer de déclencher la fonction de pré-rendu
      headers: {
        'User-Agent': 'ProprioAdvisor-Prerender-Checker/1.0'
      }
    });

    let allTestsPassed = true;

    // Test 1: Code de statut
    if (response.status === 200) {
      log(GREEN, `✅ [OK] Le code de statut est 200`);
    } else {
      log(RED, `❌ [ÉCHEC] Le code de statut est ${response.status} (attendu: 200)`);
      allTestsPassed = false;
    }

    const html = response.data;

    // Test 2: Titre dynamique
    if (!html.includes('__META_TITLE__')) {
      log(GREEN, `✅ [OK] Le titre a bien été remplacé.`);
    } else {
      log(RED, `❌ [ÉCHEC] Le placeholder __META_TITLE__ est toujours présent.`);
      allTestsPassed = false;
    }

    // Test 3: Description dynamique
    if (!html.includes('__META_DESCRIPTION__')) {
      log(GREEN, `✅ [OK] La description a bien été remplacée.`);
    } else {
      log(RED, `❌ [ÉCHEC] Le placeholder __META_DESCRIPTION__ est toujours présent.`);
      allTestsPassed = false;
    }
    
    // Test 4: En-tête Cache-Control
    const cacheHeader = response.headers['cache-control'];
    if (cacheHeader) {
      log(GREEN, `✅ [OK] En-tête Cache-Control trouvé : "${cacheHeader}"`);
    } else {
      log(YELLOW, `⚠️ [AVERTISSEMENT] L'en-tête Cache-Control est manquant.`);
    }
    
    return allTestsPassed;

  } catch (error) {
    log(RED, `❌ [ÉCHEC] La requête a échoué pour ${url}: ${error.message}`);
    if (error.response) {
      console.log(`   Statut: ${error.response.status}`);
    }
    return false;
  }
};

const runTests = async () => {
  console.log(`${BOLD}Lancement du script de vérification du pré-rendu...${RESET}`);
  let failedTests = 0;

  for (const path of URLS_TO_TEST) {
    const success = await checkUrl(path);
    if (!success) {
      failedTests++;
    }
  }

  console.log('\n--- Résumé des tests ---');
  if (failedTests === 0) {
    log(GREEN, `🎉 Les ${URLS_TO_TEST.length} URLs ont passé tous les tests avec succès !`);
    process.exit(0);
  } else {
    log(RED, `🔥 ${failedTests} des ${URLS_TO_TEST.length} URLs ont échoué.`);
    process.exit(1); // Quitte avec un code d'erreur pour les intégrations CI/CD
  }
};

runTests();
