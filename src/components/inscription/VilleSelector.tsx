"use client";

import React, { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Search } from "lucide-react";
import { normalizeForSearch } from "@/utils/conciergerieUtils";

// Type optimisé pour les villes dans le sélecteur
interface VilleSelectorItem {
  id: string;
  nom: string;
  departementNumero?: string;
  departementNom?: string;
}

interface VilleSelectorProps {
  villes: VilleSelectorItem[];
  selectedVillesIds: string[];
  villesLoading: boolean;
  handleVilleSelection: (villeId: string) => void;
}

const VilleSelector: React.FC<VilleSelectorProps> = ({
  villes,
  selectedVillesIds,
  villesLoading,
  handleVilleSelection,
}) => {
  const form = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Optimisation du filtrage et tri avec useMemo pour éviter les recalculs
  const filteredAndSortedVilles = useMemo(() => {
    let filtered = villes;
    
    if (searchTerm.trim()) {
      const normalizedSearch = normalizeForSearch(searchTerm);
      filtered = villes.filter(ville => {
        const normalizedVilleName = normalizeForSearch(ville.nom);
        const normalizedDepartementNom = ville.departementNom ? normalizeForSearch(ville.departementNom) : '';
        
        return normalizedVilleName.includes(normalizedSearch) ||
               (ville.departementNumero && ville.departementNumero.includes(searchTerm)) ||
               normalizedDepartementNom.includes(normalizedSearch);
      });
    }
    
    // Tri optimisé par département puis par nom
    return [...filtered].sort((a, b) => {
      const deptA = a.departementNumero || '';
      const deptB = b.departementNumero || '';
      
      if (deptA !== deptB) {
        return deptA.localeCompare(deptB, undefined, { numeric: true });
      }
      return a.nom.localeCompare(b.nom);
    });
  }, [villes, searchTerm]);

  const formatVilleName = (ville: VilleSelectorItem) => {
    return ville.departementNumero ? `${ville.departementNumero} - ${ville.nom}` : ville.nom;
  };

  return (
    <>
      <FormField
        control={form.control}
        name="villesIds"
        render={() => (
          <FormItem>
            <FormLabel>Villes couvertes</FormLabel>
            <div className="border border-gray-300 rounded-md">
              {/* Search input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher une ville ou un département..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
              
              {/* Cities list with optimized rendering */}
              <div className="p-4 max-h-60 overflow-y-auto">
                {villesLoading ? (
                  <div className="py-2 text-center">Chargement des villes...</div>
                ) : filteredAndSortedVilles.length === 0 ? (
                  <div className="py-2 text-center text-gray-500">
                    {searchTerm ? "Aucune ville trouvée" : "Aucune ville disponible"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredAndSortedVilles.map((ville) => (
                      <div key={ville.id} className="flex items-center space-x-2 p-1">
                        <input 
                          type="checkbox" 
                          id={`ville-${ville.id}`}
                          checked={selectedVillesIds.includes(ville.id)}
                          onChange={() => handleVilleSelection(ville.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`ville-${ville.id}`} className="text-sm">
                          {formatVilleName(ville)}
                        </label>
                      </div>
                    ))}
                    {/* Option "Autre ville" */}
                    <div className="flex items-center space-x-2 p-1">
                      <input 
                        type="checkbox" 
                        id="ville-other"
                        checked={selectedVillesIds.includes("other")}
                        onChange={() => handleVilleSelection("other")}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="ville-other" className="text-sm">
                        XX - Autre ville
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="zoneCouverte"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zone couverte (description)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ex: Paris et sa banlieue, Côte d'Azur..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default VilleSelector;

