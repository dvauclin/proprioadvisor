import { supabase } from "@/integrations/supabase/client";
import { Ville } from "@/types";

// Cache simple en mémoire pour éviter les requêtes répétées
let villesCache: Ville[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Type optimisé pour l'inscription (seulement les champs nécessaires)
export interface VilleForInscription {
  id: string;
  nom: string;
  departementNumero?: string;
  departementNom?: string;
}

/**
 * Version optimisée pour l'inscription - ne récupère que les champs essentiels
 */
export const getVillesForInscription = async (): Promise<VilleForInscription[]> => {
  console.log("🚀 getVillesForInscription: Starting optimized query...");
  
  try {
    const { data, error } = await supabase
      .from('villes')
      .select('id, nom, departement_numero, departement_nom') // Seulement les champs nécessaires
      .order('departement_numero', { ascending: true })
      .order('nom', { ascending: true });
    
    if (error) {
      console.error("❌ getVillesForInscription: Error fetching villes:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn("⚠️ getVillesForInscription: No villes found");
      return [];
    }
    
    const transformedData = data.map(ville => ({
      id: ville.id,
      nom: ville.nom,
      departementNumero: ville.departement_numero || '',
      departementNom: ville.departement_nom || ''
    }));

    console.log("✅ getVillesForInscription: Successfully fetched", data.length, "villes");
    return transformedData;
  } catch (error) {
    console.error("❌ getVillesForInscription: Unexpected error:", error);
    return [];
  }
};

/**
 * Version avec cache pour les autres usages
 */
export const getAllVillesCached = async (): Promise<Ville[]> => {
  const now = Date.now();
  
  // Vérifier si le cache est encore valide
  if (villesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log("📦 getAllVillesCached: Using cached data");
    return villesCache;
  }
  
  console.log("🔄 getAllVillesCached: Fetching fresh data...");
  
  try {
    const { data, error } = await supabase
      .from('villes')
      .select('*')
      .order('nom', { ascending: true });
    
    if (error) {
      console.error("❌ getAllVillesCached: Error fetching villes:", error);
      return villesCache || []; // Retourner le cache si disponible
    }
    
    if (!data || data.length === 0) {
      console.warn("⚠️ getAllVillesCached: No villes found");
      return villesCache || [];
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
      departementNumero: ville.departement_numero || '',
      departementNom: ville.departement_nom || '',
      villeMereId: ville.ville_mere_id || undefined,
      villesLiees: ville.villes_liees || [],
      createdAt: ville.created_at || undefined
    }));

    // Mettre à jour le cache
    villesCache = transformedData;
    cacheTimestamp = now;
    
    console.log("✅ getAllVillesCached: Successfully fetched and cached", data.length, "villes");
    return transformedData;
  } catch (error) {
    console.error("❌ getAllVillesCached: Unexpected error:", error);
    return villesCache || [];
  }
};

/**
 * Invalider le cache (utile après des modifications)
 */
export const invalidateVillesCache = (): void => {
  villesCache = null;
  cacheTimestamp = 0;
  console.log("🗑️ invalidateVillesCache: Cache cleared");
};

/**
 * Recherche optimisée avec debouncing
 */
export const searchVilles = (villes: VilleForInscription[], searchTerm: string): VilleForInscription[] => {
  if (!searchTerm.trim()) {
    return villes;
  }
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  
  return villes.filter(ville => {
    const normalizedVilleName = ville.nom.toLowerCase();
    const normalizedDepartementNom = ville.departementNom?.toLowerCase() || '';
    
    return normalizedVilleName.includes(normalizedSearch) ||
           (ville.departementNumero && ville.departementNumero.includes(searchTerm)) ||
           normalizedDepartementNom.includes(normalizedSearch);
  });
};

// Garder les fonctions existantes pour la compatibilité
export const getAllVilles = getAllVillesCached;
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
