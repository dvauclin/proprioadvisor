
import React from "react";
import { Formule, Conciergerie } from "@/types";

// Type Ã©tendu pour les formules avec conciergerie
type FormuleWithConciergerie = Formule & { conciergerie?: Conciergerie };

import ComparisonCard from "@/components/ui-kit/comparison-card";
import { Button } from "@/components/ui-kit/button";

interface ConciergerieListProps {
  formules: FormuleWithConciergerie[];
  allFormulesCount: number;
  onDevisRequest: (formuleId: string, conciergerieId: string) => void;
  onResetFilters: () => void;
  subscriptions: Map<string, any>;
}

const ConciergerieList: React.FC<ConciergerieListProps> = ({
  formules,
  allFormulesCount,
  onDevisRequest,
  onResetFilters,
  subscriptions
}) => {

  if (formules.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">
          {allFormulesCount === 0 
            ? "Aucune conciergerie n'est encore enregistrÃ©e pour cette ville." 
            : "Aucune conciergerie ne correspond Ã  vos critÃ¨res de recherche."}
        </p>
        {allFormulesCount > 0 && (
          <Button variant="outline" onClick={onResetFilters} className="mt-4">
            RÃ©initialiser les filtres
          </Button>
        )}
      </div>
    );
  }



  // NEW LOGIC: Sort by scoreManuel OR total_points, then by conciergerie creation date (oldest first)
  // Priority: scoreManuel > total_points > conciergerie creation date (oldest first)
  const sortedFormules = [...formules].sort((a, b) => {
    const subscriptionA = a.conciergerie?.id ? subscriptions.get(a.conciergerie.id) : null;
    const subscriptionB = b.conciergerie?.id ? subscriptions.get(b.conciergerie.id) : null;
    
    // Determine effective score: scoreManuel takes priority over total_points
    const effectiveScoreA = a.conciergerie?.scoreManuel ?? (subscriptionA?.total_points || 0);
    const effectiveScoreB = b.conciergerie?.scoreManuel ?? (subscriptionB?.total_points || 0);
    

    
    // First: Compare effective scores (highest first)
    if (effectiveScoreA !== effectiveScoreB) {
      return effectiveScoreB - effectiveScoreA; // Sort by effective score descending
    }
    
    // Second: If effective scores are equal, compare conciergerie creation dates (oldest first)
    const dateA = new Date(a.conciergerie?.createdAt || '').getTime();
    const dateB = new Date(b.conciergerie?.createdAt || '').getTime();
    return dateA - dateB; // Sort by conciergerie creation date ascending (oldest first)
  });


  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedFormules.map(formule => {
          const subscription = formule.conciergerie?.id ? subscriptions.get(formule.conciergerie.id) : null;
          
          return formule.conciergerie ? (
            <ComparisonCard 
              key={formule.id} 
              formule={formule} 
              conciergerie={formule.conciergerie} 
              subscription={subscription}
              onDevisClick={() => onDevisRequest(formule.id, formule.conciergerie!.id)} 
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default ConciergerieList;

