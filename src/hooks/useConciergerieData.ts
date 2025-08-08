import { useState, useEffect } from "react";
import { getVilleBySlug, getFormulesByVilleId } from "@/services/supabaseService";
import { Ville, Formule, Conciergerie, Filter } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useConciergerieData = (villeSlug: string | undefined) => {
  const [ville, setVille] = useState<Ville | null>(null);
  const [formules, setFormules] = useState<(Formule & { conciergerie?: Conciergerie; })[]>([]);
  const [filteredFormules, setFilteredFormules] = useState<(Formule & { conciergerie?: Conciergerie; })[]>([]);
  const [villeLoading, setVilleLoading] = useState(true);
  const [formulesLoading, setFormulesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter>({});
  const [subscriptions, setSubscriptions] = useState<Map<string, any>>(new Map());
  const [conciergerieRatings, setConciergerieRatings] = useState<Map<string, number>>(new Map());

  // Step 1: Fetch ville data first
  useEffect(() => {
    const fetchVilleData = async () => {
      if (!villeSlug) return;
      setVilleLoading(true);
      setError(null);
      try {
        console.log("Fetching ville data for slug:", villeSlug);
        const villeData = await getVilleBySlug(villeSlug);
        if (!villeData) {
          setError("Ville non trouvée");
        } else {
          setVille(villeData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données de la ville:", err);
        setError("Erreur lors du chargement des données de la ville");
      } finally {
        setVilleLoading(false);
      }
    };
    fetchVilleData();
  }, [villeSlug]);
  
  // Step 2: Fetch formules and other data once ville is loaded
  useEffect(() => {
    const fetchFormulesData = async () => {
      if (!ville) return;
      
      setFormulesLoading(true);
      try {
        console.log("Fetching formules for ville ID:", ville.id);
        const formulesData = await getFormulesByVilleId(ville.id);
        console.log("Formules data retrieved:", formulesData);
        
        setFormules(formulesData);
        setFilteredFormules(formulesData);

        const conciergerieIds = formulesData
          .map(f => f.conciergerie?.id)
          .filter(Boolean) as string[];
        
        if (conciergerieIds.length > 0) {
          console.log("🔍 Fetching subscriptions for conciergerie IDs:", conciergerieIds);
          
          const { data: subscriptionsData, error } = await supabase
            .from('subscriptions')
            .select('conciergerie_id, website_url, phone_number_value, website_link, phone_number, total_points, monthly_amount, created_at')
            .in('conciergerie_id', conciergerieIds);
          
          console.log("📊 Subscriptions result:", { data: subscriptionsData, error });
          
          if (subscriptionsData) {
            const subscriptionsMap = new Map();
            subscriptionsData.forEach(sub => {
              subscriptionsMap.set(sub.conciergerie_id, sub);
            });
            console.log("🗺️ Subscriptions map:", subscriptionsMap);
            setSubscriptions(subscriptionsMap);
          }

          // Récupérer les avis pour toutes les conciergeries en une seule requête (comme sur les pages détails)
          console.log("📝 Récupération des avis pour toutes les conciergeries...");
          const { data: allAvisData, error: avisError } = await supabase
            .from('avis')
            .select('conciergerie_id, note')
            .in('conciergerie_id', conciergerieIds)
            .eq('valide', true);
          
          if (avisError) {
            console.error("Erreur lors du chargement des avis:", avisError);
          } else if (allAvisData) {
            // Calculer les ratings moyens pour chaque conciergerie
            const ratingsMap = new Map();
            
            conciergerieIds.forEach(conciergerieId => {
              const conciergerieAvis = allAvisData.filter(avis => avis.conciergerie_id === conciergerieId);
              const averageRating = conciergerieAvis.length > 0 
                ? conciergerieAvis.reduce((sum, avis) => sum + avis.note, 0) / conciergerieAvis.length 
                : 0;
              ratingsMap.set(conciergerieId, averageRating);
            });
            
            setConciergerieRatings(ratingsMap);
            console.log("✅ Ratings calculés pour", ratingsMap.size, "conciergeries");
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des formules:", err);
        setError(prevError => prevError || "Erreur lors du chargement des formules");
      } finally {
        setFormulesLoading(false);
      }
    };
    
    fetchFormulesData();
  }, [ville]);

  // Apply filters when filters or formules change
  useEffect(() => {
    if (formules.length === 0) return;

    // Appliquer les filtres
    let results = [...formules];

    // Filtre par type de bien
    if (filters.typeBien) {
      results = results.filter(formule => formule.conciergerie?.typeLogementAccepte === 'tous' || formule.conciergerie?.typeLogementAccepte === filters.typeBien);
    }

    // Filtre par superficie minimum
    if (filters.superficie && filters.superficie > 0) {
      results = results.filter(formule => formule.conciergerie && formule.conciergerie.superficieMin <= filters.superficie!);
    }

    // Filtre par nombre de chambres
    if (filters.nombreChambres && filters.nombreChambres > 0) {
      results = results.filter(formule => formule.conciergerie && formule.conciergerie.nombreChambresMin <= filters.nombreChambres!);
    }

    // Filtre par commission maximum
    if (filters.commissionMax && filters.commissionMax > 0) {
      results = results.filter(formule => formule.commission <= filters.commissionMax!);
    }

    // Filtre par durée de gestion minimum
    if (filters.dureeGestionMin && filters.dureeGestionMin > 0) {
      results = results.filter(formule => formule.dureeGestionMin <= filters.dureeGestionMin!);
    }

    // Filtre par note minimale
    if (filters.noteMin && filters.noteMin > 0) {
      results = results.filter(formule => {
        if (!formule.conciergerie?.id) return false;
        const rating = conciergerieRatings.get(formule.conciergerie.id) || 0;
        return rating >= filters.noteMin!;
      });
    }

    // Filtre par services inclus
    if (filters.servicesInclus && filters.servicesInclus.length > 0) {
      results = results.filter(formule => filters.servicesInclus!.every(service => formule.servicesInclus.includes(service)));
    }

    // Filtre par accepte résidence principale
    if (filters.accepteResidencePrincipale === true) {
      results = results.filter(formule => formule.conciergerie?.accepteResidencePrincipale === true);
    }

    // Filtre par accepte gestion partielle
    if (filters.accepteGestionPartielle === true) {
      results = results.filter(formule => formule.conciergerie?.accepteGestionPartielle === true);
    }

    setFilteredFormules(results);
  }, [filters, formules, conciergerieRatings]);

  const handleFilterChange = (key: keyof Filter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFilters(prev => {
      const currentServices = prev.servicesInclus || [];
      const updatedServices = currentServices.includes(serviceId) ? currentServices.filter(id => id !== serviceId) : [...currentServices, serviceId];
      return {
        ...prev,
        servicesInclus: updatedServices.length > 0 ? updatedServices : undefined
      };
    });
  };

  const resetFilters = () => {
    setFilters({});
  };

  return {
    ville,
    formules,
    filteredFormules,
    loading: villeLoading, // Main loading is now villeLoading
    formulesLoading,
    error,
    filters,
    subscriptions,
    conciergerieRatings,
    handleFilterChange,
    handleServiceToggle,
    resetFilters
  };
};

