"use client";

import React, { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Button } from "@/components/ui-kit/button";
import { MapPin, Building2, Search, X, Check } from "lucide-react";
import { useVillesOptimized } from "@/hooks/useVillesOptimized";

interface VilleSelectorOptimizedProps {
  form: UseFormReturn<any>;
}

const VilleSelectorOptimized: React.FC<VilleSelectorOptimizedProps> = ({ form }) => {
  const {
    filteredVilles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedVillesIds,
    handleVilleSelection,
    clearSelection
  } = useVillesOptimized();

  const [isExpanded, setIsExpanded] = useState(false);

  // Statistiques pour l'affichage
  const stats = useMemo(() => {
    const total = filteredVilles.length;
    const selected = selectedVillesIds.length;
    return { total, selected };
  }, [filteredVilles.length, selectedVillesIds.length]);

  const formatVilleName = (ville: any) => {
    return ville.departementNumero ? `${ville.departementNumero} - ${ville.nom}` : ville.nom;
  };

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-2">
          <Building2 className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Couverture géographique</h3>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Building2 className="mr-2 h-5 w-5 text-brand-chartreuse" />
          <h3 className="text-lg font-medium">Couverture géographique</h3>
        </div>
        {selectedVillesIds.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Effacer ({selectedVillesIds.length})
          </Button>
        )}
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
              
              {/* Toggle pour afficher/masquer la liste */}
              <div className="p-3 border-b border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full justify-between"
                >
                  <span>
                    {isExpanded ? 'Masquer' : 'Afficher'} les villes
                    {stats.selected > 0 && ` (${stats.selected} sélectionnée${stats.selected > 1 ? 's' : ''})`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {stats.total} ville{stats.total > 1 ? 's' : ''}
                  </span>
                </Button>
              </div>
              
              {/* Cities list - affichage conditionnel */}
              {isExpanded && (
                <div className="p-4 max-h-60 overflow-y-auto">
                  {loading ? (
                    <div className="py-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-chartreuse"></div>
                      <p className="mt-2 text-sm text-gray-600">Chargement des villes...</p>
                    </div>
                  ) : filteredVilles.length === 0 ? (
                    <div className="py-4 text-center text-gray-500">
                      {searchTerm ? "Aucune ville trouvée" : "Aucune ville disponible"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredVilles.map(ville => {
                        const isSelected = selectedVillesIds.includes(ville.id);
                        return (
                          <div 
                            key={ville.id} 
                            className={`flex items-center space-x-3 p-2 rounded-md transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-green-50 border border-green-200' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleVilleSelection(ville.id)}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-green-600 border-green-600' 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className={`text-sm flex-1 ${
                              isSelected ? 'text-green-800 font-medium' : 'text-gray-700'
                            }`}>
                              {formatVilleName(ville)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              
              {/* Selected cities summary */}
              {selectedVillesIds.length > 0 && (
                <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">
                      {selectedVillesIds.length} ville{selectedVillesIds.length > 1 ? 's' : ''} sélectionnée{selectedVillesIds.length > 1 ? 's' : ''}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="text-green-600 hover:text-green-700 text-xs"
                    >
                      Effacer
                    </Button>
                  </div>
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
              <FormLabel>Zone de déplacement (optionnelle)</FormLabel>
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

export default VilleSelectorOptimized;
