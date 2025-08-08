
"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui-kit/button";
import DevisModal from "@/components/conciergerie/DevisModal";
import CTASection from "@/components/home/CTASection";
import ConciergerieListingHeader from "@/components/conciergerie/ConciergerieListingHeader";
import ConciergerieListingContent from "@/components/conciergerie/ConciergerieListingContent";
import LinkedCitiesSection from "@/components/conciergerie/LinkedCitiesSection";
import LongDescriptionSection from "@/components/conciergerie/LongDescriptionSection";
import { useConciergerieListingLogic } from "@/components/conciergerie/ConciergerieListingLogic";

interface ConciergerieListingProps {
  ville: string;
}

const ConciergerieListing: React.FC<ConciergerieListingProps> = ({ ville }) => {
  const {
    villeSlug,
    showFilters,
    setShowFilters,
    showDevisModal,
    setShowDevisModal,
    villeData,
    filteredFormules,
    villeLoading,
    formulesLoading,
    error,
    filters,
    subscriptions,
    handleFilterChange,
    handleServiceToggle,
    resetFilters,
    emergencyMetaData,
    handleDevisRequest,
    selectedFormuleData,
    linkedCities,
    breadcrumbItems,
    getLastUpdateDate,
    pageDescription,
    formules,
    conciergerieRatings,
    conciergerieReviewCounts
  } = useConciergerieListingLogic(ville);
  
  // Show loading for ville data
  if (villeLoading && !emergencyMetaData) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-brand-chartreuse" />
      </div>
    );
  }

  // Error handling with emergency fallback
  if (error || (!villeData && !emergencyMetaData)) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold mb-4">Destination non trouvée</h1>
            <p className="text-gray-600 mb-6">Nous n'avons pas trouvé la destination que vous recherchez.</p>
            <div className="flex gap-4">
              <Button>Retour à l'accueil</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <ConciergerieListingHeader
        ville={villeData}
        villeSlug={villeSlug}
        pageDescription={pageDescription}
        breadcrumbItems={breadcrumbItems}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        handleFilterChange={handleFilterChange}
        handleServiceToggle={handleServiceToggle}
        resetFilters={resetFilters}
        getLastUpdateDate={getLastUpdateDate}
      />

      <ConciergerieListingContent
        ville={villeData}
        formules={formules}
        filteredFormules={filteredFormules}
        formulesLoading={formulesLoading}
        onDevisRequest={(formuleId: string) => {
          const formule = formules.find(f => f.id === formuleId);
          const conciergerie = formule?.conciergerie;
          if (formule && conciergerie) {
            handleDevisRequest(formule, conciergerie);
          }
        }}
        resetFilters={resetFilters}
        subscriptions={subscriptions}
        conciergerieRatings={conciergerieRatings}
        conciergerieReviewCounts={conciergerieReviewCounts}
      />

      <LinkedCitiesSection linkedCities={linkedCities} currentCity={villeData?.nom || ville} />
      {villeData?.descriptionLongue && (
        <LongDescriptionSection descriptionLongue={villeData.descriptionLongue} />
      )}
      <div className="mt-0">
        <CTASection />
      </div>
      
      <DevisModal
        open={showDevisModal}
        onOpenChange={(open) => setShowDevisModal(open)}
        selectedFormule={selectedFormuleData ? {
          formuleId: selectedFormuleData.formule.id,
          conciergerieId: selectedFormuleData.conciergerie.id
        } : null}
        formuleData={selectedFormuleData ? {
          ...selectedFormuleData.formule,
          conciergerie: selectedFormuleData.conciergerie
        } : null}
      />
    </div>
  );
};

export default ConciergerieListing;



