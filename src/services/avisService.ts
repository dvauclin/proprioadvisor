
import { supabase } from "@/integrations/supabase/client";
import { Avis } from "@/types";

export const getAvisByConciergerie = async (conciergerieId: string): Promise<Avis[]> => {
  try {
    const { data, error } = await supabase
      .from('avis')
      .select('*')
      .eq('conciergerie_id', conciergerieId)
      .eq('valide', true) // Seuls les avis validés sont visibles
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching avis:", error);
      return [];
    }
    
    return data.map(avis => ({
      id: avis.id,
      conciergerieId: avis.conciergerie_id,
      userId: undefined,
      emetteur: avis.emetteur,
      date: avis.date,
      note: avis.note,
      commentaire: avis.commentaire,
      valide: avis.valide,
      createdAt: avis.created_at
    }));
  } catch (error) {
    console.error("Unexpected error fetching avis:", error);
    return [];
  }
};

export const addAvis = async (avisData: {
  conciergerieId: string;
  emetteur: string;
  note: number;
  commentaire?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("🚀 Tentative d'ajout d'avis via Edge Function:", avisData);

    // Validation des données côté client
    if (!avisData.conciergerieId?.trim()) {
      return { success: false, error: "L'identifiant de la conciergerie est requis" };
    }
    if (!avisData.emetteur?.trim()) {
      return { success: false, error: "Le nom est requis" };
    }
    if (!avisData.note || avisData.note < 1 || avisData.note > 5) {
      return { success: false, error: "Une note entre 1 et 5 est requise" };
    }

    // Appeler la fonction Edge au lieu d'insérer directement
    const { data, error } = await supabase.functions.invoke('submit-avis', {
      body: {
        conciergerieId: avisData.conciergerieId,
        emetteur: avisData.emetteur.trim(),
        note: avisData.note,
        commentaire: avisData.commentaire?.trim() || ''
      }
    });

    if (error) {
      console.error("❌ Erreur fonction Edge:", error);
      return { 
        success: false, 
        error: "Erreur lors de l'envoi de votre avis. Veuillez réessayer." 
      };
    }

    if (!data.success) {
      console.error("❌ Échec fonction Edge:", data.error);
      return { 
        success: false, 
        error: data.error || "Erreur lors de l'envoi de votre avis." 
      };
    }
    
    console.log("✅ Avis ajouté avec succès via Edge Function:", data);
    return { success: true };
    
  } catch (error) {
    console.error("💥 Erreur inattendue:", error);
    return { 
      success: false, 
      error: "Une erreur inattendue s'est produite. Veuillez réessayer." 
    };
  }
};
