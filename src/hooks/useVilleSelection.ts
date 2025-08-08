
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

  // Mise Ã  jour des villesIds dans le formulaire Ã  chaque changement de sÃ©lection
  useEffect(() => {
    (form as any).setValue("villesIds", selectedVillesIds);
  }, [selectedVillesIds, form]);

  return {
    selectedVillesIds,
    handleVilleSelection,
    setSelectedVillesIds // Expose the setter
  };
};

