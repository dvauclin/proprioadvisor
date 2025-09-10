#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Nettoyage du cache favicon...');

// Fonction pour ajouter un timestamp aux fichiers
function addTimestampToFile(filePath) {
    if (fs.existsSync(filePath)) {
        const timestamp = Date.now();
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        const dir = path.dirname(filePath);
        const newPath = path.join(dir, `${name}-${timestamp}${ext}`);
        
        fs.copyFileSync(filePath, newPath);
        console.log(`✅ Copie avec timestamp créée: ${path.basename(newPath)}`);
        return newPath;
    }
    return null;
}

// Fonction pour mettre à jour les références dans le layout
function updateLayoutWithTimestamp() {
    const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
    
    if (fs.existsSync(layoutPath)) {
        let content = fs.readFileSync(layoutPath, 'utf8');
        const timestamp = Date.now();
        
        // Remplacer les versions avec timestamp
        content = content.replace(
            /href="\/favicon\.svg\?v=\d+"/g,
            `href="/favicon.svg?v=${timestamp}"`
        );
        content = content.replace(
            /href="\/favicon\.ico\?v=\d+"/g,
            `href="/favicon.ico?v=${timestamp}"`
        );
        
        // Si pas de version existante, ajouter
        if (!content.includes('favicon.svg?v=')) {
            content = content.replace(
                'href="/favicon.svg"',
                `href="/favicon.svg?v=${timestamp}"`
            );
        }
        if (!content.includes('favicon.ico?v=')) {
            content = content.replace(
                'href="/favicon.ico"',
                `href="/favicon.ico?v=${timestamp}"`
            );
        }
        
        fs.writeFileSync(layoutPath, content);
        console.log(`✅ Layout mis à jour avec timestamp: ${timestamp}`);
    }
}

// Créer des copies avec timestamp
const publicDir = path.join(__dirname, '../public');
const faviconSvg = path.join(publicDir, 'favicon.svg');
const faviconIco = path.join(publicDir, 'favicon.ico');

addTimestampToFile(faviconSvg);
addTimestampToFile(faviconIco);

// Mettre à jour le layout
updateLayoutWithTimestamp();

console.log('\n🎉 Cache favicon nettoyé !');
console.log('\n📝 Actions effectuées :');
console.log('1. ✅ Fichiers favicon copiés avec timestamp');
console.log('2. ✅ Layout mis à jour avec nouveaux timestamps');
console.log('3. ✅ Cache busting activé');
console.log('\n💡 Prochaines étapes :');
console.log('1. Redéployez votre site');
console.log('2. Videz le cache de votre navigateur (Ctrl+Shift+R)');
console.log('3. Testez en mode incognito');
console.log('4. Vérifiez dans la Search Console après 24-48h');
