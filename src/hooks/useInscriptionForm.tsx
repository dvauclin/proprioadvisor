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
import { transformFormuleForDB } from "@/services/conciergerieTransformService";
import { triggerConciergerieCreation } from "@/utils/webhookService";

interface InscriptionFormData {
  nom: string;
  logo?: string;
  mail: string;
  nomContact: string;
  telephoneContact: string;
  typeLogementAccepte: "standard" | "luxe" | "tous";
  deductionFrais: "deductTous" | "deductMenage" | "inclus";
  // tva removed from step 1; now managed per formule at step 2
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
  tva?: "TTC" | "HT";
}

export const useInscriptionForm = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formules, setFormules] = useState<FormuleWithId[]>([]);
  
  // Log pour tracer les changements d'état des formules
  useEffect(() => {
    console.log("useInscriptionForm: État des formules mis à jour:", formules);
  }, [formules]);
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
      // tva removed from defaults; managed per formule
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
    console.log("handleAddFormule: Ajout d'une formule:", formule);
    const newFormule: FormuleWithId = { 
      ...formule, 
      id: `formule_${Date.now()}`,
      tva: formule.tva || "TTC"
    };
    console.log("handleAddFormule: Nouvelle formule avec ID:", newFormule);
    setFormules(prev => {
      const updatedFormules = [...prev, newFormule];
      console.log("handleAddFormule: Formules mises à jour:", updatedFormules);
      return updatedFormules;
    });
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
      console.log("handleSubmit: Formules à sauvegarder:", formules);
      console.log("handleSubmit: Nombre de formules:", formules.length);
      
      const insertData = {
        nom: formData.nom,
        mail: formData.mail,
        telephone_contact: formData.telephoneContact,
        nom_contact: formData.nomContact,
        type_logement_accepte: formData.typeLogementAccepte,
        deduction_frais: formData.deductionFrais,
         // tva removed from conciergeries insert; handled per formule
        accepte_gestion_partielle: formData.accepteGestionPartielle,
        accepte_residence_principale: formData.accepteResidencePrincipale,
        superficie_min: formData.superficieMin,
        nombre_chambres_min: formData.nombreChambresMin,
        zone_couverte: formData.zoneCouverte || '',
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
      
      // 🔥 TRACKING GTM - Inscription réussie
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          'event': 'inscription_reussie',
          'conciergerie_id': conciergerie.id,
          'conciergerie_nom': conciergerie.nom,
          'conciergerie_mail': conciergerie.mail,
          'conciergerie_ville': conciergerie.villes_ids?.[0] || 'N/A',
          'timestamp': new Date().toISOString(),
          'formules_count': formules.length
        });
      }
      
      // Sauvegarder les formules si elles existent
      console.log("handleSubmit: Vérification des formules à sauvegarder, count:", formules.length);
      if (formules.length > 0) {
        console.log("handleSubmit: Sauvegarde des formules:", formules);
        
        try {
          console.log("handleSubmit: Formules avant transformation:", JSON.stringify(formules, null, 2));
          
          // Transformer les formules pour la base de données en utilisant le service de transformation
          const formulesForDB = formules.map(formule => {
            console.log("handleSubmit: Transformation de la formule:", formule);
            const transformedFormule = transformFormuleForDB({
              ...formule,
              conciergerieId: conciergerie.id
            });
            console.log("handleSubmit: Formule transformée:", transformedFormule);
            
            return {
              id: crypto.randomUUID(),
              ...transformedFormule,
              created_at: new Date().toISOString()
            };
          });
          
          console.log("handleSubmit: Formules transformées pour DB:", formulesForDB);
          
          console.log("handleSubmit: Tentative d'insertion des formules avec client anonyme");
          const { data: formulesData, error: formulesError } = await supabase
            .from('formules')
            .insert(formulesForDB)
            .select();
            
          if (formulesError) {
            console.error("handleSubmit: Erreur lors de la sauvegarde des formules:", formulesError);
            console.error("handleSubmit: Détails de l'erreur:", {
              message: formulesError.message,
              details: formulesError.details,
              hint: formulesError.hint,
              code: formulesError.code
            });
            toast.error("Conciergerie créée mais erreur lors de la sauvegarde des formules");
          } else {
            console.log("handleSubmit: Formules sauvegardées avec succès:", formulesData);
          }
        } catch (error) {
          console.error("handleSubmit: Erreur lors de la sauvegarde des formules:", error);
          toast.error("Conciergerie créée mais erreur lors de la sauvegarde des formules");
        }
      }
      
      // Déclencher le webhook pour l'inscription
      try {
        console.log("🔗 Déclenchement du webhook d'inscription pour:", conciergerie.nom);
        
        await triggerConciergerieCreation({
          conciergerie_id: conciergerie.id,
          nom: conciergerie.nom,
          email: conciergerie.mail || '',
          telephone_contact: conciergerie.telephone_contact || '',
          nom_contact: conciergerie.nom_contact || '',
          type_logement_accepte: conciergerie.type_logement_accepte || '',
          deduction_frais: conciergerie.deduction_frais || false,
          accepte_gestion_partielle: conciergerie.accepte_gestion_partielle || false,
          accepte_residence_principale: conciergerie.accepte_residence_principale || false,
          superficie_min: conciergerie.superficie_min || 0,
          nombre_chambres_min: conciergerie.nombre_chambres_min || 0,
          zone_couverte: conciergerie.zone_couverte || '',
          url_avis: conciergerie.url_avis || '',
          villes_ids: selectedVillesIds,
          nombre_formules: formules.length
        });
        
        console.log("✅ Webhook d'inscription envoyé avec succès");
      } catch (webhookError) {
        console.error("❌ Erreur lors du déclenchement du webhook d'inscription:", webhookError);
        // Ne pas faire échouer l'inscription si le webhook échoue
      }
      
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
  }, [form, signUp, router, selectedVillesIds, formules]);

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



