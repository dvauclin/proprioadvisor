
import React from 'react';
import { Button } from '@/components/ui-kit/button';

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onTokenSubmit }) => {
  return (
    <div className="p-6 border rounded-lg shadow-sm my-4">
      <h2 className="text-xl font-semibold mb-4">Configuration Mapbox requise</h2>
      <p className="mb-4">Pour afficher la carte, veuillez entrer votre clÃ© API publique Mapbox :</p>
      <div className="flex gap-2">
        <input 
          type="text" 
          className="flex-1 px-3 py-2 border rounded-md"
          placeholder="Entrez votre clÃ© publique Mapbox" 
          onChange={(e) => {
            const token = e.target.value;
            if (token) {
              localStorage.setItem('mapbox_token', token);
              onTokenSubmit(token);
            }
          }}
        />
        <Button 
          type="button"
          onClick={() => window.location.reload()}
        >
          Valider
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        La clÃ© sera enregistrÃ©e localement dans votre navigateur.
      </p>
    </div>
  );
};

export default MapTokenInput;

