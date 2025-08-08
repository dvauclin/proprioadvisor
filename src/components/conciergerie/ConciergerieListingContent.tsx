
import React from "react";
import { Formule, Conciergerie } from "@/types";

// Type Ã©tendu pour les formules avec conciergerie
type FormuleWithConciergerie = Formule & { conciergerie?: Conciergerie };

import ConciergerieList from "@/components/conciergerie/ConciergerieList";
import ConciergerieListSkeleton from "@/components/conciergerie/ConciergerieListSkeleton";

interface ConciergerieListingContentProps {
  formulesLoading: boolean;
  filteredFormules: FormuleWithConciergerie[];
  formules: FormuleWithConciergerie[];
  onDevisRequest: (formuleId: string, conciergerieId: string) => void;
  resetFilters: () => void;
  subscriptions: Map<string, any>;
  ville: any;
}

const ConciergerieListingContent: React.FC<ConciergerieListingContentProps> = ({
  formulesLoading,
  filteredFormules,
  formules,
  onDevisRequest,
  resetFilters,
  subscriptions,
  ville
}) => {
  return (
    <div className="container mx-auto px-4">
      {!formulesLoading && ville && (
        <div className="text-sm text-gray-600 mb-4">
          <strong>{filteredFormules.length}</strong> formule{filteredFormules.length > 1 ? 's' : ''} affichÃ©e{filteredFormules.length > 1 ? 's' : ''} sur <strong>{formules.length}</strong>
        </div>
      )}

      <section aria-labelledby="conciergeries-list-heading">
        <h2 id="conciergeries-list-heading" className="sr-only">Liste des conciergeries</h2>
        {formulesLoading ? (
          <ConciergerieListSkeleton />
        ) : (
          <ConciergerieList 
            formules={filteredFormules} 
            allFormulesCount={formules.length} 
            onDevisRequest={onDevisRequest} 
            onResetFilters={resetFilters} 
            subscriptions={subscriptions} 
          />
        )}
      </section>
    </div>
  );
};

export default ConciergerieListingContent;

