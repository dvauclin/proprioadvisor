"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui-kit/use-toast";
import { Conciergerie, Ville, Formule } from "@/types";

// Import refactored hooks
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { useVilleSelection } from "@/hooks/useVilleSelection";
import { inscriptionSchema } from "@/hooks/useInscriptionSchema";
import { supabase } from "@/integrations/supabase/client";
import { transformFormuleForDB } from "@/services/conciergerieTransformService";

// Extended schema for admin (including score and contact fields)
import * as z from "zod";

export const adminConciergerieSchema = inscriptionSchema.extend({
  score: z.preprocess(
    (val) => (val === "" ? undefined : val), // Treat empty string as undefined to avoid coercion to 0
    z.coerce
      .number({ invalid_type_error: "Le score doit Ãªtre un nombre." })
      .optional()
      .nullable()
  ),
  nomContact: z.string().optional(),
  telephoneContact: z.string().optional(),
  urlAvis: z.string().optional(),
});

export type AdminConciergerieFormValues = z.infer<typeof adminConciergerieSchema>;

interface UseEditConciergerieFormProps {
  conciergerie?: Conciergerie;
  formules?: Formule[];
  onSave?: (conciergerie: Conciergerie & { formules: Formule[] }) => void;
  onCancel?: () => void;
}

