
import React from "react";
import { Conciergerie } from "@/types";

interface AcceptanceCriteriaSectionProps {
  conciergerie: Conciergerie;
}

const AcceptanceCriteriaSection: React.FC<AcceptanceCriteriaSectionProps> = ({
  conciergerie,
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conciergerie.zoneCouverte && (
          <div>
            <h3 className="text-sm text-gray-500">Zone couverte</h3>
            <p>{conciergerie.zoneCouverte}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm text-gray-500">Type de logement acceptÃ©</h3>
          <p>{getPropertyTypeLabel(conciergerie.typeLogementAccepte)}</p>
        </div>
        
        {conciergerie.superficieMin > 0 && (
          <div>
            <h3 className="text-sm text-gray-500">Superficie minimale</h3>
            <p>{conciergerie.superficieMin} mÂ²</p>
          </div>
        )}
        
        {conciergerie.nombreChambresMin > 0 && (
          <div>
            <h3 className="text-sm text-gray-500">Nombre de chambres minimal</h3>
            <p>{conciergerie.nombreChambresMin}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-sm text-gray-500">Accepte gestion partielle</h3>
          <p>{conciergerie.accepteGestionPartielle ? "Oui" : "Non"}</p>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500">Accepte rÃ©sidence principale</h3>
          <p>{conciergerie.accepteResidencePrincipale ? "Oui" : "Non"}</p>
        </div>
      </div>
    </div>
  );
};

export default AcceptanceCriteriaSection;

