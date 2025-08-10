"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { FormuleFormData } from "@/components/formule/FormuleFormSchema";
import { getAllVilles } from "@/services/villeService";
import { Ville } from "@/types";

interface InscriptionFormData {
  nom: string;
  logo?: string;
  mail: string;
  nomContact: string;
  telephoneContact: string;
  typeLogementAccepte: "standard" | "luxe" | "tous";
  deductionFrais: "deductTous" | "deductMenage" | "inclus";
  tva: "TTC" | "HT";
  accepteGestionPartielle: boolean;
  accepteResidencePrincipale: boolean;
  superficieMin: number;
  nombreChambresMin: number;
  villesIds: string[];
  zoneCouverte?: string;
  urlAvis?: string;
}

// Type étendu pour inclure l'id
interface FormuleWithId extends FormuleFormData {
  id: string;
}

export const useInscriptionForm = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formules, setFormules] = useState<FormuleWithId[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedVillesIds, setSelectedVillesIds] = useState<string[]>([]);
  const [villes, setVilles] = useState<Ville[]>([]);
  const [villesLoading, setVillesLoading] = useState(true);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();

  // Charger les villes au montage du composant
  useEffect(() => {
    const loadVilles = async () => {
      setVillesLoading(true);
      try {
        const villesData = await getAllVilles();
        setVilles(villesData);
      } catch (error) {
        console.error("Erreur lors du chargement des villes:", error);
        toast.error("Impossible de charger les villes");
      } finally {
        setVillesLoading(false);
      }
    };

    loadVilles();
  }, []);

  const form = useForm<InscriptionFormData>({
    defaultValues: {
      nom: "",
      mail: "",
      nomContact: "",
      telephoneContact: "",
      typeLogementAccepte: "tous",
      deductionFrais: "deductTous",
      tva: "TTC",
      accepteGestionPartielle: false,
      accepteResidencePrincipale: false,
      superficieMin: 0,
      nombreChambresMin: 0,
      villesIds: [],
      zoneCouverte: "",
      urlAvis: ""
    }
  });

  const handleStepOne = useCallback(async (data: InscriptionFormData) => {
    setLoading(true);
    try {
      // Validation et traitement de l'étape 1
      console.log("Step 1 data:", data);
      setStepWithScroll(2);
    } catch (error) {
      console.error("Error in step 1:", error);
      toast.error("Erreur lors de la validation de l'étape 1");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddFormule = useCallback((formule: FormuleFormData) => {
    setFormules(prev => [...prev, { ...formule, id: `formule_${Date.now()}` }]);
  }, []);

  const handleDeleteFormule = useCallback((formuleId: string) => {
    setFormules(prev => prev.filter(f => f.id !== formuleId));
  }, []);

  const handleLogoChange = useCallback(async (file: File) => {
    setIsUploadingLogo(true);
    try {
      // Simulation du upload de logo
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Erreur lors du téléchargement du logo");
    } finally {
      setIsUploadingLogo(false);
    }
  }, []);

  const handleVilleSelection = useCallback((villeId: string) => {
    setSelectedVillesIds(prev => {
      if (prev.includes(villeId)) {
        return prev.filter(id => id !== villeId);
      } else {
        return [...prev, villeId];
      }
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    
    try {
      const formData = form.getValues();
      
      console.log("handleSubmit: Form data:", formData);
      console.log("handleSubmit: Selected villes IDs:", selectedVillesIds);
      
      const insertData = {
        nom: formData.nom,
        mail: formData.mail,
        telephone_contact: formData.telephoneContact,
        nom_contact: formData.nomContact,
        type_logement_accepte: formData.typeLogementAccepte,
        deduction_frais: formData.deductionFrais,
        tva: formData.tva,
        accepte_gestion_partielle: formData.accepteGestionPartielle,
        accepte_residence_principale: formData.accepteResidencePrincipale,
        superficie_min: formData.superficieMin,
        nombre_chambres_min: formData.nombreChambresMin,
        zone_couverte: formData.zoneCouverte || 'locale',
        url_avis: formData.urlAvis,
        validated: false,
        villes_ids: selectedVillesIds
      };
      
      console.log("handleSubmit: Insert data:", insertData);
      
      // Créer la conciergerie - ajusté pour correspondre au schéma de la DB
      const { data: conciergerie, error: conciergerieError } = await supabase
        .from('conciergeries')
        .insert([insertData])
        .select()
        .single();

      if (conciergerieError) {
        console.error("handleSubmit: Conciergerie error:", conciergerieError);
        console.error("handleSubmit: Error details:", {
          message: conciergerieError.message,
          details: conciergerieError.details,
          hint: conciergerieError.hint,
          code: conciergerieError.code
        });
        toast.error("Erreur lors de la création de la conciergerie");
        return { success: false, error: conciergerieError };
      }

      console.log("handleSubmit: Conciergerie créée avec succès:", conciergerie);
      toast.success("Inscription réussie ! Vous allez être redirigé vers la page de souscription.");
      
      // Redirection vers la page de souscription avec l'ID de la conciergerie
      router.push(`/subscription?conciergerieId=${conciergerie.id}`);
      
      return { success: true, conciergerie };
    } catch (error) {
      toast.error("Une erreur est survenue");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [form, signUp, router, selectedVillesIds]);

  // Validation de l'étape 1
  const isStepOneValid = form.watch("nom") && 
                        form.watch("mail") && 
                        form.watch("nomContact") &&
                        form.watch("telephoneContact");

  // Wrapper pour setStep qui inclut le scroll vers le haut
  const setStepWithScroll = useCallback((newStep: number) => {
    setStep(newStep);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return {
    form,
    step,
    setStep: setStepWithScroll,
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
    isStepOneValid,
    isUploadingLogo
  };
};



