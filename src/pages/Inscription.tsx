"use client";

import React, { useRef } from "react";
import { useInscriptionForm } from "@/hooks/useInscriptionForm";
import InscriptionLayout from "@/components/inscription/InscriptionLayout";
import InscriptionFormContainer from "@/components/inscription/InscriptionFormContainer";
import InscriptionInfoSections from "@/components/inscription/InscriptionInfoSections";
import NewStepOne from "@/components/inscription/steps/NewStepOne";
import NewStepTwo from "@/components/inscription/steps/NewStepTwo";
import NewStepThree from "@/components/inscription/steps/NewStepThree";
import StepProgress from "@/components/inscription/steps/StepProgress";

const Inscription = () => {
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
    handleStepOne,
    handleSubmit,
    handleAddFormule,
    handleDeleteFormule,
    handleLogoChange,
    handleVilleSelection,
    loading,
    formules,
    logoPreview,
    selectedVillesIds,
    villes,
    villesLoading,
    setStep,
    isUploadingLogo
  } = useInscriptionForm(scrollToFormTop);


  // Adapter function to convert index to formuleId
  const handleDeleteFormuleByIndex = (index: number) => {
    // Since formules is an array, we need to get the formule at the given index
    // and then pass its id to handleDeleteFormule
    const formuleId = formules[index].id;
    handleDeleteFormule(formuleId);
  };


  // Adapter for handleLogoChange to match expected event handler signature
  const handleLogoChangeAdapter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleLogoChange(file);
    }
  };

  return (
    <InscriptionLayout onScrollToForm={scrollToFormTop}>
      <div ref={formRef}>
        <InscriptionFormContainer>
          <StepProgress 
            currentStep={step} 
            totalSteps={3} 
          />
          
          {step === 1 ? (
            <form onSubmit={form.handleSubmit(handleStepOne)}>
              <NewStepOne
                form={form}
                villes={villes}
                selectedVillesIds={selectedVillesIds}
                villesLoading={villesLoading}
                handleVilleSelection={handleVilleSelection}
                isAdmin={false}
                loading={loading}
              />
            </form>
          ) : step === 2 ? (
            <NewStepTwo
              formules={formules}
              onAddFormule={handleAddFormule}
              onSubmit={() => {
                setStep(3);
                setTimeout(scrollToFormTop, 100);
              }}
              loading={loading}
              onBack={() => {
                setStep(1);
                setTimeout(scrollToFormTop, 100);
              }}
              onDeleteFormule={handleDeleteFormuleByIndex}
              submitText="Continuer"
            />
          ) : (
            <NewStepThree
              form={form}
              logoPreview={logoPreview || ''}
              handleLogoChange={handleLogoChangeAdapter}
              isUploadingLogo={Boolean(isUploadingLogo)}
              onSubmit={handleSubmit}
              onBack={() => {
                setStep(2);
                setTimeout(scrollToFormTop, 100);
              }}
              loading={loading}
              submitText="Finaliser l'inscription"
            />
          )}
        </InscriptionFormContainer>
      </div>
      
      <InscriptionInfoSections />
    </InscriptionLayout>
  );
};

export default Inscription;



