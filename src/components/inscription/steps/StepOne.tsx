
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VilleForInscription } from "@/services/villeServiceOptimized";
import GeographicCoverageSection from "./components/GeographicCoverageSection";
import PropertyConfigSection from "./components/PropertyConfigSection";
import AcceptanceOptionsSection from "./components/AcceptanceOptionsSection";
import CommissionCalculationSection from "./components/CommissionCalculationSection";
import ConciergeInfoSection from "./components/ConciergeInfoSection";
import ScoreFieldSection from "./components/ScoreFieldSection";

interface StepOneProps {
  form: UseFormReturn<any>;
  logoPreview: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  villes: VilleForInscription[];
  selectedVillesIds: string[];
  villesLoading: boolean;
  handleVilleSelection: (villeId: string) => void;
  isUploadingLogo?: boolean;
  isAdmin?: boolean; // Add this to conditionally show admin-only fields
}

const StepOne: React.FC<StepOneProps> = ({
  form,
  logoPreview,
  handleLogoChange,
  villes,
  selectedVillesIds,
  villesLoading,
  handleVilleSelection,
  isUploadingLogo = false,
  isAdmin = false // Default to false
}) => {
  return (
    <>
      {/* Villes couvertes */}
      <GeographicCoverageSection 
        form={form}
        villes={villes}
        selectedVillesIds={selectedVillesIds}
        villesLoading={villesLoading}
        handleVilleSelection={handleVilleSelection}
      />

      {/* Type de logement, superficie et nombre de chambres */}
      <PropertyConfigSection form={form} />

      {/* Options d'acceptation */}
      <AcceptanceOptionsSection form={form} />

      {/* Méthode de calcul et TVA */}
      <CommissionCalculationSection form={form} />

      {/* Score - Admin only field */}
      {isAdmin && (
        <ScoreFieldSection form={form} />
      )}

      {/* Nom, email et logo */}
      <ConciergeInfoSection 
        form={form}
        logoPreview={logoPreview}
        handleLogoChange={handleLogoChange}
        isUploadingLogo={isUploadingLogo}
      />
    </>
  );
};

export default StepOne;

