import React from "react";
import { useEditConciergerieForm } from "@/hooks/useEditConciergerieForm";
import { Conciergerie, Formule } from "@/types";
import { Form } from "@/components/ui-kit/form";
import StepOne from "@/components/inscription/steps/StepOne";
import StepTwo from "@/components/inscription/steps/StepTwo";
import { Button } from "@/components/ui-kit/button";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-kit/dialog";
import { useAuth } from "@/contexts/AuthContext";

interface EditConciergerieFormProps {
  conciergerie?: Conciergerie;
  formules?: Formule[];
  onSave?: (conciergerie: Conciergerie & { formules: Formule[] }) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
  open: boolean;
}

const EditConciergerieForm: React.FC<EditConciergerieFormProps> = ({
  conciergerie,
  formules = [],
  onSave,
  onCancel,
  onSuccess,
  open
}) => {
  const { isAdmin } = useAuth();
  const {
    form,
    step,
    setStep,
    handleStepOne,
    handleSubmit,
    handleCancel,
    handleAddFormule,
    handleEditFormule,
    handleDeleteFormule,
    handleLogoChange,
    handleVilleSelection,
    loading,
    formules: managedFormules,
    logoPreview,
    selectedVillesIds,
    villes,
    villesLoading,
    isUploadingLogo
  } = useEditConciergerieForm({
    conciergerie,
    formules,
    onSave: (data) => {
      if (onSave) onSave(data);
      if (onSuccess) onSuccess();
    },
    onCancel: () => {
      if (onCancel) onCancel();
      if (onSuccess) onSuccess();
    }
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{conciergerie ? "Modifier une conciergerie" : "Ajouter une conciergerie"}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStepOne)}>
              {step === 1 ? (
                <div className="space-y-6">
                  <StepOne
                    form={form}
                    logoPreview={logoPreview}
                    handleLogoChange={handleLogoChange}
                    villes={villes}
                    selectedVillesIds={selectedVillesIds}
                    villesLoading={villesLoading}
                    handleVilleSelection={handleVilleSelection}
                    isUploadingLogo={isUploadingLogo}
                    isAdmin={isAdmin}
                  />
                  
                  <div className="flex justify-between pt-6 border-t">
                    <Button variant="outline" type="button" onClick={handleCancel}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      Continuer
                    </Button>
                  </div>
                </div>
              ) : (
                <StepTwo
                  formules={managedFormules}
                  onAddFormule={handleAddFormule}
                  onEditFormule={handleEditFormule}
                  onDeleteFormule={handleDeleteFormule}
                  onSubmit={handleSubmit}
                  loading={loading}
                  onBack={() => setStep(1)}
                  submitText={conciergerie ? "Enregistrer les modifications" : "Ajouter la conciergerie"}
                />
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditConciergerieForm;

