
import React from 'react';
import { Info } from 'lucide-react';

interface PricingExplanationProps {
  currentAmount: number;
  selectedAmount: number;
}

export const PricingExplanation: React.FC<PricingExplanationProps> = ({
  currentAmount,
  selectedAmount
}) => {
  const getExplanation = () => {
    // If no custom amount is selected, use default calculation
    const finalSelectedAmount = selectedAmount;
    
    if (currentAmount === finalSelectedAmount) {
      if (currentAmount === 0) {
        return {
          icon: "ðŸŸ°",
          title: "Maintien abonnement gratuit",
          description: "Vous resterez sur un abonnement gratuit."
        };
      } else {
        return {
          icon: "ðŸŸ°",
          title: "Montant inchangÃ©",
          description: "Vous conserverez votre abonnement actuel."
        };
      }
    }
    
    if (finalSelectedAmount > currentAmount) {
      if (currentAmount === 0) {
        return {
          icon: "â¬†ï¸",
          title: "Passage de gratuit Ã  payant",
          description: "Vous passerez Ã  un abonnement payant. Un paiement sera demandÃ© aprÃ¨s la mise Ã  jour de votre souscription."
        };
      } else {
        return {
          icon: "â¬†ï¸",
          title: "Montant sÃ©lectionnÃ© supÃ©rieur",
          description: "Vous augmenterez le montant de votre abonnement. Un ajustement au prorata sera calculÃ© pour le mois en cours. Le nouveau montant total sera facturÃ© lors de votre prochaine Ã©chÃ©ance mensuelle."
        };
      }
    }
    
    if (finalSelectedAmount === 0 && currentAmount > 0) {
      return {
        icon: "â›”",
        title: "Passage de payant Ã  gratuit",
        description: "Vous passerez Ã  un abonnement gratuit. Votre abonnement payant en cours sera rÃ©siliÃ©, et vous ne serez plus facturÃ© Ã  partir d'aujourd'hui. Vous conservez votre visibilitÃ© gratuite selon les options activÃ©es."
      };
    }
    
    // finalSelectedAmount < currentAmount && finalSelectedAmount > 0
    return {
      icon: "â¬‡ï¸",
      title: "Montant sÃ©lectionnÃ© infÃ©rieur",
      description: "Vous diminuerez le montant de votre abonnement. Un avoir correspondant Ã  la diffÃ©rence sera automatiquement dÃ©duit de votre prochaine facture. Le nouveau tarif rÃ©duit prend effet immÃ©diatement."
    };
  };

  const explanation = getExplanation();

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{explanation.icon}</span>
            <span className="font-medium text-blue-800">{explanation.title}</span>
          </div>
          <p className="text-sm text-blue-700">{explanation.description}</p>
        </div>
      </div>
    </div>
  );
};

