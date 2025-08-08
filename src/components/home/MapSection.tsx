
import React from "react";
import MapboxMap from "@/components/map/MapboxMap";

interface MapSectionProps {
  onVilleSelect: (villeSlug: string) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ onVilleSelect }) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choisissez votre ville</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explorez notre carte interactive et sélectionnez une ville pour découvrir les conciergeries disponibles dans cette zone.
          </p>
        </div>
        
        <MapboxMap onVilleSelect={onVilleSelect} />
      </div>
    </section>
  );
};

export default MapSection;

