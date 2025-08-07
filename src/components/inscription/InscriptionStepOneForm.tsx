
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import StepOne from "@/components/inscription/steps/StepOne";
import { Ville } from "@/types";

interface InscriptionStepOneFormProps {
  form: UseFormReturn<any>;
  logoPreview: string;
  handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  villes: Ville[];
  selectedVillesIds: string[];
  villesLoading: boolean;
  handleVilleSelection: (villeId: string) => void;
  handleStepOne: (data: any) => void;
  isStepOneValid: boolean;
  isUploadingLogo: boolean;
}

const InscriptionStepOneForm: React.FC<InscriptionStepOneFormProps> = ({
  form,
  logoPreview,
  handleLogoChange,
  villes,
  selectedVillesIds,
  villesLoading,
  handleVilleSelection,
  handleStepOne,
  isStepOneValid,
  isUploadingLogo
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleStepOne)} className="space-y-6">
        <StepOne 
          form={form}
          logoPreview={logoPreview}
          handleLogoChange={handleLogoChange}
          villes={villes}
          selectedVillesIds={selectedVillesIds}
          villesLoading={villesLoading}
          handleVilleSelection={handleVilleSelection}
          isUploadingLogo={isUploadingLogo}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={!isStepOneValid || isUploadingLogo}
        >
          Continuer
        </Button>
      </form>
    </Form>
  );
};

export default InscriptionStepOneForm;
