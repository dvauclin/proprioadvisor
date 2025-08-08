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

// Type optimisÃ© pour les villes dans le sÃ©lecteur
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

  // Optimisation du filtrage et tri avec useMemo pour Ã©viter les recalculs
  const filteredAndSortedVilles = useMemo(() => {
    let filtered = villes;
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = villes.filter(ville => 
        ville.nom.toLowerCase().includes(searchLower) ||
        (ville.departementNumero && ville.departementNumero.includes(searchTerm)) ||
        (ville.departementNom && ville.departementNom.toLowerCase().includes(searchLower))
      );
    }
    
    // Tri optimisÃ© par dÃ©partement puis par nom
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
    return ville.departementNumero ? `${ville.nom} (${ville.departementNumero})` : ville.nom;
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
                    placeholder="Rechercher une ville ou un dÃ©partement..."
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
                    {searchTerm ? "Aucune ville trouvÃ©e" : "Aucune ville disponible"}
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
                          className="rounded border-gray-300 text-brand-chartreuse focus:ring-brand-chartreuse"
                        />
                        <label htmlFor={`ville-${ville.id}`} className="text-sm">
                          {formatVilleName(ville)}
                        </label>
                      </div>
                    ))}
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
                placeholder="Ex: Paris et sa banlieue, CÃ´te d'Azur..."
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

