import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VilleForInscription } from "@/services/villeServiceOptimized";
import GeographicCoverageSection from "./components/GeographicCoverageSection";
import PropertyConfigSection from "./components/PropertyConfigSection";
import ScoreFieldSection from "./components/ScoreFieldSection";
import { Button } from "@/components/ui-kit/button";
import { ArrowRight } from "lucide-react";

interface NewStepOneProps {
  form: UseFormReturn<any>;
  villes: VilleForInscription[];
  selectedVillesIds: string[];
  villesLoading: boolean;
  handleVilleSelection: (villeId: string) => void;
  isAdmin?: boolean;
  onCancel?: () => void;
  loading?: boolean;
}

const NewStepOne: React.FC<NewStepOneProps> = ({
  form,
  villes,
  selectedVillesIds,
  villesLoading,
  handleVilleSelection,
  isAdmin = false,
  onCancel,
  loading = false
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Que recherchez-vous comme bien ?
        </h2>
      </div>

      {/* Couverture géographique */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <GeographicCoverageSection 
          form={form}
          villes={villes}
          selectedVillesIds={selectedVillesIds}
          villesLoading={villesLoading}
          handleVilleSelection={handleVilleSelection}
        />
      </div>

      {/* Configuration des logements acceptés */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <PropertyConfigSection form={form} />
      </div>

      {/* Score - Admin only field */}
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <ScoreFieldSection form={form} />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading} className="flex items-center">
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NewStepOne;