export const useEditConciergerieForm = ({
  conciergerie,
  formules: initialFormules = [],
  onSave,
  onCancel
}: UseEditConciergerieFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formules, setFormules] = useState<Formule[]>(initialFormules);
  const [deletedFormulesIds, setDeletedFormulesIds] = useState<string[]>([]);

  console.log("useEditConciergerieForm - received conciergerie:", conciergerie);
  console.log("useEditConciergerieForm - received formules:", initialFormules);

  // Form initialization with conciergerie data
  const form = useForm<AdminConciergerieFormValues>({
    resolver: zodResolver(adminConciergerieSchema),
    defaultValues: {
      nom: "",
      mail: "",
      logo: "",
      typeLogementAccepte: "standard",
      deductionFrais: "deductTous",
      tva: "TTC",
      accepteGestionPartielle: false,
      accepteResidencePrincipale: false,
      superficieMin: 0,
      nombreChambresMin: 0,
      villesIds: [],
      zoneCouverte: "",
      score: null,
      nomContact: "",
      telephoneContact: "",
      urlAvis: "",
    },
    mode: "onChange"
  });

  // Update form values when conciergerie data changes
  useEffect(() => {
    if (conciergerie) {
      console.log("Updating form with conciergerie data:", conciergerie);
      
      form.reset({
        nom: conciergerie.nom || "",
        mail: conciergerie.mail || "",
        logo: conciergerie.logo || "",
        typeLogementAccepte: (conciergerie.typeLogementAccepte as "standard" | "luxe" | "tous") || "standard",
        deductionFrais: (conciergerie.deductionFrais as "inclus" | "deductTous" | "deductMenage") || "deductTous",
        tva: (typeof conciergerie.tva === 'string' ? conciergerie.tva as "TTC" | "HT" : (conciergerie.tva ? "TTC" : "HT")) || "TTC",
        accepteGestionPartielle: conciergerie.accepteGestionPartielle || false,
        accepteResidencePrincipale: conciergerie.accepteResidencePrincipale || false,
        superficieMin: conciergerie.superficieMin || 0,
        nombreChambresMin: conciergerie.nombreChambresMin || 0,
        villesIds: conciergerie.villesIds || [],
        zoneCouverte: conciergerie.zoneCouverte || "",
        score: conciergerie.scoreManuel ?? null,
        nomContact: conciergerie.nomContact || "",
        telephoneContact: conciergerie.telephoneContact || "",
        urlAvis: conciergerie.urlAvis || "",
      });
    }
  }, [conciergerie, form]);

  // Update formules when initialFormules changes
  useEffect(() => {
    console.log("Updating formules with:", initialFormules);
    setFormules(initialFormules);
  }, [initialFormules]);

  // Import custom hooks
  const { logoPreview, isUploadingLogo, logoUrl, uploadError, handleLogoChange, setLogoPreview } = useLogoUpload();
  const { selectedVillesIds, handleVilleSelection, setSelectedVillesIds } = useVilleSelection(form);
  
  // Set logo preview if conciergerie has a logo
  useEffect(() => {
    if (conciergerie?.logo) {
      console.log("Setting logo preview from existing conciergerie:", conciergerie.logo);
      setLogoPreview(conciergerie.logo);
    }
  }, [conciergerie, setLogoPreview]);

  // Set selected villes if conciergerie has villesIds
  useEffect(() => {
    if (conciergerie?.villesIds && conciergerie.villesIds.length > 0) {
      console.log("Setting selected villes:", conciergerie.villesIds);
      setSelectedVillesIds(conciergerie.villesIds);
    }
  }, [conciergerie, setSelectedVillesIds]);

  // RÃ©cupÃ©ration des villes depuis Supabase
  const [villes, setVilles] = useState<Ville[]>([]);
  const [villesLoading, setVillesLoading] = useState(true);

  useEffect(() => {
    const fetchVilles = async () => {
      setVillesLoading(true);
      try {
        const { data, error } = await supabase.from('villes').select('*');
        if (error) throw error;
        
        // Transform the data to match the Ville interface
        const transformedVilles: Ville[] = data.map(ville => ({
          id: ville.id,
          nom: ville.nom,
          description: ville.description || '',
          descriptionLongue: ville.description_longue || '',
          titleSeo: ville.title_seo || '',
          slug: ville.slug,
          latitude: ville.latitude,
          longitude: ville.longitude,
          villesLiees: ville.villes_liees || []
        }));
        
        console.log("Fetched villes:", transformedVilles);
        setVilles(transformedVilles);
      } catch (error) {
        console.error('Error fetching villes:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les villes",
          variant: "destructive"
        });
      } finally {
        setVillesLoading(false);
      }
    };

    fetchVilles();
  }, [toast]);

  const handleStepOne = async (data: AdminConciergerieFormValues) => {
    console.log("Step one data:", data);
    
    // Improved logo selection logic with better prioritization
    let finalLogoUrl = "";
    
    if (logoUrl) {
      // New logo was successfully uploaded
      finalLogoUrl = logoUrl;
      console.log("Using new uploaded Supabase Storage logo:", logoUrl);
    } else if (uploadError) {
      // Upload failed, but keep existing logo if any
      finalLogoUrl = conciergerie?.logo || "";
      console.log("Upload failed, keeping existing logo:", finalLogoUrl);
    } else if (conciergerie?.logo) {
      // No new upload attempted, keep existing logo
      finalLogoUrl = conciergerie.logo;
      console.log("No new upload, keeping existing logo:", finalLogoUrl);
    }
    
    data.logo = finalLogoUrl;

    // Add selected cities
    data.villesIds = selectedVillesIds;
    
    console.log("Step one completed with logo URL:", finalLogoUrl);
    setStep(2);
  };

  const handleAddFormule = async (formuleData: any) => {
    if (!conciergerie?.id) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la formule : conciergerie non trouvÃ©e",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Adding formule with data:", formuleData);

      // Transform formule data for database
      const formuleForDB = transformFormuleForDB({
        ...formuleData,
        id: crypto.randomUUID(),
        conciergerieId: conciergerie.id,
        createdAt: new Date().toISOString()
      });

      console.log("Inserting formule to DB:", formuleForDB);

      // Insert into database
      const { data, error } = await supabase
        .from('formules')
        .insert(formuleForDB)
        .select()
        .single();

      if (error) {
        console.error("Database error adding formule:", error);
        throw error;
      }

      console.log("Successfully inserted formule:", data);

      // Create the new formule object with proper typing and value transformation
      const newFormule: Formule = {
        id: data.id,
        nom: data.nom,
        conciergerieId: data.conciergerie_id,
        commission: data.commission || 0,
        dureeGestionMin: data.duree_gestion_min || 0,
        servicesInclus: data.services_inclus || [],
        fraisMenageHeure: data.frais_menage_heure || 0,
        fraisDemarrage: data.frais_demarrage || 0,
        abonnementMensuel: data.abonnement_mensuel || 0,
        fraisReapprovisionnement: data.frais_reapprovisionnement as 'reel' | 'forfait' | 'inclus' || 'inclus',
        forfaitReapprovisionnement: data.forfait_reapprovisionnement || 0,
        locationLinge: data.location_linge as 'inclus' | 'optionnel' | 'obligatoire' || 'inclus',
        prixLocationLinge: data.prix_location_linge || 0,
        fraisSupplementaireLocation: data.frais_supplementaire_location || 0,
        createdAt: data.created_at || undefined
      };

      setFormules([...formules, newFormule]);
      
      toast({
        title: "Formule ajoutÃ©e",
        description: `La formule "${formuleData.nom}" a Ã©tÃ© ajoutÃ©e et sauvegardÃ©e`,
      });
    } catch (error: any) {
      console.error("Error adding formule:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de la formule",
        variant: "destructive"
      });
    }
  };

  const handleEditFormule = async (index: number, formuleData: any) => {
    const formuleToEdit = formules[index];
    
    if (!formuleToEdit?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier la formule : ID non trouvÃ©",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Editing formule with data:", formuleData);
      console.log("Original formule:", formuleToEdit);

      // Transform formule data for database
      const formuleForDB = transformFormuleForDB({
        ...formuleData,
        id: formuleToEdit.id,
        conciergerieId: formuleToEdit.conciergerieId,
        createdAt: formuleToEdit.createdAt
      });

      console.log("Updating formule in DB:", formuleForDB);

      // Update in database
      const { data, error } = await supabase
        .from('formules')
        .update(formuleForDB)
        .eq('id', formuleToEdit.id)
        .select()
        .single();

      if (error) {
        console.error("Database error updating formule:", error);
        throw error;
      }

      console.log("Successfully updated formule:", data);

      // Update the formule in state with proper typing and value transformation
      const updatedFormules = [...formules];
      updatedFormules[index] = {
        id: data.id,
        nom: data.nom,
        conciergerieId: data.conciergerie_id,
        commission: data.commission || 0,
        dureeGestionMin: data.duree_gestion_min || 0,
        servicesInclus: data.services_inclus || [],
        fraisMenageHeure: data.frais_menage_heure || 0,
        fraisDemarrage: data.frais_demarrage || 0,
        abonnementMensuel: data.abonnement_mensuel || 0,
        fraisReapprovisionnement: data.frais_reapprovisionnement as 'reel' | 'forfait' | 'inclus' || 'inclus',
        forfaitReapprovisionnement: data.forfait_reapprovisionnement || 0,
        locationLinge: data.location_linge as 'inclus' | 'optionnel' | 'obligatoire' || 'inclus',
        prixLocationLinge: data.prix_location_linge || 0,
        fraisSupplementaireLocation: data.frais_supplementaire_location || 0,
        createdAt: data.created_at || undefined
      };
      
      setFormules(updatedFormules);
      
      toast({
        title: "Formule modifiÃ©e",
        description: `La formule "${formuleData.nom}" a Ã©tÃ© modifiÃ©e et sauvegardÃ©e`,
      });
    } catch (error: any) {
      console.error("Error updating formule:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la modification de la formule",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFormule = async (index: number) => {
    const formuleToDelete = formules[index];
    
    if (!formuleToDelete?.id) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la formule : ID non trouvÃ©",
        variant: "destructive"
      });
      return;
    }

    try {
      // Delete from database if it's not a temporary formule
      if (!formuleToDelete.id.startsWith('temp-')) {
        const { error } = await supabase
          .from('formules')
          .delete()
          .eq('id', formuleToDelete.id);

        if (error) throw error;
      }

      // Remove from state
      setFormules(formules.filter((_, i) => i !== index));
      
      toast({
        title: "Formule supprimÃ©e",
        description: "La formule a Ã©tÃ© supprimÃ©e avec succÃ¨s",
      });
    } catch (error: any) {
      console.error("Error deleting formule:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression de la formule",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = form.getValues();
      console.log("Form values on submit:", values);
      
      // Improved logo selection logic for final submission
      let finalLogoUrl = "";
      
      if (logoUrl) {
        // New logo was successfully uploaded
        finalLogoUrl = logoUrl;
        console.log("Final submission: Using new uploaded Supabase Storage logo:", logoUrl);
      } else if (uploadError) {
        // Upload failed, but keep existing logo if any
        finalLogoUrl = conciergerie?.logo || "";
        console.log("Final submission: Upload failed, keeping existing logo:", finalLogoUrl);
      } else if (conciergerie?.logo) {
        // No new upload attempted, keep existing logo
        finalLogoUrl = conciergerie.logo;
        console.log("Final submission: No new upload, keeping existing logo:", finalLogoUrl);
      }
      
      console.log("Final logo URL for submission:", finalLogoUrl);
      
      const conciergerieData = {
        id: conciergerie?.id,
        nom: values.nom,
        mail: values.mail,
        logo: finalLogoUrl,
        typeLogementAccepte: values.typeLogementAccepte,
        deductionFrais: values.deductionFrais,
        tva: values.tva,
        accepteGestionPartielle: values.accepteGestionPartielle,
        accepteResidencePrincipale: values.accepteResidencePrincipale,
        superficieMin: values.superficieMin,
        nombreChambresMin: values.nombreChambresMin,
        villesIds: values.villesIds,
        zoneCouverte: values.zoneCouverte,
        scoreManuel: values.score ?? null,
        nomContact: values.nomContact || "",
        telephoneContact: values.telephoneContact || "",
        urlAvis: values.urlAvis || "",
        villeId: conciergerie?.villeId || (values.villesIds?.[0] || ''),
        validated: conciergerie?.validated || false,
        formules: formules,
        deletedFormulesIds: deletedFormulesIds,
      };
      
      console.log("Submitting conciergerie data with urlAvis:", conciergerieData);
      
      // Call the onSave callback with conciergerie data
      if (onSave) {
        onSave(conciergerieData as unknown as Conciergerie & { formules: Formule[] });
      }
      
      toast({
        title: "Modifications enregistrÃ©es",
        description: "Les modifications de la conciergerie ont Ã©tÃ© enregistrÃ©es"
      });
      
      // Reset form state
      setStep(1);
      setDeletedFormulesIds([]);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setStep(1);
    setDeletedFormulesIds([]);
  };

  return {
    form,
    step,
    setStep,
    handleStepOne,
    handleSubmit,
    handleCancel,
    handleAddFormule,
    handleEditFormule,
    handleDeleteFormule,
    handleLogoChange,
    handleVilleSelection,
    loading,
    formules,
    logoPreview,
    selectedVillesIds,
    villes,
    villesLoading,
    isUploadingLogo
  };
};

