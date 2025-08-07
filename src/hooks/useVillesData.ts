"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Ville } from '@/types';

// Map of regions by city name for demo purposes
// In a real application, this would come from the database
const cityRegions: Record<string, string> = {
  'paris': 'ile-de-france',
  'marseille': 'provence-alpes-cote-azur',
  'lyon': 'auvergne-rhone-alpes',
  'toulouse': 'occitanie',
  'nice': 'provence-alpes-cote-azur',
  'nantes': 'pays-de-la-loire',
  'strasbourg': 'grand-est',
  'montpellier': 'occitanie',
  'bordeaux': 'nouvelle-aquitaine',
  'lille': 'hauts-de-france',
  'rennes': 'bretagne'
};

/**
 * Custom hook to fetch villes and conciergerie counts
 */
export const useVillesData = () => {
  const [villes, setVilles] = useState<Ville[]>([]);
  const [conciergerieCounts, setConciergeriesCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVilles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('villes')
          .select('*')
          .order('nom', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        // Transform data to match Ville type
        const villesData: Ville[] = data.map(ville => ({
          id: ville.id,
          nom: ville.nom,
          description: ville.description || '',
          descriptionLongue: ville.description_longue || '',
          titleSeo: ville.title_seo || '',
          slug: ville.slug,
          latitude: ville.latitude || null,
          longitude: ville.longitude || null,
          departementNumero: ville.departement_numero || '',
          departementNom: ville.departement_nom || '',
          villeMereId: ville.ville_mere_id || undefined,
          region: cityRegions[ville.nom.toLowerCase()] || 'autre', // Add region for filtering
          villesLiees: ville.villes_liees || [], // Include linked cities
          createdAt: ville.created_at
        }));

        setVilles(villesData);
        
        // Fetch conciergerie counts per city
        const { data: conciergeries, error: conciergerieError } = await supabase
          .from('conciergeries')
          .select('villes_ids')
          .eq('validated', true);
          
        if (conciergerieError) {
          console.error('Erreur lors du chargement des conciergeries:', conciergerieError);
        } else if (conciergeries) {
          const counts: Record<string, number> = {};
          conciergeries.forEach(conciergerie => {
            if (conciergerie.villes_ids) {
              conciergerie.villes_ids.forEach((villeId: string) => {
                counts[villeId] = (counts[villeId] || 0) + 1;
              });
            }
          });
          setConciergeriesCounts(counts);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des villes:', err);
        setError('Erreur lors du chargement des villes');
        setLoading(false);
      }
    };

    fetchVilles();
  }, []);

  return { villes, conciergerieCounts, loading, error };
};
