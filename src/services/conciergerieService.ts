import { supabase } from "@/integrations/supabase/client";
import { Conciergerie, Formule } from "@/types";
import { transformConciergerieFromDB, transformConciergerieForDB, transformFormuleForDB } from "./conciergerieTransformService";
import { triggerConciergerieModification, triggerConciergerieValidation } from "@/utils/webhookService";

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
    .eq('validated', true)
    .order('created_at', { ascending: false });
    // âŒ REMOVED: .order('nom') - let frontend handle sorting by score

  if (error) {
    console.error("Error fetching validated conciergeries:", error);
    throw error;
  }

  console.log("Raw validated conciergeries data:", conciergeries);

  const transformedConciergeries: Conciergerie[] = conciergeries.map(transformConciergerieFromDB);
  return transformedConciergeries;
};

export const getValidatedConciergeriesCount = async (): Promise<number> => {
  console.log("Fetching validated conciergeries count...");
  
  try {
    // Approche simple: récupérer toutes les conciergeries validées et compter
    const { data: conciergeries, error } = await supabase
      .from('conciergeries')
      .select('id')
      .eq('validated', true);

    if (error) {
      console.error("Error fetching validated conciergeries:", error);
      throw error;
    }

    const count = conciergeries ? conciergeries.length : 0;
    console.log("Validated conciergeries count:", count);
    return count;
  } catch (error) {
    console.error("Unexpected error in getValidatedConciergeriesCount:", error);
    return 0;
  }
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
              console.log("🔗 Triggering validation webhook for:", conciergerie.nom);
      
      // Get selected cities data with slug for URL
      // Filter out sentinel values like "other" that are not real city IDs
      const villeIdsFiltered = (conciergerie.villes_ids || []).filter((id: string) => id && id !== 'other');

      let villes: { id: string; nom: string; slug: string }[] | null = [];
      if (villeIdsFiltered.length > 0) {
        const { data, error: villesError } = await supabase
          .from('villes')
          .select('id, nom, slug')
          .in('id', villeIdsFiltered);

        if (villesError) {
          console.error("❌ Erreur lors de la récupération des villes sélectionnées:", villesError, { villeIdsFiltered });
        }
        villes = data || [];
      } else {
        console.log("ℹ️ Aucune ville réelle sélectionnée (hors 'other').", { villes_ids: conciergerie.villes_ids });
      }

      // Get subscription data - une conciergerie ne peut avoir qu'un seul abonnement
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('total_points, monthly_amount')
        .eq('conciergerie_id', id)
        .single();

      console.log("🔍 Subscription query result:", {
        conciergerieId: id,
        subscription,
        subscriptionError,
        hasSubscription: !!subscription
      });

      // Si pas d'abonnement trouvé, c'est normal (conciergerie sans abonnement)
      if (subscriptionError && subscriptionError.code === 'PGRST116') {
        console.log("ℹ️ Aucun abonnement trouvé pour cette conciergerie (normal)");
      } else if (subscriptionError) {
        console.error("❌ Erreur lors de la récupération de l'abonnement:", subscriptionError);
      }

      // Format cities with URLs
      const villesFormatted = (villes || []).map(ville => ({
        nom: ville.nom,
        url: `https://proprioadvisor.fr/conciergerie/${ville.slug}`
      }));

      const webhookData = {
        nom: conciergerie.nom,
        email: conciergerie.mail || '',
        villesSelectionnees: villesFormatted,
        conciergerieID: id,
        nombrePoints: subscription?.total_points || 0,
        montantAbonnement: subscription?.monthly_amount || 0,
        siteWeb: (conciergerie as any).site_web || false,
        urlSiteWeb: (conciergerie as any).url_site_web || '',
      };

      console.log("📤 Webhook data being sent:", webhookData);

      await triggerConciergerieValidation(webhookData);

              console.log("✅ Validation webhook sent successfully");
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
        await triggerConciergerieModification({
          conciergerie_id: conciergerieData.id,
          nom: conciergerieData.nom,
          email: conciergerieData.mail || '',
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

