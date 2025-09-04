"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getVillesForInscription, searchVilles, VilleForInscription } from '@/services/villeServiceOptimized';

interface UseVillesOptimizedReturn {
  villes: VilleForInscription[];
  filteredVilles: VilleForInscription[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedVillesIds: string[];
  handleVilleSelection: (villeId: string) => void;
  clearSelection: () => void;
}

/**
 * Hook optimisé pour le chargement des villes dans l'inscription
 * - Chargement paresseux
 * - Cache en mémoire
 * - Recherche optimisée
 * - Gestion d'état simplifiée
 */
export const useVillesOptimized = (): UseVillesOptimizedReturn => {
  const [villes, setVilles] = useState<VilleForInscription[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVillesIds, setSelectedVillesIds] = useState<string[]>([]);

  // Chargement paresseux - seulement quand nécessaire
  const loadVilles = useCallback(async () => {
    if (villes.length > 0) {
      return; // Déjà chargé
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 useVillesOptimized: Loading villes...");
      const villesData = await getVillesForInscription();
      setVilles(villesData);
      console.log("✅ useVillesOptimized: Loaded", villesData.length, "villes");
    } catch (err) {
      console.error("❌ useVillesOptimized: Error loading villes:", err);
      setError("Impossible de charger les villes");
    } finally {
      setLoading(false);
    }
  }, [villes.length]);

  // Recherche optimisée avec useMemo
  const filteredVilles = useMemo(() => {
    return searchVilles(villes, searchTerm);
  }, [villes, searchTerm]);

  // Gestion de la sélection des villes
  const handleVilleSelection = useCallback((villeId: string) => {
    setSelectedVillesIds(prev => {
      if (prev.includes(villeId)) {
        return prev.filter(id => id !== villeId);
      } else {
        return [...prev, villeId];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedVillesIds([]);
  }, []);

  // Charger les villes au montage avec un léger délai pour éviter le blocage
  useEffect(() => {
    const timer = setTimeout(() => {
      loadVilles();
    }, 100); // Délai de 100ms pour permettre le rendu initial

    return () => clearTimeout(timer);
  }, [loadVilles]);

  return {
    villes,
    filteredVilles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedVillesIds,
    handleVilleSelection,
    clearSelection
  };
};

/**
 * Hook pour la recherche avec debouncing
 */
export const useVillesSearch = (villes: VilleForInscription[], delay: number = 300) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Debouncing de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  const filteredVilles = useMemo(() => {
    return searchVilles(villes, debouncedSearchTerm);
  }, [villes, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredVilles,
    debouncedSearchTerm
  };
};
