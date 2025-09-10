
import React from "react";
import { Formule, Conciergerie } from "@/types";

// Type étendu pour les formules avec conciergerie
type FormuleWithConciergerie = Formule & { conciergerie?: Conciergerie };

import ComparisonCard from "@/components/ui-kit/comparison-card";
import { Button } from "@/components/ui-kit/button";

interface ConciergerieListProps {
  formules: FormuleWithConciergerie[];
  allFormulesCount: number;
  onDevisRequest: (formuleId: string, conciergerieId: string) => void;
  onResetFilters: () => void;
  subscriptions: Map<string, any>;
  conciergerieRatings?: Map<string, number>;
  conciergerieReviewCounts?: Map<string, number>;
  cardsContainerRef?: React.Ref<HTMLDivElement>;
}

const ConciergerieList: React.FC<ConciergerieListProps> = ({
  formules,
  allFormulesCount,
  onDevisRequest,
  onResetFilters,
  subscriptions,
  conciergerieRatings,
  conciergerieReviewCounts,
  cardsContainerRef
}) => {

  if (formules.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">
          {allFormulesCount === 0 
            ? "Aucune conciergerie n'est encore enregistrée pour cette ville." 
            : "Aucune conciergerie ne correspond à vos critères de recherche."}
        </p>
        {allFormulesCount > 0 && (
          <Button variant="outline" onClick={onResetFilters} className="mt-4">
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    );
  }



  // NOUVELLE LOGIQUE: Score manuel uniquement si pas de souscription
  const sortedFormules = [...formules].sort((a, b) => {
    const subscriptionA = a.conciergerie?.id ? subscriptions.get(a.conciergerie.id) : null;
    const subscriptionB = b.conciergerie?.id ? subscriptions.get(b.conciergerie.id) : null;
    
    // Determine effective score: score manuel uniquement si pas de souscription
    const effectiveScoreA = subscriptionA ? (subscriptionA.total_points || 0) : (a.conciergerie?.scoreManuel ?? 0);
    const effectiveScoreB = subscriptionB ? (subscriptionB.total_points || 0) : (b.conciergerie?.scoreManuel ?? 0);

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
      <div ref={cardsContainerRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedFormules.map(formule => {
          const subscription = formule.conciergerie?.id ? subscriptions.get(formule.conciergerie.id) : null;
          const preloadedRating = formule.conciergerie?.id && conciergerieRatings ? conciergerieRatings.get(formule.conciergerie.id) : undefined;
          const preloadedReviewsCount = formule.conciergerie?.id && conciergerieReviewCounts ? conciergerieReviewCounts.get(formule.conciergerie.id) : undefined;
          
          return formule.conciergerie ? (
            <ComparisonCard 
              key={formule.id} 
              formule={formule} 
              conciergerie={formule.conciergerie} 
              subscription={subscription}
              onDevisClick={() => onDevisRequest(formule.id, formule.conciergerie!.id)} 
              preloadedRating={preloadedRating}
              preloadedReviewsCount={preloadedReviewsCount}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default ConciergerieList;

