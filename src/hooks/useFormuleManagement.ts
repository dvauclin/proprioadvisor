
import { useState } from "react";
import { useToast } from "@/components/ui-kit/use-toast";
import type { FormuleFormData } from "@/components/FormuleForm";

export interface Formule extends FormuleFormData {
  id: string;
}

export const useFormuleManagement = () => {
  const { toast } = useToast();
  const [formules, setFormules] = useState<Formule[]>([]);

  const handleAddFormule = (formule: FormuleFormData) => {
    const newFormule = {
      ...formule,
      id: crypto.randomUUID(),
    };
    
    setFormules([...formules, newFormule]);
    
    toast({
      title: "Formule ajoutÃ©e",
      description: `La formule "${formule.nom}" a Ã©tÃ© ajoutÃ©e`,
    });
  };

  const handleDeleteFormule = (formuleId: string) => {
    setFormules(formules.filter(f => f.id !== formuleId));
    
    toast({
      title: "Formule supprimÃ©e",
      description: "La formule a Ã©tÃ© supprimÃ©e",
    });
  };

  return {
    formules,
    handleAddFormule,
    handleDeleteFormule,
  };
};

