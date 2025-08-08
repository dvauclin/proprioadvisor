
import { supabase } from "@/integrations/supabase/client";
import { Ville } from "@/types";

export const getAllVilles = async (): Promise<Ville[]> => {
  console.log("ðŸ” getAllVilles: Starting Supabase query...");
  
  try {
    const { data, error } = await supabase
      .from('villes')
      .select('*')
      .order('nom', { ascending: true });
    
    console.log("ðŸ” getAllVilles: Supabase response:", { data, error });
    console.log("ðŸ” getAllVilles: Data length:", data?.length || 0);
    
    if (error) {
      console.error("âŒ getAllVilles: Error fetching villes:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn("âš ï¸ getAllVilles: No villes found in database");
      return [];
    }
    
    console.log("âœ… getAllVilles: Successfully fetched", data?.length || 0, "villes");
    
    const transformedData = data.map(ville => ({
      id: ville.id,
      nom: ville.nom,
      description: ville.description || '',
      descriptionLongue: ville.description_longue || '',
      titleSeo: ville.title_seo || '',
      slug: ville.slug,
      latitude: ville.latitude,
      longitude: ville.longitude,
      departementNumero: ville.departement_numero || '',
      departementNom: ville.departement_nom || '',
      villeMereId: ville.ville_mere_id || undefined,
      villesLiees: ville.villes_liees || [],
      createdAt: ville.created_at || undefined
    }));

    console.log("âœ… getAllVilles: Transformed data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("âŒ getAllVilles: Unexpected error fetching villes:", error);
    return [];
  }
};

export const getVilleBySlug = async (slug: string): Promise<Ville | null> => {
  try {
    const { data, error } = await supabase
      .from('villes')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Error fetching ville by slug:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom,
      description: data.description || '',
      descriptionLongue: data.description_longue || '',
      titleSeo: data.title_seo || '',
      slug: data.slug,
      latitude: data.latitude,
      longitude: data.longitude,
      departementNumero: data.departement_numero || '',
      departementNom: data.departement_nom || '',
      villeMereId: data.ville_mere_id || undefined,
      villesLiees: data.villes_liees || [],
      createdAt: data.created_at || undefined
    };
  } catch (error) {
    console.error("Unexpected error fetching ville by slug:", error);
    return null;
  }
};

export const addVille = async (ville: Omit<Ville, 'id'>): Promise<Ville> => {
  const { data, error } = await supabase
    .from('villes')
    .insert({
      nom: ville.nom,
      description: ville.description,
      description_longue: ville.descriptionLongue,
      title_seo: ville.titleSeo,
      slug: ville.slug,
      latitude: ville.latitude,
      longitude: ville.longitude,
      departement_numero: ville.departementNumero,
      departement_nom: ville.departementNom,
      ville_mere_id: ville.villeMereId,
      villes_liees: ville.villesLiees
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nom: data.nom,
    description: data.description || '',
    descriptionLongue: data.description_longue || '',
    titleSeo: data.title_seo || '',
    slug: data.slug,
    latitude: data.latitude,
    longitude: data.longitude,
    departementNumero: data.departement_numero || '',
    departementNom: data.departement_nom || '',
    villeMereId: data.ville_mere_id || undefined,
    villesLiees: data.villes_liees || [],
    createdAt: data.created_at || undefined
  };
};

export const updateVille = async (ville: Ville): Promise<Ville> => {
  const { data, error } = await supabase
    .from('villes')
    .update({
      nom: ville.nom,
      description: ville.description,
      description_longue: ville.descriptionLongue,
      title_seo: ville.titleSeo,
      slug: ville.slug,
      latitude: ville.latitude,
      longitude: ville.longitude,
      departement_numero: ville.departementNumero,
      departement_nom: ville.departementNom,
      ville_mere_id: ville.villeMereId,
      villes_liees: ville.villesLiees
    })
    .eq('id', ville.id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    nom: data.nom,
    description: data.description || '',
    descriptionLongue: data.description_longue || '',
    titleSeo: data.title_seo || '',
    slug: data.slug,
    latitude: data.latitude,
    longitude: data.longitude,
    departementNumero: data.departement_numero || '',
    departementNom: data.departement_nom || '',
    villeMereId: data.ville_mere_id || undefined,
    villesLiees: data.villes_liees || [],
    createdAt: data.created_at || undefined
  };
};

export const deleteVille = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('villes')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

