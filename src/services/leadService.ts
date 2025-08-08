import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types";

export const getLeads = async (): Promise<Lead[]> => {
  try {
    console.log('ðŸ” Starting getLeads for current user...');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('âŒ User not authenticated');
      throw new Error('User not authenticated');
    }

    console.log('âœ… User email:', user.email);

    // Get user's conciergerie
    const { data: conciergerie, error: conciergerieError } = await supabase
      .from('conciergeries')
      .select('id')
      .eq('mail', user.email || '')
      .single();

    if (conciergerieError || !conciergerie) {
      console.log('âŒ No conciergerie found for user:', user.email, conciergerieError);
      return [];
    }

    console.log('âœ… Found conciergerie:', conciergerie.id);

    // Get formules for this conciergerie
    const { data: formules, error: formulesError } = await supabase
      .from('formules')
      .select('id')
      .eq('conciergerie_id', conciergerie.id);

    if (formulesError) {
      throw formulesError;
    }

    if (!formules || formules.length === 0) {
      console.log('âŒ No formules found for conciergerie:', conciergerie.id);
      return [];
    }

    const formuleIds = formules.map(f => f.id);
    console.log('âœ… Formule IDs for leads filtering:', formuleIds);

    // Get leads for these formules
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        formules (
          id,
          nom,
          conciergeries (
            id,
            nom
          )
        )
      `)
      .in('formule_id', formuleIds)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
    
    return data.map(lead => ({
      id: lead.id,
      prestationsRecherchees: lead.prestations_recherchees || [],
      dureeEspacementDisposition: lead.duree_mise_disposition as 'moins3mois' | '3a6mois' | '6a12mois' | 'plus1an',
      superficie: lead.superficie,
      nombreChambres: lead.nombre_chambres,
      typeBien: lead.type_bien as 'standard' | 'luxe',
      adresse: lead.adresse,
      ville: lead.ville,
      nom: lead.nom,
      telephone: lead.telephone,
      mail: lead.mail,
      formuleId: lead.formule_id || undefined,
      message: lead.message || undefined,
      date: lead.date || undefined,
      dateVue: lead.date_vue || undefined,
      plusieursLogements: lead.plusieurs_logements || undefined,
      residencePrincipale: lead.residence_principale || undefined,
      // Ajout des nouvelles propriÃ©tÃ©s
      formuleNom: lead.formules?.nom,
      conciergerieNom: lead.formules?.conciergeries?.nom
    }));
  } catch (error) {
    console.error("Unexpected error fetching leads:", error);
    return [];
  }
};

export const markLeadAsViewed = async (leadId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ date_vue: new Date().toISOString() })
      .eq('id', leadId);

    if (error) {
      console.error('Error marking lead as viewed:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in markLeadAsViewed:', error);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
};

export const submitLead = async (leadData: Omit<Lead, 'id' | 'date'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('leads')
      .insert({
        prestations_recherchees: leadData.prestationsRecherchees,
        duree_mise_disposition: leadData.dureeEspacementDisposition,
        superficie: leadData.superficie,
        nombre_chambres: leadData.nombreChambres,
        type_bien: leadData.typeBien,
        adresse: leadData.adresse,
        ville: leadData.ville,
        nom: leadData.nom,
        telephone: leadData.telephone,
        mail: leadData.mail,
        formule_id: leadData.formuleId,
        message: leadData.message,
        plusieurs_logements: leadData.plusieursLogements,
        residence_principale: leadData.residencePrincipale
      });

    if (error) {
      console.error('Error submitting lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in submitLead:', error);
    return { success: false, error: 'Une erreur inattendue s\'est produite' };
  }
};

export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    console.log('ðŸ” Admin getting all leads...');
    
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        formules (
          id,
          nom,
          conciergeries (
            id,
            nom
          )
        )
      `)
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Error fetching all leads:", error);
      return [];
    }
    
    console.log('âœ… Found', data.length, 'leads total');
    
    return data.map(lead => ({
      id: lead.id,
      prestationsRecherchees: lead.prestations_recherchees || [],
      dureeEspacementDisposition: lead.duree_mise_disposition as 'moins3mois' | '3a6mois' | '6a12mois' | 'plus1an',
      superficie: lead.superficie,
      nombreChambres: lead.nombre_chambres,
      typeBien: lead.type_bien as 'standard' | 'luxe',
      adresse: lead.adresse,
      ville: lead.ville,
      nom: lead.nom,
      telephone: lead.telephone,
      mail: lead.mail,
      formuleId: lead.formule_id || undefined,
      message: lead.message || undefined,
      date: lead.date || undefined,
      dateVue: lead.date_vue || undefined,
      plusieursLogements: lead.plusieurs_logements || undefined,
      residencePrincipale: lead.residence_principale || undefined,
      formuleNom: lead.formules?.nom,
      conciergerieNom: lead.formules?.conciergeries?.nom
    }));
  } catch (error) {
    console.error("Unexpected error fetching all leads:", error);
    return [];
  }
};

