
/**
 * Convertit un nom de conciergerie en slug URL-friendly
 */
export const createConciergerieSlug = (nom: string): string => {
  if (!nom) return '';
  
  return nom
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début et fin
};

/**
 * Trouve une conciergerie par son slug pour l'affichage en liste (avec filtre score > 0)
 */
export const findConciergerieBySlugForListing = (conciergeries: any[], slug: string) => {
  console.log("=== SLUG SEARCH FOR LISTING ===");
  console.log("Searching for slug:", slug);
  console.log("Total conciergeries:", conciergeries.length);
  
  const found = conciergeries.find(conciergerie => {
    const generatedSlug = createConciergerieSlug(conciergerie.nom);
    console.log(`Testing: "${conciergerie.nom}" -> slug: "${generatedSlug}" vs "${slug}" (score: ${conciergerie.score})`);
    return generatedSlug === slug && conciergerie.score > 0;
  });
  
  return found;
};

/**
 * Trouve une conciergerie par son slug pour l'accès direct (sans filtre score)
 */
export const findConciergerieBySlug = (conciergeries: any[], slug: string) => {
  console.log("=== SLUG SEARCH FOR DIRECT ACCESS ===");
  console.log("Searching for slug:", slug);
  console.log("Total conciergeries:", conciergeries.length);
  
  // Log des premiers éléments pour vérifier la structure
  console.log("Sample conciergeries:", conciergeries.slice(0, 3).map(c => ({
    nom: c.nom,
    id: c.id,
    score: c.score,
    validated: c.validated
  })));
  
  const found = conciergeries.find(conciergerie => {
    const generatedSlug = createConciergerieSlug(conciergerie.nom);
    console.log(`Testing: "${conciergerie.nom}" -> slug: "${generatedSlug}" vs "${slug}" (score: ${conciergerie.score})`);
    return generatedSlug === slug; // Pas de filtre sur le score pour l'accès direct
  });
  
  if (!found) {
    console.log("=== SLUG NOT FOUND - DEBUGGING ===");
    console.log("Available slugs:");
    conciergeries.forEach(c => {
      const generatedSlug = createConciergerieSlug(c.nom);
      console.log(`- "${c.nom}" -> "${generatedSlug}" (score: ${c.score}, validated: ${c.validated})`);
    });
  } else {
    console.log("Found conciergerie:", {
      nom: found.nom,
      id: found.id,
      score: found.score,
      validated: found.validated
    });
  }
  
  return found;
};

