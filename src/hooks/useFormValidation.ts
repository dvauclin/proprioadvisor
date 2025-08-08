
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/hooks/useInscriptionSchema";

export const useFormValidation = (form: UseFormReturn<FormValues>, selectedVillesIds: string[]) => {
  const [isStepOneValid, setIsStepOneValid] = useState(false);

  // Check form validity on change
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Check required fields are filled
      const hasName = value.nom && value.nom.length >= 2;
      const hasEmail = value.mail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.mail);
      
      // No longer require villes selection - allow empty array
      setIsStepOneValid(Boolean(hasName && hasEmail));
    });
    
    return () => subscription.unsubscribe();
  }, [form, selectedVillesIds]);

  return {
    isStepOneValid
  };
};

