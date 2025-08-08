
import React from 'react';
import { Button } from '@/components/ui-kit/button';

interface MapErrorProps {
  errorMessage: string;
}

const MapError: React.FC<MapErrorProps> = ({ errorMessage }) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-600 mb-4">{errorMessage}</p>
      <Button 
        variant="outline" 
        onClick={() => window.location.reload()}
      >
        Réessayer
      </Button>
    </div>
  );
};

export default MapError;
