
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export const useVilleSelection = <T extends { villesIds: string[] }>(form: UseFormReturn<T>) => {
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
    (form as any).setValue("villesIds", selectedVillesIds);
  }, [selectedVillesIds, form]);

  return {
    selectedVillesIds,
    handleVilleSelection,
    setSelectedVillesIds // Expose the setter
  };
};

