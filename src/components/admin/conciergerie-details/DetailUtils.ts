import { supabase } from "@/integrations/supabase/client";
import { Formule } from "@/types";

// Helper function to properly convert numeric values
const formatNumericValue = (value: any): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

export const fetchFormulesById = async (conciergerieId: string): Promise<Formule[]> => {
  console.log("RÃ©cupÃ©ration des formules pour la conciergerie ID:", conciergerieId);
  
  try {
    // First get all formules to understand what might be wrong
    const { data: allFormules } = await supabase
      .from("formules")
      .select("id, conciergerie_id, nom")
      .limit(5);
    
    console.log("Total de 20 formules dans la base");
    console.log("Ã‰chantillon des formules disponibles:", allFormules?.map(f => ({
      conciergerieId: f.conciergerie_id,
      formuleId: f.id,
      nomFormule: f.nom
    })));
      
    // Fetch formules for this specific conciergerie
    const { data: formules, error } = await supabase
      .from("formules")
      .select("*")
      .eq("conciergerie_id", conciergerieId);

    if (error) {
      console.error("Erreur lors de la rÃ©cupÃ©ration des formules:", error);
      return [];
    }

    console.log(`âœ… ${formules?.length || 0} formules trouvÃ©es via requÃªte directe pour ID: ${conciergerieId}`);
    
    if (!formules || formules.length === 0) {
      return [];
    }
    
    console.log("Normalisation de", formules.length, "formules");
    
    // Format each formule correctly
    const normalizedFormules = formules.map(formule => {
      // Function to check and convert string values to valid enum values or use default
      const ensureValidLocationLinge = (value: string | null | undefined): 'inclus' | 'optionnel' | 'obligatoire' => {
        if (!value) return 'inclus';
        if (value === 'optionnel' || value === 'obligatoire' || value === 'inclus') {
          return value;
        }
        return 'inclus';
      };
      
      const ensureValidFraisReappro = (value: string | null | undefined): 'reel' | 'forfait' | 'inclus' => {
        if (!value) return 'inclus';
        if (value === 'reel' || value === 'forfait' || value === 'inclus') {
          return value;
        }
        return 'inclus';
      };

      const result: Formule = {
        id: formule.id,
        conciergerieId: formule.conciergerie_id,
        nom: formule.nom,
        commission: formatNumericValue(formule.commission),
        dureeGestionMin: formatNumericValue(formule.duree_gestion_min),
        fraisDemarrage: formatNumericValue(formule.frais_demarrage),
        abonnementMensuel: formatNumericValue(formule.abonnement_mensuel),
        fraisMenageHeure: formatNumericValue(formule.frais_menage_heure),
        servicesInclus: formule.services_inclus || [],
        locationLinge: ensureValidLocationLinge(formule.location_linge),
        fraisReapprovisionnement: ensureValidFraisReappro(formule.frais_reapprovisionnement),
        prixLocationLinge: formatNumericValue(formule.prix_location_linge),
        fraisSupplementaireLocation: formatNumericValue(formule.frais_supplementaire_location),
        forfaitReapprovisionnement: formatNumericValue(formule.forfait_reapprovisionnement),
        createdAt: formule.created_at || new Date().toISOString()
      };
      
      console.log(`Formule normalisÃ©e: ${formule.nom}, ID: ${formule.id}, ConciergerieID: ${formule.conciergerie_id}`);
      console.log(`locationLinge: "${formule.location_linge}" â†’ "${result.locationLinge}"`);
      console.log(`fraisReapprovisionnement: "${formule.frais_reapprovisionnement}" â†’ "${result.fraisReapprovisionnement}"`);
      
      return result;
    });
    
    return normalizedFormules;
  } catch (error) {
    console.error("Erreur lors de la rÃ©cupÃ©ration des formules:", error);
    return [];
  }
};

// Get the user-friendly labels for the different option types
export const getPropertyTypeLabel = (type: string): string => {
  switch (type) {
    case 'standard': return 'Standard / Milieu de gamme';
    case 'luxe': return 'Haut de gamme / Luxe';
    case 'tous': return 'Tous types de biens';
    default: return type;
  }
};

export const getDeductionFraisLabel = (type: string): string => {
  switch (type) {
    case 'deductTous': return 'Les frais sont dÃ©duits de tous les loyers';
    case 'deductPremier': return 'Les frais sont dÃ©duits du premier loyer';
    case 'nonDeduct': return 'Les frais ne sont pas dÃ©duits des loyers';
    default: return type;
  }
};

export const getFraisReapprovisionnementLabel = (type: string): string => {
  switch (type) {
    case 'reel': return 'CoÃ»t rÃ©el';
    case 'forfait': return 'Forfait mensuel';
    case 'inclus': return 'Inclus';
    default: return type;
  }
};

export const getLocationLingeLabel = (type: string): string => {
  switch (type) {
    case 'optionnel': return 'Optionnel';
    case 'obligatoire': return 'Obligatoire';
    case 'inclus': return 'Inclus';
    default: return type;
  }
};

