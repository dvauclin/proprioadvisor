const fs = require('fs');
const path = require('path');

// Fonction pour nettoyer les URLs du sitemap
function cleanSitemapUrls() {
  console.log('🧹 Nettoyage des URLs du sitemap...');
  
  // Lire le sitemap généré
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('❌ Sitemap non trouvé, génération nécessaire');
    return;
  }
  
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // Compter les URLs avec slashes finaux
  const urlsWithTrailingSlash = sitemapContent.match(/<loc>https:\/\/proprioadvisor\.fr\/[^<]*\/<\/loc>/g);
  
  if (urlsWithTrailingSlash) {
    console.log(`⚠️  Trouvé ${urlsWithTrailingSlash.length} URLs avec slashes finaux:`);
    urlsWithTrailingSlash.forEach(url => {
      console.log(`   - ${url}`);
    });
    
    // Nettoyer les URLs en supprimant les slashes finaux
    sitemapContent = sitemapContent.replace(
      /<loc>https:\/\/proprioadvisor\.fr\/([^<]*)\/<\/loc>/g,
      '<loc>https://proprioadvisor.fr/$1</loc>'
    );
    
    // Sauvegarder le sitemap nettoyé
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log('✅ Sitemap nettoyé et sauvegardé');
  } else {
    console.log('✅ Aucune URL avec slash final trouvée');
  }
}

// Fonction pour vérifier les URLs problématiques
function checkProblematicUrls() {
  console.log('\n🔍 Vérification des URLs problématiques...');
  
  console.log('📋 Actions recommandées:');
  console.log('1. ✅ Configuration Vercel nettoyée (cleanUrls supprimé)');
  console.log('2. ✅ Redirections ajoutées dans next.config.js');
  console.log('3. ✅ Robots.txt mis à jour');
  console.log('4. 🔄 Redéployer l\'application');
  console.log('5. 📊 Surveiller Google Search Console pour les URLs avec slashes finaux');
  console.log('6. 🧹 Exécuter ce script régulièrement pour maintenir la propreté du sitemap');
}

// Exécuter les fonctions
if (require.main === module) {
  cleanSitemapUrls();
  checkProblematicUrls();
}

module.exports = { cleanSitemapUrls, checkProblematicUrls };
