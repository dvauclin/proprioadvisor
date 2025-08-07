const https = require('https');
const http = require('http');

const BASE_URLS = {
  local: 'http://localhost:3000',
  production: 'https://proprioadvisor.fr'
};

const sitemapUrls = [
  '/api/sitemap',
  '/api/sitemap/pages',
  '/api/sitemap/villes',
  '/api/sitemap/conciergeries',
  '/sitemap.xml',
  '/sitemap-pages.xml',
  '/sitemap-villes.xml',
  '/sitemap-conciergeries.xml'
];

async function testUrl(url, environment) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URLS[environment]}${url}`;
    const client = environment === 'local' ? http : https;
    
    console.log(`🔍 Test: ${fullUrl}`);
    
    const req = client.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const isXml = res.headers['content-type']?.includes('xml');
        const hasContent = data.length > 0;
        const status = res.statusCode;
        
        console.log(`   📊 Status: ${status}`);
        console.log(`   📄 Content-Type: ${res.headers['content-type'] || 'N/A'}`);
        console.log(`   📏 Taille: ${data.length} caractères`);
        console.log(`   ✅ XML: ${isXml ? 'Oui' : 'Non'}`);
        console.log(`   📝 Contenu: ${hasContent ? 'Présent' : 'Vide'}`);
        
        if (data.includes('<?xml')) {
          console.log(`   🎯 Sitemap XML valide`);
        } else if (data.includes('urlset') || data.includes('sitemapindex')) {
          console.log(`   🎯 Sitemap XML valide (sans déclaration)`);
        } else {
          console.log(`   ❌ Pas de XML détecté`);
        }
        
        console.log('');
        resolve({ status, isXml, hasContent, data });
      });
    });
    
    req.on('error', (err) => {
      console.log(`   ❌ Erreur: ${err.message}`);
      console.log('');
      resolve({ error: err.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`   ⏰ Timeout`);
      console.log('');
      resolve({ error: 'Timeout' });
    });
  });
}

async function runTests() {
  console.log('🧪 Test des sitemaps après nettoyage Netlify\n');
  
  for (const environment of ['local', 'production']) {
    console.log(`🌍 === ENVIRONNEMENT: ${environment.toUpperCase()} ===`);
    console.log('');
    
    for (const url of sitemapUrls) {
      await testUrl(url, environment);
    }
    
    console.log('─'.repeat(50));
    console.log('');
  }
  
  console.log('✅ Tests terminés !');
  console.log('\n📋 Résumé :');
  console.log('   - Les API routes Next.js (/api/sitemap/*) doivent fonctionner');
  console.log('   - Les URLs traditionnelles (/sitemap*.xml) doivent rediriger vers les API routes');
  console.log('   - Tous les sitemaps doivent retourner du XML valide');
}

runTests().catch(console.error);
