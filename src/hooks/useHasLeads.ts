import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useHasLeads = () => {
  const [hasLeads, setHasLeads] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkHasLeads = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Get user's conciergerie
        const { data: conciergerie, error: conciergerieError } = await supabase
          .from('conciergeries')
          .select('id')
          .eq('mail', user.email)
          .single();

        if (conciergerieError || !conciergerie) {
          setHasLeads(false);
          setLoading(false);
          return;
        }

        // Get formules for this conciergerie
        const { data: formules, error: formulesError } = await supabase
          .from('formules')
          .select('id')
          .eq('conciergerie_id', conciergerie.id);

        if (formulesError || !formules || formules.length === 0) {
          setHasLeads(false);
          setLoading(false);
          return;
        }

        const formuleIds = formules.map(f => f.id);

        // Check if there are any leads for these formules
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('id')
          .in('formule_id', formuleIds)
          .limit(1);

        if (leadsError) {
          console.error('Error checking leads:', leadsError);
          setHasLeads(false);
        } else {
          setHasLeads(leads && leads.length > 0);
        }
      } catch (error) {
        console.error('Error checking if conciergerie has leads:', error);
        setHasLeads(false);
      } finally {
        setLoading(false);
      }
    };

    checkHasLeads();
  }, [user?.email]);

  return { hasLeads, loading };
};
