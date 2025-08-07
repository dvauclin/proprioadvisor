
import React from "react";
import { Home } from "lucide-react";

interface PropertiesSectionProps {
  typeLogementAccepte: "standard" | "luxe" | "tous";
  superficieMin: number;
  nombreChambresMin: number;
  accepteGestionPartielle: boolean;
  accepteResidencePrincipale: boolean;
}

const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  typeLogementAccepte,
  superficieMin,
  nombreChambresMin,
  accepteGestionPartielle,
  accepteResidencePrincipale
}) => {
  // Helper function to get property type label
  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'standard':
        return 'Standard';
      case 'luxe':
        return 'Luxe';
      case 'tous':
        return 'Tous types';
      default:
        return type;
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Home className="h-5 w-5 text-brand-chartreuse mr-2" />
        <h3 className="font-medium text-sm">Logements acceptés</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 pl-7 text-xs px-0">
        <div>Type <span className="font-medium">{getPropertyTypeLabel(typeLogementAccepte)}</span></div>
        
        {superficieMin > 0 && <div>Superficie min <span className="font-medium">{superficieMin} m²</span></div>}
        
        {nombreChambresMin > 0 && <div>Chambres min <span className="font-medium">{nombreChambresMin}</span></div>}
        
        <div>Rés. principale <span className="font-medium">{accepteResidencePrincipale ? 'Oui' : 'Non'}</span></div>
        <div>Gestion partielle <span className="font-medium">{accepteGestionPartielle ? 'Oui' : 'Non'}</span></div>
      </div>
    </div>
  );
};

export default PropertiesSection;
