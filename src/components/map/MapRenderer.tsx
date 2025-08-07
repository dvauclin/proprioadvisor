"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Ville } from '@/types';

interface MapRendererProps {
  villes: Ville[];
  conciergerieCounts: Record<string, number>;
  onVilleSelect?: (villeSlug: string) => void;
}

const MapRenderer: React.FC<MapRendererProps> = ({ 
  villes, 
  conciergerieCounts, 
  onVilleSelect 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);

  // Memoize the onVilleSelect callback to prevent unnecessary re-renders
  const handleVilleSelect = useCallback((villeSlug: string) => {
    if (onVilleSelect) {
      onVilleSelect(villeSlug);
    }
  }, [onVilleSelect]);

  useEffect(() => {
    if (!mapContainer.current || !villes.length || !mapboxgl.accessToken) return;

    // Find approximate center of France
    const franceCenterLng = 2.213749;
    const franceCenterLat = 46.227638;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [franceCenterLng, franceCenterLat],
      zoom: 5,
      scrollZoom: false // Disable mouse wheel zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Wait for map to load
    map.current.on('load', () => {
      // Clean up any existing markers and popups
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      markersRef.current = [];
      popupsRef.current = [];

      // Add markers for each city with coordinates
      villes.forEach(ville => {
        if (ville.latitude && ville.longitude) {
          const conciergeries = conciergerieCounts[ville.id] || 0;
          
          // Create popup with city name and number of concierges
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false
          })
          .setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-lg">${ville.nom}</h3>
              <p class="text-sm mt-1">${conciergeries} conciergerie${conciergeries > 1 ? 's' : ''} disponible${conciergeries > 1 ? 's' : ''}</p>
              <button 
                class="mt-2 px-4 py-1 bg-brand-chartreuse text-white rounded-md hover:bg-brand-chartreuse/90 w-full text-center"
                onclick="window.location.href='/conciergerie/${ville.slug}'"
              >
                Voir les détails
              </button>
            </div>
          `);
          
          popupsRef.current.push(popup);

          // Create marker
          const marker = new mapboxgl.Marker({
            color: '#ADFF2F'
          })
            .setLngLat([ville.longitude, ville.latitude])
            .addTo(map.current!);

          // Add click event on marker to open/close popup
          marker.getElement().addEventListener('click', () => {
            // Check if popup is already on map
            const popupOnMap = popup.isOpen();
            
            // Close all other popups first
            popupsRef.current.forEach(p => p.remove());
            
            if (!popupOnMap) {
              popup.setLngLat([ville.longitude, ville.latitude]).addTo(map.current!);
              // Notify parent that a city has been selected
              handleVilleSelect(ville.slug);
            }
          });
          
          markersRef.current.push(marker);
        }
      });
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }

      // Clean up markers and popups
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      markersRef.current = [];
      popupsRef.current = [];
    };
  }, [villes, conciergerieCounts, handleVilleSelect]);

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-lg shadow-md mb-8" />
  );
};

export default MapRenderer;
