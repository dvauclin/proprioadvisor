
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to handle Mapbox token retrieval and initialization
 */
export const useMapbox = () => {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Retrieve Mapbox token from localStorage or environment variable
  useEffect(() => {
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
      mapboxgl.accessToken = storedToken;
      setLoading(false);
    } else if (process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN) {
      setMapboxToken(process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN);
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;
      setLoading(false);
    } else {
      // Try to get token from Supabase edge function
      const fetchMapboxToken = async () => {
        try {
          const response = await supabase.functions.invoke('get-mapbox-token');
          if (response.data && response.data.token) {
            setMapboxToken(response.data.token);
            mapboxgl.accessToken = response.data.token;
            localStorage.setItem('mapbox_token', response.data.token);
          }
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors de la récupération du token Mapbox:', err);
          setError('Erreur de connexion à Mapbox');
          setLoading(false);
        }
      };
      fetchMapboxToken();
    }
  }, []);

  return { mapboxToken, loading, error, setMapboxToken };
};
