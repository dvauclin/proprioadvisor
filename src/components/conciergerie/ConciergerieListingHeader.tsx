
import React from "react";
import { Button } from "@/components/ui-kit/button";
import { Filter as FilterIcon } from "lucide-react";
import Breadcrumbs from "@/components/ui-kit/Breadcrumbs";
import ConciergerieFilters from "@/components/conciergerie/ConciergerieFilters";
import { Filter, Ville } from "@/types";

interface ConciergerieListingHeaderProps {
  ville: Ville | null;
  villeSlug: string | undefined;
  pageDescription: string;
  breadcrumbItems: Array<{ label: string; href?: string }>;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: Filter;
  handleFilterChange: (key: keyof Filter, value: any) => void;
  handleServiceToggle: (serviceId: string) => void;
  resetFilters: () => void;
  getLastUpdateDate: () => string;
}

const ConciergerieListingHeader: React.FC<ConciergerieListingHeaderProps> = ({
  ville,
  villeSlug,
  pageDescription,
  breadcrumbItems,
  showFilters,
  setShowFilters,
  filters,
  handleFilterChange,
  handleServiceToggle,
  resetFilters,
  getLastUpdateDate
}) => {
  return (
    <header className="py-8 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} className="mb-4" />
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              {ville?.nom ? `Conciergeries Airbnb à ${ville.nom.charAt(0).toUpperCase() + ville.nom.slice(1)}` : `Conciergeries Airbnb à ${villeSlug ? villeSlug.charAt(0).toUpperCase() + villeSlug.slice(1) : villeSlug}`}
            </h1>
            {pageDescription && (
              <div className="text-gray-600 max-w-3xl mx-auto mb-4">
                <p>{pageDescription}</p>
              </div>
            )}
            <div className="text-sm text-gray-500 mb-4">
              <p>Dernière mise à jour : {getLastUpdateDate()}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Afficher ou masquer les filtres"
          >
            <FilterIcon size={16} />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>

          {showFilters && (
            <ConciergerieFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onServiceToggle={handleServiceToggle} 
              onResetFilters={resetFilters} 
              onHideFilters={() => setShowFilters(false)} 
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default ConciergerieListingHeader;
