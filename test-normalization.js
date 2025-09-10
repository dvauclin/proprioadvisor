// Test de la fonction de normalisation
function normalizeForSearch(str) {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[-]/g, '') // Supprime les tirets
    .replace(/\s+/g, '') // Supprime tous les espaces
    .trim();
}

// Test avec les exemples donnés
const testCases = [
  { search: 'aix en', ville: 'Aix-en-Provence' },
  { search: 'paris', ville: 'Paris' },
  { search: 'lyon', ville: 'Lyon' },
  { search: 'marseille', ville: 'Marseille' },
  { search: 'toulouse', ville: 'Toulouse' },
  { search: 'nice', ville: 'Nice' },
  { search: 'nantes', ville: 'Nantes' },
  { search: 'strasbourg', ville: 'Strasbourg' },
  { search: 'montpellier', ville: 'Montpellier' },
  { search: 'bordeaux', ville: 'Bordeaux' },
  { search: 'lille', ville: 'Lille' },
  { search: 'rennes', ville: 'Rennes' },
  { search: 'reims', ville: 'Reims' },
  { search: 'saint etienne', ville: 'Saint-Étienne' },
  { search: 'toulon', ville: 'Toulon' },
  { search: 'le havre', ville: 'Le Havre' },
  { search: 'grenoble', ville: 'Grenoble' },
  { search: 'dijon', ville: 'Dijon' },
  { search: 'angers', ville: 'Angers' },
  { search: 'villeurbanne', ville: 'Villeurbanne' }
];

console.log('=== Test de la fonction de normalisation ===\n');

testCases.forEach(({ search, ville }) => {
  const normalizedSearch = normalizeForSearch(search);
  const normalizedVille = normalizeForSearch(ville);
  const matches = normalizedVille.includes(normalizedSearch);
  
  console.log(`Recherche: "${search}" -> "${normalizedSearch}"`);
  console.log(`Ville: "${ville}" -> "${normalizedVille}"`);
  console.log(`Match: ${matches ? '✅' : '❌'}`);
  console.log('---');
});

// Test spécifique pour Aix-en-Provence
console.log('\n=== Test spécifique pour Aix-en-Provence ===');
const aixSearch = 'aix en';
const aixVille = 'Aix-en-Provence';
const normalizedAixSearch = normalizeForSearch(aixSearch);
const normalizedAixVille = normalizeForSearch(aixVille);

console.log(`Recherche: "${aixSearch}" -> "${normalizedAixSearch}"`);
console.log(`Ville: "${aixVille}" -> "${normalizedAixVille}"`);
console.log(`Match: ${normalizedAixVille.includes(normalizedAixSearch) ? '✅' : '❌'}`);
