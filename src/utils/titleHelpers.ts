
export const generateConciergerieListingTitle = (villeNom: string): string => {
  const now = new Date();
  const mois = now.toLocaleDateString('fr-FR', { month: 'long' });
  const annee = now.getFullYear();
  
  // Capitaliser la premiÃ¨re lettre du mois
  const moisCapitalise = mois.charAt(0).toUpperCase() + mois.slice(1);
  
  return `Comparatif Conciergeries Airbnb ${villeNom} | ${moisCapitalise} ${annee}`;
};

