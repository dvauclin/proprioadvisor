
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/hooks/useInscriptionSchema";

export const useVilleSelection = (form: UseFormReturn<FormValues>) => {
  const [selectedVillesIds, setSelectedVillesIds] = useState<string[]>([]);

  const handleVilleSelection = (villeId: string) => {
    setSelectedVillesIds(prev => {
      if (prev.includes(villeId)) {
        return prev.filter(id => id !== villeId);
      } else {
        return [...prev, villeId];
      }
    });
  };

  // Mise à jour des villesIds dans le formulaire à chaque changement de sélection
  useEffect(() => {
    form.setValue("villesIds", selectedVillesIds);
  }, [selectedVillesIds, form]);

  return {
    selectedVillesIds,
    handleVilleSelection,
    setSelectedVillesIds // Expose the setter
  };
};
