
import React from "react";
import { Euro } from "lucide-react";

interface FeesSectionProps {
  fraisDemarrage: number;
  fraisMenageHeure: number;
  abonnementMensuel: number;
  fraisReapprovisionnement?: 'reel' | 'forfait' | 'nonRefactures' | 'inclus';
  forfaitReapprovisionnement?: number;
  locationLinge?: 'optionnel' | 'obligatoire' | 'inclus' | 'nonFourni';
  prixLocationLinge: number;
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
  // Helper to format reapprovisionnement display
  const getReapproDisplayText = () => {
    console.log("Réappro type:", fraisReapprovisionnement, "Forfait:", forfaitReapprovisionnement);
    
    // Ne rien afficher si pas défini ou si explicitement exclu
    if (!fraisReapprovisionnement || fraisReapprovisionnement === 'nonRefactures' || fraisReapprovisionnement === 'inclus') {
      return '';
    } else if (fraisReapprovisionnement === 'reel') {
      return 'Coût réel refacturé';
    } else if (fraisReapprovisionnement === 'forfait' && forfaitReapprovisionnement && forfaitReapprovisionnement > 0) {
      return `${forfaitReapprovisionnement}€/mois`;
    }
    return '';
  };

  // Helper to format linen display
  const getLinenDisplayText = () => {
    if (!locationLinge || locationLinge === 'nonFourni' || locationLinge === 'inclus') {
      return '';
    } else {
      // Only show (option) for optional items, nothing for mandatory
      const status = locationLinge === 'optionnel' ? ' (option)' : '';
      return prixLocationLinge > 0 ? `${prixLocationLinge}€/mois${status}` : '';
    }
  };

  // Create array of fees to display
  const feesToDisplay = [];

  // Ménage - Always show, NC if 0 or null
  feesToDisplay.push({
    label: 'Ménage',
    value: fraisMenageHeure > 0 ? `${fraisMenageHeure}€/h` : 'NC'
  });

  // Démarrage - Always show, 0€ if 0 or null
  feesToDisplay.push({
    label: 'Démarrage',
    value: fraisDemarrage > 0 ? `${fraisDemarrage}€` : '0€'
  });

  // Abonnement - Only show if > 0
  if (abonnementMensuel > 0) {
    feesToDisplay.push({
      label: 'Abonnement',
      value: `${abonnementMensuel}€/mois`
    });
  }

  // Frais supplémentaires - Only show if exists and > 0
  if (fraisSupplementaireLocation && fraisSupplementaireLocation > 0) {
    feesToDisplay.push({
      label: 'Frais supp.',
      value: `${fraisSupplementaireLocation}€/location`
    });
  }

  // Réapprovisionnement - Only show if there's something to display
  const reapproText = getReapproDisplayText();
  if (reapproText) {
    feesToDisplay.push({
      label: 'Réappro.',
      value: reapproText
    });
  }

  // Location linge - Only show if there's something to display
  const linenText = getLinenDisplayText();
  if (linenText) {
    feesToDisplay.push({
      label: 'Location linge',
      value: linenText
    });
  }

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <Euro className="h-5 w-5 text-brand-chartreuse mr-2" />
        <h3 className="font-medium text-sm">Autres frais</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 pl-7 text-xs px-0">
        {feesToDisplay.map((fee, index) => (
          <div key={index}>
            {fee.label} <span className="font-medium">{fee.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesSection;
