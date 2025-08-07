import { supabase } from "@/integrations/supabase/client";
import { Formule, Conciergerie } from "@/types";
import { transformConciergerieFromDB, transformFormuleFromDB } from "./conciergerieTransformService";

export const getFormuleById = async (id: string): Promise<Formule | null> => {
  try {
    const { data, error } = await supabase
      .from('formules')
      .select(`
        *,
        conciergeries (
          id,
          nom
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching formule by ID:", error);
      return null;
    }
    
    return transformFormuleFromDB(data);
  } catch (error) {
    console.error("Unexpected error fetching formule by ID:", error);
    return null;
  }
};

export const getFormulesByVilleId = async (villeId: string): Promise<(Formule & { conciergerie?: Conciergerie })[]> => {
  try {
    const { data, error } = await supabase
      .from('formules')
      .select(`
        *,
        conciergeries!inner (
          *,
          subscriptions (*)
        )
      `)
      .contains('conciergeries.villes_ids', [villeId])
      .eq('conciergeries.validated', true);

    if (error) {
      console.error('Error fetching formules by ville ID:', error);
      return [];
    }
    
    if (!data) return [];

    return data.map(formule => ({
      ...transformFormuleFromDB(formule),
      conciergerie: formule.conciergeries ? transformConciergerieFromDB(formule.conciergeries) : undefined
    }));
  } catch (error) {
    console.error('Error in getFormulesByVilleId:', error);
    return [];
  }
};

export const filterFormules = (formules: (Formule & { conciergerie?: Conciergerie })[], filters: any) => {
  return formules;
};
