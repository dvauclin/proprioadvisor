"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { useInscriptionForm } from "@/hooks/useInscriptionForm";
import InscriptionLayout from "@/components/inscription/InscriptionLayout";
import InscriptionFormContainer from "@/components/inscription/InscriptionFormContainer";
import InscriptionStepOneForm from "@/components/inscription/InscriptionStepOneForm";
import InscriptionInfoSections from "@/components/inscription/InscriptionInfoSections";
import StepTwo from "@/components/inscription/steps/StepTwo";

const Inscription = () => {
  const formRef = useRef<HTMLDivElement>(null);
  
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
    isStepOneValid,
    isUploadingLogo
  } = useInscriptionForm();

  // Adapter function to convert index to formuleId
  const handleDeleteFormuleByIndex = (index: number) => {
    // Since formules is an array, we need to get the formule at the given index
    // and then pass its id to handleDeleteFormule
    const formuleId = formules[index].id;
    handleDeleteFormule(formuleId);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <InscriptionLayout onScrollToForm={scrollToForm}>
      <div ref={formRef}>
        <InscriptionFormContainer>
          {step === 1 ? (
            <InscriptionStepOneForm 
              form={form}
              logoPreview={logoPreview}
              handleLogoChange={handleLogoChange}
              villes={villes}
              selectedVillesIds={selectedVillesIds}
              villesLoading={villesLoading}
              handleVilleSelection={handleVilleSelection}
              handleStepOne={handleStepOne}
              isStepOneValid={isStepOneValid}
              isUploadingLogo={isUploadingLogo}
            />
          ) : (
            <StepTwo
              formules={formules}
              onAddFormule={handleAddFormule}
              onSubmit={handleSubmit}
              loading={loading}
              onBack={() => setStep(1)}
              onDeleteFormule={handleDeleteFormuleByIndex}
            />
          )}
        </InscriptionFormContainer>
      </div>
      
      <InscriptionInfoSections onScrollToForm={scrollToForm} />
    </InscriptionLayout>
  );
};

export default Inscription;


