
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
      title: "Formule ajoutée",
      description: `La formule "${formule.nom}" a été ajoutée`,
    });
  };

  const handleDeleteFormule = (formuleId: string) => {
    setFormules(formules.filter(f => f.id !== formuleId));
    
    toast({
      title: "Formule supprimée",
      description: "La formule a été supprimée",
    });
  };

  return {
    formules,
    handleAddFormule,
    handleDeleteFormule,
  };
};
