"use client";

import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapbox } from '@/hooks/useMapbox';
import { useVillesData } from '@/hooks/useVillesData';
import MapTokenInput from './MapTokenInput';
import MapLoading from './MapLoading';
import MapError from './MapError';
import MapRenderer from './MapRenderer';
import CityLinks from './CityLinks';

interface MapboxMapProps {
  onVilleSelect?: (villeSlug: string) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ onVilleSelect }) => {
  // Custom hooks for Mapbox token and villes data
  const { mapboxToken, setMapboxToken, loading: tokenLoading, error: tokenError } = useMapbox();
  const { villes, conciergerieCounts, loading: villesLoading, error: villesError } = useVillesData();
  
  // If no Mapbox token, show token input form
  if (mapboxToken === '' && !process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN) {
    return (
      <MapTokenInput 
        onTokenSubmit={(token) => {
          setMapboxToken(token);
          window.location.reload();
        }} 
      />
    );
  }

  // Show loading state
  if (tokenLoading || villesLoading) {
    return <MapLoading />;
  }

  // Show error state
  if (tokenError || villesError) {
    return <MapError errorMessage={tokenError || villesError || 'Une erreur est survenue'} />;
  }

  return (
    <div className="w-full">
      {/* Mapbox Map with all cities */}
      <MapRenderer 
        villes={villes} 
        conciergerieCounts={conciergerieCounts} 
        onVilleSelect={onVilleSelect} 
      />
      
      {/* List of principal cities below the map */}
      <CityLinks villes={villes} onVilleSelect={onVilleSelect} />
    </div>
  );
};

export default MapboxMap;
