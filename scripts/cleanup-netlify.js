const fs = require('fs');
const path = require('path');

console.log('🧹 Nettoyage des fichiers Netlify pour migration vers Vercel...\n');

const filesToRemove = [
  'netlify/functions/prerender.ts',
  'netlify/functions/sitemap.ts',
  'netlify/functions/sitemap-pages.ts',
  'netlify/functions/sitemap-villes.ts',
  'netlify/functions/sitemap-conciergeries.ts',
  'netlify/functions/prerender-utils/',
  'netlify.toml',
  'public/_redirects'
];

const dirsToRemove = [
  'netlify/functions/prerender-utils',
  'netlify/functions'
];

console.log('📋 Fichiers et dossiers à supprimer :');
filesToRemove.forEach(file => {
  console.log(`   - ${file}`);
});

console.log('\n⚠️  ATTENTION : Ces fichiers sont spécifiques à Netlify et ne sont pas nécessaires pour Vercel.');
console.log('   Votre site utilise déjà les API routes Next.js pour les sitemaps.');
console.log('   Next.js gère automatiquement le pré-rendu sans besoin de fonctions Netlify.\n');

console.log('✅ Actions recommandées :');
console.log('   1. Supprimer le dossier netlify/ complet');
console.log('   2. Supprimer netlify.toml');
console.log('   3. Supprimer public/_redirects');
console.log('   4. Retirer @netlify/functions des dépendances');
console.log('   5. Configurer les variables d\'environnement sur Vercel\n');

console.log('🔧 Commandes pour nettoyer :');
console.log('   rm -rf netlify/');
console.log('   rm netlify.toml');
console.log('   rm public/_redirects');
console.log('   npm uninstall @netlify/functions');
