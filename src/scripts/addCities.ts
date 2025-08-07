import { addCities } from "@/services/supabaseService";

// Liste des villes à ajouter - déjà présente dans le fichier
const cities = [
  "Aix-en-Provence",
  "Aix-les-Bains",
  "Annecy",
  "Antibes",
  "Biarritz",
  "Bordeaux",
  "Cannes",
  "Clermont-Ferrand",
  "Dijon",
  "Fontainebleau",
  "Grenoble",
  "La Rochelle",
  "Lille",
  "Lyon",
  "Marseille",
  "Metz",
  "Montauban",
  "Montpellier",
  "Montreuil",
  "Nantes",
  "Nice",
  "Paris",
  "Rennes",
  "Saint-Denis",
  "Sanary-sur-Mer",
  "Strasbourg",
  "Toulon",
  "Toulouse",
  "Versailles"
];

// Fonction pour ajouter les villes
export const populateCities = async () => {
  console.log("Starting to add cities...");
  
  try {
    const result = await addCities(cities);
    
    if (result.success) {
      console.log("Successfully added all cities!");
      return result;
    } else {
      console.error("Error adding cities:", result.error);
      return result;
    }
  } catch (error) {
    console.error("Exception when adding cities:", error);
    return { success: false, error: String(error) };
  }
};

// Ajout d'une fonction pour exécuter le script directement
if (typeof window !== 'undefined') {
  const addCitiesButton = document.getElementById('add-cities-button');
  if (addCitiesButton) {
    addCitiesButton.addEventListener('click', async () => {
      try {
        const result = await populateCities();
        if (result.success) {
          alert("Les villes ont été ajoutées avec succès !");
        } else {
          alert("Erreur lors de l'ajout des villes : " + result.error);
        }
      } catch (error) {
        console.error("Erreur lors de l'exécution du script :", error);
        alert("Une erreur est survenue lors de l'ajout des villes");
      }
    });
  }
}
