import { supabase } from "@/integrations/supabase/client";
import { Conciergerie, Formule } from "@/types";
import { transformConciergerieFromDB, transformConciergerieForDB, transformFormuleForDB } from "./conciergerieTransformService";
import { triggerWebhook } from "@/utils/webhookService";

export const getConciergeriesToValidate = async (): Promise<Conciergerie[]> => {
  console.log("Fetching conciergeries to validate...");
  
  const { data: conciergeries, error } = await supabase
    .from('conciergeries')
    .select(`
      *,
      formules (*),
      subscriptions (*)
    `)
    .eq('validated', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching conciergeries to validate:", error);
    throw error;
  }

  console.log("Raw conciergeries to validate data:", conciergeries);

  const transformedConciergeries: Conciergerie[] = conciergeries.map(transformConciergerieFromDB);
  return transformedConciergeries;
};

export const getValidatedConciergeries = async (): Promise<Conciergerie[]> => {
  console.log("Fetching validated conciergeries...");
  
  const { data: conciergeries, error } = await supabase
    .from('conciergeries')
    .select(`
      *,
      formules (*),
      subscriptions (*)
    `)
    .eq('validated', true);
    // âŒ REMOVED: .order('nom') - let frontend handle sorting by score

  if (error) {
    console.error("Error fetching validated conciergeries:", error);
    throw error;
  }

  console.log("Raw validated conciergeries data:", conciergeries);

  const transformedConciergeries: Conciergerie[] = conciergeries.map(transformConciergerieFromDB);
  return transformedConciergeries;
};

export const getConciergerieById = async (id: string): Promise<Conciergerie | null> => {
  try {
    const { data, error } = await supabase
      .from('conciergeries')
      .select(`
        *,
        formules (*),
        subscriptions (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching conciergerie by ID:", error);
      return null;
    }

    return transformConciergerieFromDB(data);
  } catch (error) {
    console.error("Unexpected error fetching conciergerie by ID:", error);
    return null;
  }
};

export const validateConciergerie = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get conciergerie data before validation for webhook
    const { data: conciergerie, error: fetchError } = await supabase
      .from('conciergeries')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching conciergerie:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Update validation status
    const { error } = await supabase
      .from('conciergeries')
      .update({ validated: true })
      .eq('id', id);
    
    if (error) {
      console.error("Error validating conciergerie:", error);
      return { success: false, error: error.message };
    }

    // Trigger webhook after successful validation
    try {
      console.log("ðŸš€ Triggering validation webhook for:", conciergerie.nom);
      
      // Get selected cities data with slug for URL
      const { data: villes } = await supabase
        .from('villes')
        .select('id, nom, slug')
        .in('id', conciergerie.villes_ids || []);

      // Get subscription data
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('total_points, monthly_amount')
        .eq('conciergerie_id', id)
        .single();

      // Format cities with URLs
      const villesFormatted = (villes || []).map(ville => ({
        nom: ville.nom,
        url: `https://proprioadvisor.fr/conciergerie/${ville.slug}`
      }));

      await triggerWebhook({
        type: "validation_inscription",
        nom: conciergerie.nom,
        email: conciergerie.mail || '',
        villesSelectionnees: villesFormatted,
        conciergerieID: id,
        nombrePoints: subscription?.total_points || 0,
        montantAbonnement: subscription?.monthly_amount || 0,
        timestamp: new Date().toISOString(),
      });

      console.log("âœ… Validation webhook sent successfully");
    } catch (webhookError) {
      console.error("âŒ Webhook error:", webhookError);
      // Don't fail the validation if webhook fails
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error validating conciergerie:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

export const rejectConciergerie = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('conciergeries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error rejecting conciergerie:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error rejecting conciergerie:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

export const saveConciergerie = async (conciergerieData: Conciergerie & { formules: Formule[]; deletedFormulesIds?: string[] }): Promise<any> => {
  console.log("Saving conciergerie data:", conciergerieData);
  
  try {
    const dbData = transformConciergerieForDB(conciergerieData);
    
    console.log("Transformed data for database:", dbData);

    let conciergerieResult;
    
    if (conciergerieData.id) {
      console.log("Updating conciergerie with ID:", conciergerieData.id);
      const { data, error } = await supabase
        .from('conciergeries')
        .update(dbData)
        .eq('id', conciergerieData.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating conciergerie:", error);
        throw error;
      }
      conciergerieResult = data;

      // Trigger webhook for conciergerie modification
      try {
        await triggerWebhook({
          type: "modification_conciergerie",
          conciergerie: {
            id: conciergerieData.id,
            nom: conciergerieData.nom,
            email: conciergerieData.mail,
          },
          date: new Date().toISOString(),
        });
      } catch (webhookError) {
        console.error("Erreur lors de l'envoi du webhook:", webhookError);
      }
    } else {
      console.log("Creating new conciergerie");
      const { data, error } = await supabase
        .from('conciergeries')
        .insert(dbData)
        .select()
        .single();

      if (error) {
        console.error("Error creating conciergerie:", error);
        throw error;
      }
      conciergerieResult = data;
    }

    console.log("Conciergerie saved successfully:", conciergerieResult);

    if (conciergerieData.formules && conciergerieData.formules.length > 0) {
      console.log("Processing formules:", conciergerieData.formules);
      
      if (conciergerieData.deletedFormulesIds && conciergerieData.deletedFormulesIds.length > 0) {
        console.log("Deleting formules:", conciergerieData.deletedFormulesIds);
        const { error: deleteError } = await supabase
          .from('formules')
          .delete()
          .in('id', conciergerieData.deletedFormulesIds);

        if (deleteError) {
          console.error("Error deleting formules:", deleteError);
          throw deleteError;
        }
      }

      for (const formule of conciergerieData.formules) {
        const formuleDbData = transformFormuleForDB({
          ...formule,
          conciergerieId: conciergerieResult.id
        });

        console.log("Processing formule:", formule, "DB data:", formuleDbData);

        if (formule.id && !formule.id.startsWith('temp-')) {
          console.log("Updating formule with ID:", formule.id);
          const { error: updateError } = await supabase
            .from('formules')
            .update(formuleDbData)
            .eq('id', formule.id);

          if (updateError) {
            console.error("Error updating formule:", updateError);
            throw updateError;
          }
        } else {
          console.log("Creating new formule");
          const { error: insertError } = await supabase
            .from('formules')
            .insert(formuleDbData);

          if (insertError) {
            console.error("Error creating formule:", insertError);
            throw insertError;
          }
        }
      }
    }

    return conciergerieResult;
  } catch (error) {
    console.error("Error in saveConciergerie:", error);
    throw error;
  }
};

export const deleteConciergerie = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error: formulesError } = await supabase
      .from('formules')
      .delete()
      .eq('conciergerie_id', id);
    
    if (formulesError) {
      console.error("Error deleting formules:", formulesError);
      return { success: false, error: formulesError.message };
    }

    const { error: conciergerieError } = await supabase
      .from('conciergeries')
      .delete()
      .eq('id', id);
    
    if (conciergerieError) {
      console.error("Error deleting conciergerie:", conciergerieError);
      return { success: false, error: conciergerieError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting conciergerie:", error);
    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
};

