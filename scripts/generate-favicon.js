const fs = require('fs');
const path = require('path');

// Créer un favicon SVG simple
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <style>
      .background { fill: #000000; }
      .circle { fill: #7FFF00; }
    </style>
  </defs>
  <rect class="background" width="32" height="32" rx="4"/>
  <circle class="circle" cx="16" cy="16" r="12"/>
</svg>`;

// Écrire le fichier SVG
fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);

console.log('Favicon SVG créé avec succès !');
console.log('Pour créer un favicon ICO, vous pouvez utiliser un outil en ligne ou un convertisseur.'); 