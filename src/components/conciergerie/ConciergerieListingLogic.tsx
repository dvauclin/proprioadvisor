"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllConciergeries, getAllVilles } from "@/lib/data";
import { Conciergerie, Ville, Formule, Filter } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Type étendu pour les formules avec conciergerie
type FormuleWithConciergerie = Formule & { conciergerie?: Conciergerie };

interface UseConciergerieListingLogicReturn {
  villeSlug: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showDevisModal: boolean;
  setShowDevisModal: (show: boolean) => void;
  villeData: Ville | null;
  filteredFormules: FormuleWithConciergerie[];
  villeLoading: boolean;
  formulesLoading: boolean;
  error: string | null;
  filters: any;
  subscriptions: Map<string, any>;
  handleFilterChange: (filter: string, value: any) => void;
  handleServiceToggle: (service: string) => void;
  resetFilters: () => void;
  emergencyMetaData: any;
  handleDevisRequest: (formule: Formule, conciergerie: Conciergerie) => void;
  selectedFormuleData: any;
  linkedCities: Ville[];
  breadcrumbItems: Array<{ label: string; href?: string }>;
  getLastUpdateDate: () => string;
  pageDescription: string;
  formules: FormuleWithConciergerie[];
  selectedFormule: Formule | null;
  conciergerieRatings: Map<string, number>;
  conciergerieReviewCounts: Map<string, number>;
}

