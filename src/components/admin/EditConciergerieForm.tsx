import React, { useRef } from "react";
import { useEditConciergerieForm } from "@/hooks/useEditConciergerieForm";
import { Conciergerie, Formule } from "@/types";
import { Form } from "@/components/ui-kit/form";
import NewStepOne from "@/components/inscription/steps/NewStepOne";
import NewStepTwo from "@/components/inscription/steps/NewStepTwo";
import NewStepThree from "@/components/inscription/steps/NewStepThree";
import StepProgress from "@/components/inscription/steps/StepProgress";

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
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToFormTop = () => {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      const elementPosition = window.scrollY + rect.top;
      
      // Calculer la hauteur du header
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 64;
      
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
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
  } = useEditConciergerieForm(
    conciergerie || null,
    formules,
    (data) => {
      if (onSave) onSave(data);
      if (onSuccess) onSuccess();
    },
    () => {
      if (onCancel) onCancel();
      if (onSuccess) onSuccess();
    },
    scrollToFormTop
  );

  const stepTitles = [
    "Que recherchez-vous comme bien ?",
    "Quelles sont vos offres et services ?", 
    "Comment vous contacter ?"
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] sm:max-h-[90vh] max-sm:max-h-[calc(100vh-1rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{conciergerie ? "Modifier une conciergerie" : "Ajouter une conciergerie"}</DialogTitle>
        </DialogHeader>

        <div className="py-4" ref={formRef}>
          <StepProgress 
            currentStep={step} 
            totalSteps={3} 
            stepTitles={stepTitles} 
          />
          <Form {...form}>
            {step === 1 ? (
              <form onSubmit={form.handleSubmit(handleStepOne)}>
                <NewStepOne
                  form={form}
                  villes={villes}
                  selectedVillesIds={selectedVillesIds}
                  villesLoading={villesLoading}
                  handleVilleSelection={handleVilleSelection}
                  isAdmin={isAdmin}
                  onCancel={handleCancel}
                  loading={loading}
                />
              </form>
            ) : step === 2 ? (
              <NewStepTwo
                formules={managedFormules.map(f => ({
                  nom: f.nom,
                  commission: f.commission,
                  dureeGestionMin: f.dureeGestionMin,
                  servicesInclus: f.servicesInclus,
                  fraisMenageHeure: f.fraisMenageHeure,
                  fraisDemarrage: f.fraisDemarrage,
                  abonnementMensuel: f.abonnementMensuel,
                  fraisSupplementaireLocation: f.fraisSupplementaireLocation,
                  fraisReapprovisionnement: f.fraisReapprovisionnement,
                  forfaitReapprovisionnement: f.forfaitReapprovisionnement,
                  locationLinge: f.locationLinge,
                  prixLocationLinge: f.prixLocationLinge,
                  tva: f.tva || undefined
                }))}
                onAddFormule={handleAddFormule}
                onEditFormule={handleEditFormule}
                onDeleteFormule={handleDeleteFormule}
                onSubmit={() => {
                  setStep(3);
                  setTimeout(scrollToFormTop, 100);
                }}
                loading={loading}
                onBack={() => {
                  setStep(1);
                  setTimeout(scrollToFormTop, 100);
                }}
                submitText="Continuer"
              />
            ) : (
              <NewStepThree
                form={form}
                logoPreview={logoPreview}
                handleLogoChange={handleLogoChange}
                isUploadingLogo={isUploadingLogo}
                onSubmit={handleSubmit}
                onBack={() => {
                  setStep(2);
                  setTimeout(scrollToFormTop, 100);
                }}
                loading={loading}
                submitText={conciergerie ? "Enregistrer les modifications" : "Ajouter la conciergerie"}
              />
            )}
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditConciergerieForm;

