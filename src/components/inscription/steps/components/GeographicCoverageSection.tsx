"use client";

import React, { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { MapPin, Building2, Search } from "lucide-react";
import { normalizeForSearch } from "@/utils/conciergerieUtils";
import { VilleForInscription } from "@/services/villeServiceOptimized";

interface GeographicCoverageSectionProps {
  form: UseFormReturn<any>;
  villes: VilleForInscription[];
  selectedVillesIds: string[];
  villesLoading: boolean;
  handleVilleSelection: (villeId: string) => void;
}

const GeographicCoverageSection: React.FC<GeographicCoverageSectionProps> = ({
  form,
  villes,
  selectedVillesIds,
  villesLoading,
  handleVilleSelection
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Optimisation du filtrage et tri avec useMemo
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

  const formatVilleName = (ville: VilleForInscription) => {
    return ville.departementNumero ? `${ville.departementNumero} - ${ville.nom}` : ville.nom;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
                    <Building2 className="mr-2 h-5 w-5 text-brand-chartreuse" />
        <h3 className="text-lg font-medium">Couverture géographique</h3>
      </div>

      <FormField 
        control={form.control} 
        name="villesIds" 
        render={() => (
          <FormItem>
            <FormLabel>Villes couvertes</FormLabel>
            <div className="text-sm text-gray-600 mb-2">
              Sélectionnez les villes couvertes ou laissez vide si vous couvrez des villes non encore répertoriées
            </div>
            <div className="border border-gray-300 rounded-md">
              {/* Search input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="Rechercher une ville ou un département..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
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
                    {filteredAndSortedVilles.map(ville => (
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
              
              {/* Selected cities count */}
              {selectedVillesIds.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t text-sm text-gray-600">
                  {selectedVillesIds.length} ville(s) sélectionnée(s)
                </div>
              )}
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
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-brand-chartreuse" />
              <FormLabel>Zone de déplacement (optionnelle) </FormLabel>
            </div>
            <FormControl>
              <Input {...field} placeholder="Ex: Paris et sa banlieue, Côte d'Azur, Marseille, Lyon..." />
            </FormControl>
            <div className="text-sm text-gray-500">
              Décrivez votre zone de couverture, notamment si vous couvrez des villes non encore disponibles dans la liste
            </div>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default GeographicCoverageSection;

