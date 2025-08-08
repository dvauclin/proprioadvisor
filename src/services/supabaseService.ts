import { supabase } from "@/integrations/supabase/client";
import { Ville } from "@/types";

// Re-export services from other files
export * from './conciergerieService';
export * from './formuleService';
export * from './leadService';
export * from './villeService';
export * from './articleService';
export * from './avisService';
export * from './storageService';
export * from './contactService';
export * from './subscriptionService';

// Keep only core utility functions here
export const servicesOptions = [
  { id: 'mÃ©nage', label: 'MÃ©nage' },
  { id: 'blanchisserie', label: 'Blanchisserie' },
  { id: 'checkin', label: 'Check-in/Check-out' },
  { id: 'gestion-annonce', label: 'Gestion annonce' },
  { id: 'conciergerie-24-7', label: 'Conciergerie 24/7' },
  { id: 'chef-privÃ©', label: 'Chef privÃ©' }
];

export const propertyTypeOptions = [
  { id: 'standard', label: 'Standard' },
  { id: 'luxe', label: 'Luxe' },
  { id: 'tous', label: 'Tous types' }
];

export const addCities = async (cityNames: string[]): Promise<{ success: boolean; data?: Ville[]; error?: string }> => {
  try {
    const citiesToAdd = cityNames.map(cityName => ({
      nom: cityName,
      slug: cityName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      description: `DÃ©couvrez les meilleures conciergeries Airbnb Ã  ${cityName}.`,
      titleSeo: `Meilleures conciergeries Airbnb Ã  ${cityName} | ProprioAdvisor`,
    }));

    const { data, error } = await supabase
      .from('villes')
      .insert(citiesToAdd)
      .select();

    if (error) {
      console.error("Error adding cities:", error);
      return { success: false, error: error.message };
    }

    const transformedData = data.map(ville => ({
      id: ville.id,
      nom: ville.nom,
      description: ville.description || '',
      descriptionLongue: ville.description_longue || '',
      titleSeo: ville.title_seo || '',
      slug: ville.slug,
      latitude: ville.latitude,
      longitude: ville.longitude,
      villesLiees: ville.villes_liees || []
    }));

    return { success: true, data: transformedData };
  } catch (error) {
    console.error("Unexpected error adding cities:", error);
    return { success: false, error: String(error) };
  }
};

