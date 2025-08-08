import React from "react";

interface FeesSectionProps {
  fraisDemarrage?: number;
  fraisMenageHeure?: number;
  abonnementMensuel?: number;
  fraisReapprovisionnement?: string;
  forfaitReapprovisionnement?: number;
  locationLinge?: string;
  prixLocationLinge?: number;
  fraisSupplementaireLocation?: number;
}

const FeesSection: React.FC<FeesSectionProps> = ({
  fraisDemarrage,
  fraisMenageHeure,
  abonnementMensuel,
  fraisReapprovisionnement,
  forfaitReapprovisionnement,
  locationLinge,
  prixLocationLinge,
  fraisSupplementaireLocation
}) => {
  // Debug: Log all props to identify the source of "00"
  console.log("FeesSection props:", {
    fraisDemarrage,
    fraisMenageHeure,
    abonnementMensuel,
    fraisReapprovisionnement,
    forfaitReapprovisionnement,
    locationLinge,
    prixLocationLinge,
    fraisSupplementaireLocation
  });

  // Fonction pour afficher le réapprovisionnement selon le type
  const getReapprovisionnementDisplay = () => {
    if (!fraisReapprovisionnement) return null;
    
    switch (fraisReapprovisionnement) {
      case 'reel':
        return "Coût réel refacturé";
      case 'forfait':
        return forfaitReapprovisionnement && forfaitReapprovisionnement > 0 
          ? `${forfaitReapprovisionnement}€/mois`
          : null;
      case 'inclus':
      case 'nonRefactures':
        return null;
      default:
        return null;
    }
  };

  // Fonction pour afficher la location de linge selon le type
  const getLocationLingeDisplay = () => {
    if (!locationLinge || !prixLocationLinge || prixLocationLinge <= 0) return null;
    
    switch (locationLinge) {
      case 'optionnel':
        return `${prixLocationLinge}€/mois (option)`;
      case 'obligatoire':
        return `${prixLocationLinge}€/mois`;
      case 'inclus':
      case 'nonFourni':
        return null;
      default:
        return null;
    }
  };

  // Fonction pour formater les frais de démarrage avec gestion stricte
  const formatFraisDemarrage = (frais: any) => {
    // Si la valeur est undefined, null, ou une chaîne vide
    if (frais === undefined || frais === null || frais === "") return "0€";
    
    // Convertir en nombre si c'est une chaîne
    const numValue = typeof frais === "string" ? parseFloat(frais) : frais;
    
    // Vérifier si c'est un nombre valide
    if (isNaN(numValue)) return "0€";
    
    // Si c'est 0 ou une valeur négative
    if (numValue <= 0) return "0€";
    
    // Retourner le nombre formaté
    return `${numValue}€`;
  };

  // Fonction pour vérifier si une valeur doit être affichée
  const shouldDisplayValue = (value: any, minValue: number = 0) => {
    if (value === undefined || value === null || value === "") return false;
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return !isNaN(numValue) && numValue > minValue;
  };

  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600 mb-2">Autres frais</div>
      <div className="space-y-1 text-sm">
        {/* Toujours affiché - Ménage */}
        <div className="flex justify-between">
          <span>Frais de ménage</span>
          <span className="font-medium">
            {fraisMenageHeure && fraisMenageHeure > 0 ? `${fraisMenageHeure}€/h` : "NC"}
          </span>
        </div>
        
        {/* Toujours affiché - Démarrage */}
        <div className="flex justify-between">
          <span>Frais de démarrage</span>
          <span className="font-medium">
            {formatFraisDemarrage(fraisDemarrage)}
          </span>
        </div>
        
        {/* Affichage conditionnel - Abonnement */}
        {shouldDisplayValue(abonnementMensuel) && (
          <div className="flex justify-between">
            <span>Frais d'abonnement</span>
            <span className="font-medium">{abonnementMensuel}€/mois</span>
          </div>
        )}
        
        {/* Affichage conditionnel - Frais supplémentaires */}
        {shouldDisplayValue(fraisSupplementaireLocation) && (
          <div className="flex justify-between">
            <span>Frais supplémentaires</span>
            <span className="font-medium">{fraisSupplementaireLocation}€/location</span>
          </div>
        )}
        
        {/* Affichage conditionnel - Réapprovisionnement */}
        {getReapprovisionnementDisplay() && (
          <div className="flex justify-between">
            <span>Frais de réapprovisionnement</span>
            <span className="font-medium">{getReapprovisionnementDisplay()}</span>
          </div>
        )}
        
        {/* Affichage conditionnel - Location linge */}
        {getLocationLingeDisplay() && (
          <div className="flex justify-between">
            <span>Frais de location linge</span>
            <span className="font-medium">{getLocationLingeDisplay()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesSection;