const useConciergerieListingLogic = (ville: string): UseConciergerieListingLogicReturn => {
  console.log("?? useConciergerieListingLogic called with ville:", ville);
  
  const [showFilters, setShowFilters] = useState(false);
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [selectedFormuleData, setSelectedFormuleData] = useState(null);
  const [filters, setFilters] = useState<Filter>({
    commissionMax: 30,
    servicesInclus: [],
    noteMin: 0,
    typeBien: undefined,
    accepteResidencePrincipale: undefined,
    accepteGestionPartielle: undefined,
    dureeGestionMin: undefined
  });

  // Fetch villes data
  const { data: villesData, isLoading: villesLoading, error: villesError } = useQuery({
    queryKey: ['villes'],
    queryFn: getAllVilles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("??? Villes data:", villesData);
  console.log("??? Villes loading:", villesLoading);
  console.log("??? Villes error:", villesError);

  // Fetch conciergeries data
  const { data: conciergeriesData, isLoading: conciergeriesLoading, error: conciergeriesError } = useQuery({
    queryKey: ['conciergeries'],
    queryFn: getAllConciergeries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  console.log("?? Conciergeries data:", conciergeriesData);
  console.log("?? Conciergeries loading:", conciergeriesLoading);
  console.log("?? Conciergeries error:", conciergeriesError);

  // Find ville data
  const villeData = villesData?.find(v => v.slug === ville) || null;
  console.log("?? Ville data found:", villeData);
  
  const villeSlug = ville;

  // Get formules for this ville
  // First, find the ville UUID from the slug
  const villeUUID = villesData?.find(v => v.slug === ville)?.id;
  console.log("?? Ville UUID for slug", ville, ":", villeUUID);
  
  const formules = conciergeriesData
    ?.filter(c => villeUUID && (c.villesIds?.includes(villeUUID) || c.villeId === villeUUID))
    .flatMap(c => c.formules?.map(f => ({ ...f, conciergerie: c })) || []) || [];

  console.log("?? Formules found:", formules);
  console.log("?? Formules count:", formules.length);

  // Récupérer les avis pour toutes les conciergeries (comme sur les pages détails)
  const [conciergerieRatings, setConciergerieRatings] = useState<Map<string, number>>(new Map());
  const [conciergerieReviewCounts, setConciergerieReviewCounts] = useState<Map<string, number>>(new Map());

  // Apply filters to formules
  console.log("?? Filtres actuels:", filters);
  console.log("?? Formules avant filtrage:", formules.length);
  
  const filteredFormules = formules.filter(formule => {
    // Filter by commission maximum
    if (formule.commission && filters.commissionMax && formule.commission > filters.commissionMax) {
      console.log("? Formule filtrée par commission:", formule.nom, "commission:", formule.commission, "max:", filters.commissionMax);
      return false;
    }
    
    // Filter by type de bien
    if (filters.typeBien) {
      const conciergerieType = formule.conciergerie?.typeLogementAccepte;
      if (conciergerieType !== 'tous' && conciergerieType !== filters.typeBien) {
        console.log("? Formule filtrée par type de bien:", formule.nom, "type:", conciergerieType, "filtre:", filters.typeBien);
        return false;
      }
    }
    
    // Filter by accepte résidence principale
    if (filters.accepteResidencePrincipale === true) {
      if (formule.conciergerie?.accepteResidencePrincipale !== true) {
        console.log("? Formule filtrée par résidence principale:", formule.nom, "accepte:", formule.conciergerie?.accepteResidencePrincipale);
        return false;
      }
    }
    
    // Filter by accepte gestion partielle
    if (filters.accepteGestionPartielle === true) {
      if (formule.conciergerie?.accepteGestionPartielle !== true) {
        console.log("? Formule filtrée par gestion partielle:", formule.nom, "accepte:", formule.conciergerie?.accepteGestionPartielle);
        return false;
      }
    }
    
    // Filter by durée de mise à disposition (doit être >= durée minimum d'engagement)
    if (filters.dureeGestionMin && filters.dureeGestionMin > 0) {
      if (formule.dureeGestionMin > filters.dureeGestionMin) {
        console.log("? Formule filtrée par durée:", formule.nom, "durée min:", formule.dureeGestionMin, "filtre:", filters.dureeGestionMin);
        return false;
      }
    }
    
    // Filter by services inclus (tous les services cochés doivent être proposés)
    if (filters.servicesInclus && filters.servicesInclus.length > 0) {
      const formuleServices = formule.servicesInclus || [];
      const allServicesIncluded = filters.servicesInclus.every((service: string) => 
        formuleServices.includes(service)
      );
      if (!allServicesIncluded) {
        console.log("? Formule filtrée par services:", formule.nom, "services:", formuleServices, "filtres:", filters.servicesInclus);
        return false;
      }
    }
    
    // Filter by note minimum (basé sur la moyenne des avis reçus)
    if (filters.noteMin && filters.noteMin > 0) {
      const conciergerieId = formule.conciergerie?.id;
      if (conciergerieId) {
        const averageRating = conciergerieRatings.get(conciergerieId) || 0;
        const subscription = subscriptionsMap.get(conciergerieId);
        const isRecommended = (subscription?.total_points || 0) >= 1;
        const effectiveRating = isRecommended ? averageRating : 0; // Non recommandée => note 0
        if (effectiveRating < filters.noteMin) {
          console.log("? Formule filtrée par note:", formule.nom, "effective:", effectiveRating, "(avg:", averageRating, "rec:", isRecommended, ") min:", filters.noteMin);
          return false;
        }
      }
    }
    
    console.log("? Formule acceptée:", formule.nom);
    return true;
  });
  
  console.log("?? Formules après filtrage:", filteredFormules.length);

  const handleFilterChange = (filter: string, value: any) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFilters((prev: Filter) => ({
      ...prev,
      servicesInclus: prev.servicesInclus?.includes(service)
        ? prev.servicesInclus.filter((s: string) => s !== service)
        : [...(prev.servicesInclus || []), service]
    }));
  };

  const resetFilters = () => {
    setFilters({
      commissionMax: 30,
      servicesInclus: [],
      noteMin: 0,
      typeBien: undefined,
      accepteResidencePrincipale: undefined,
      accepteGestionPartielle: undefined,
      dureeGestionMin: undefined
    });
  };

  const handleDevisRequest = (formule: Formule, conciergerie: Conciergerie) => {
    setSelectedFormuleData({ formule, conciergerie } as any);
    setShowDevisModal(true);
  };

  // Construire le breadcrumb avec ville mère si présente
  const breadcrumbItems = [];
  
  // Ajouter la ville mère si elle existe
  if (villeData?.villeMereId) {
    const villeMere = villesData?.find(v => v.id === villeData.villeMereId);
    if (villeMere) {
      breadcrumbItems.push({ 
        label: villeMere.nom.charAt(0).toUpperCase() + villeMere.nom.slice(1), 
        href: `/conciergerie/${villeMere.slug}` 
      });
    }
  }
  
  // Ajouter la ville actuelle
  breadcrumbItems.push({ 
    label: villeData?.nom ? villeData.nom.charAt(0).toUpperCase() + villeData.nom.slice(1) : (ville ? ville.charAt(0).toUpperCase() + ville.slice(1) : ville), 
    href: `/conciergerie/${ville}` 
  });

  // Obtenir les villes liées depuis Supabase
  const linkedCitiesFromSupabase: Ville[] = [];
  if (villeData?.villesLiees && villeData.villesLiees.length > 0) {
    villeData.villesLiees.forEach(villeLieeId => {
      const villeLiee = villesData?.find(v => v.id === villeLieeId);
      if (villeLiee && villeLiee.slug !== ville) {
        linkedCitiesFromSupabase.push(villeLiee);
      }
    });
  }

  // Utiliser la description de Supabase si disponible, sinon description par défaut
  const pageDescription = villeData?.description 
    ? villeData.description
    : `Découvrez les meilleures conciergeries Airbnb à ${villeData?.nom || ville}. Comparez les services, prix et avis pour choisir la conciergerie idéale.`;

  const emergencyMetaData = villeData ? null : {
    title: `Conciergerie Airbnb à ${ville} - Proprioadvisor`,
    description: `Trouvez la meilleure conciergerie Airbnb à ${ville}. Services personnalisés, prix compétitifs.`
  };

  const getLastUpdateDate = () => {
    const today = new Date();
    const lastUpdate = new Date(today);
    lastUpdate.setDate(today.getDate() - 7);
    return lastUpdate.toLocaleDateString('fr-FR');
  };

  // Récupérer les subscriptions avec React Query (SANS DISCRIMINATION)
  const { data: subscriptionsData } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('conciergerie_id, website_link, phone_number, website_url, phone_number_value, total_points, monthly_amount');
      
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Créer la Map des subscriptions
  const subscriptionsMap = new Map();
  if (subscriptionsData) {
    subscriptionsData.forEach((subscription: any) => {
      subscriptionsMap.set(subscription.conciergerie_id, subscription);
    });
  }

  useEffect(() => {
    const fetchAvis = async () => {
      if (!formules || formules.length === 0) return;
      
      const conciergerieIds = formules
        .map(f => f.conciergerie?.id)
        .filter(Boolean) as string[];
      
      if (conciergerieIds.length === 0) return;
      
      console.log("📝 Récupération des avis pour les conciergeries:", conciergerieIds);
      
      const { data: allAvisData, error: avisError } = await supabase
        .from('avis')
        .select('conciergerie_id, note')
        .in('conciergerie_id', conciergerieIds)
        .eq('valide', true);
      
      if (avisError) {
        console.error("Erreur lors du chargement des avis:", avisError);
      } else if (allAvisData) {
        // Calculer les ratings moyens et le nombre d'avis pour chaque conciergerie
        const ratingsMap = new Map<string, number>();
        const countsMap = new Map<string, number>();
        
        conciergerieIds.forEach(conciergerieId => {
          const conciergerieAvis = allAvisData.filter(avis => avis.conciergerie_id === conciergerieId);
          const count = conciergerieAvis.length;
          const averageRating = count > 0 
            ? conciergerieAvis.reduce((sum, avis) => sum + avis.note, 0) / count 
            : 0;
          ratingsMap.set(conciergerieId, averageRating);
          countsMap.set(conciergerieId, count);
        });
        
        setConciergerieRatings(ratingsMap);
        setConciergerieReviewCounts(countsMap);
        console.log("✅ Ratings & counts calculés pour", ratingsMap.size, "conciergeries");
      }
    };
    
    fetchAvis();
  }, [formules]);

  return {
    villeSlug,
    showFilters,
    setShowFilters,
    showDevisModal,
    setShowDevisModal,
    villeData,
    filteredFormules,
    villeLoading: villesLoading,
    formulesLoading: conciergeriesLoading,
    error: villesError?.message || conciergeriesError?.message || null,
    filters,
    subscriptions: subscriptionsMap,
    conciergerieRatings, // Exposer les ratings
    conciergerieReviewCounts, // Exposer le nombre d'avis
    handleFilterChange,
    handleServiceToggle,
    resetFilters,
    emergencyMetaData,
    handleDevisRequest,
    selectedFormuleData,
    linkedCities: linkedCitiesFromSupabase,
    breadcrumbItems,
    getLastUpdateDate,
    pageDescription,
    formules,
    selectedFormule: null
  };
};

export { useConciergerieListingLogic };
export default useConciergerieListingLogic;



