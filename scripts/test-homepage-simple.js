const https = require('https');

console.log('🧪 Test simple de la page d\'accueil...\n');

function testHomepage() {
  return new Promise((resolve, reject) => {
    const req = https.get('https://proprioadvisor.fr/', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      const statusCode = res.statusCode;
      
      if (statusCode >= 200 && statusCode < 300) {
        resolve({
          statusCode,
          headers: res.headers
        });
      } else if (statusCode >= 300 && statusCode < 400) {
        const location = res.headers.location;
        reject(new Error(`Redirection ${statusCode} vers ${location}`));
      } else {
        reject(new Error(`Erreur HTTP ${statusCode}`));
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function runTest() {
  try {
    console.log('📋 Test de https://proprioadvisor.fr/:');
    const result = await testHomepage();
    console.log(`   ✅ Succès: ${result.statusCode}`);
    console.log(`   📍 Content-Type: ${result.headers['content-type']}`);
    console.log('\n🎉 La page d\'accueil fonctionne correctement !');
  } catch (error) {
    console.log(`   ❌ Erreur: ${error.message}`);
    console.log('\n💡 Le problème de redirection persiste.');
  }
}

runTest();
