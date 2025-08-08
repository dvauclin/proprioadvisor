import React from "react";

interface PropertiesSectionProps {
  typeLogementAccepte?: string;
  accepteResidencePrincipale?: boolean;
  accepteGestionPartielle?: boolean;
  superficieMin?: number;
  nombreChambresMin?: number;
}

const PropertiesSection: React.FC<PropertiesSectionProps> = ({
  typeLogementAccepte,
  accepteResidencePrincipale,
  accepteGestionPartielle,
  superficieMin,
  nombreChambresMin
}) => {
  // Fonction pour obtenir le label du type de logement
  const getTypeLogementLabel = (type: string) => {
    switch (type) {
      case "standard":
        return "Standard";
      case "luxe":
        return "Luxe";
      case "tous":
        return "Tous types";
      default:
        return "Standard";
    }
  };

  // Fonction pour vérifier si une valeur doit être affichée
  const shouldDisplayValue = (value: any, minValue: number = 0) => {
    if (value === undefined || value === null || value === "") return false;
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return !isNaN(numValue) && numValue > minValue;
  };

  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600 mb-2">Logements acceptés</div>
      <div className="space-y-1 text-sm">
        {/* Toujours affiché */}
        <div className="flex justify-between">
          <span>Type de logement</span>
          <span className="font-medium">{getTypeLogementLabel(typeLogementAccepte || "standard")}</span>
        </div>
        <div className="flex justify-between">
          <span>Résidence principale</span>
          <span className="font-medium">{accepteResidencePrincipale ? "Oui" : "Non"}</span>
        </div>
        <div className="flex justify-between">
          <span>Gestion partielle</span>
          <span className="font-medium">{accepteGestionPartielle ? "Oui" : "Non"}</span>
        </div>
        
        {/* Affichage conditionnel */}
        {shouldDisplayValue(superficieMin) && (
          <div className="flex justify-between">
            <span>Superficie minimum</span>
            <span className="font-medium">{superficieMin} m²</span>
          </div>
        )}
        {shouldDisplayValue(nombreChambresMin) && (
          <div className="flex justify-between">
            <span>Nombre de chambres minimum</span>
            <span className="font-medium">{nombreChambresMin}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesSection;
