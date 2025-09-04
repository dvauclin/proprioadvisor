#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Régénération des favicons...');

// Contenu SVG du favicon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <!-- Fond noir avec bordure -->
  <rect width="32" height="32" fill="#000000" rx="2"/>
  
  <!-- Cercle vert chartreuse centré -->
  <circle cx="16" cy="16" r="12" fill="#7FFF00"/>
</svg>`;

// Contenu HTML pour générer le favicon ICO
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Favicon Generator - ProprioAdvisor</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        canvas { border: 1px solid #ccc; margin: 10px 0; }
        button { padding: 10px 20px; background: #7FFF00; color: #000; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Générateur de Favicon ProprioAdvisor</h1>
    <canvas id="favicon" width="32" height="32"></canvas>
    <br>
    <button onclick="generateFavicon()">Télécharger favicon.ico</button>
    <button onclick="generateAppleTouchIcon()">Télécharger apple-touch-icon.png</button>
    
    <script>
        const canvas = document.getElementById('favicon');
        const ctx = canvas.getContext('2d');
        
        // Dessiner le favicon
        function drawFavicon() {
            // Fond noir
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, 32, 32);
            
            // Cercle vert chartreuse
            ctx.fillStyle = '#7FFF00';
            ctx.beginPath();
            ctx.arc(16, 16, 12, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        function generateFavicon() {
            drawFavicon();
            const link = document.createElement('a');
            link.download = 'favicon.ico';
            link.href = canvas.toDataURL('image/x-icon');
            link.click();
        }
        
        function generateAppleTouchIcon() {
            // Créer un canvas plus grand pour Apple Touch Icon
            const appleCanvas = document.createElement('canvas');
            appleCanvas.width = 180;
            appleCanvas.height = 180;
            const appleCtx = appleCanvas.getContext('2d');
            
            // Fond noir
            appleCtx.fillStyle = '#000000';
            appleCtx.fillRect(0, 0, 180, 180);
            
            // Cercle vert chartreuse
            appleCtx.fillStyle = '#7FFF00';
            appleCtx.beginPath();
            appleCtx.arc(90, 90, 68, 0, 2 * Math.PI);
            appleCtx.fill();
            
            const link = document.createElement('a');
            link.download = 'apple-touch-icon.png';
            link.href = appleCanvas.toDataURL('image/png');
            link.click();
        }
        
        // Dessiner au chargement
        drawFavicon();
    </script>
</body>
</html>`;

// Créer le dossier public s'il n'existe pas
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Écrire le fichier SVG
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
console.log('✅ favicon.svg créé');

// Écrire le fichier HTML générateur
fs.writeFileSync(path.join(publicDir, 'favicon-generator.html'), htmlContent);
console.log('✅ favicon-generator.html créé');

// Mettre à jour le manifest.json
const manifestContent = {
  "name": "ProprioAdvisor",
  "short_name": "ProprioAdvisor", 
  "description": "SEUL comparateur de conciergeries Airbnb",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#7FFF00",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/favicon.ico",
      "sizes": "16x16 32x32 48x48",
      "type": "image/x-icon"
    }
  ]
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifestContent, null, 2));
console.log('✅ manifest.json mis à jour');

console.log('\n🎉 Favicons régénérés avec succès !');
console.log('\n📝 Instructions :');
console.log('1. Ouvrez public/favicon-generator.html dans votre navigateur');
console.log('2. Cliquez sur "Télécharger favicon.ico" pour générer le fichier ICO');
console.log('3. Cliquez sur "Télécharger apple-touch-icon.png" pour l\'icône Apple');
console.log('4. Placez les fichiers téléchargés dans le dossier public/');
console.log('5. Redéployez votre site pour que les changements prennent effet');
console.log('\n💡 Pour forcer le rafraîchissement du cache :');
console.log('- Videz le cache de votre navigateur (Ctrl+Shift+R)');
console.log('- Utilisez un mode incognito pour tester');
console.log('- Attendez quelques minutes pour que les CDN se mettent à jour');
