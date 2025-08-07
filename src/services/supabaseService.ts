import { supabase } from "@/integrations/supabase/client";
import { Lead, Ville, Article, ImageFile, Avis, ContactMessage } from "@/types";

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
  { id: 'ménage', label: 'Ménage' },
  { id: 'blanchisserie', label: 'Blanchisserie' },
  { id: 'checkin', label: 'Check-in/Check-out' },
  { id: 'gestion-annonce', label: 'Gestion annonce' },
  { id: 'conciergerie-24-7', label: 'Conciergerie 24/7' },
  { id: 'chef-privé', label: 'Chef privé' }
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
      description: `Découvrez les meilleures conciergeries Airbnb à ${cityName}.`,
      titleSeo: `Meilleures conciergeries Airbnb à ${cityName} | ProprioAdvisor`,
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
