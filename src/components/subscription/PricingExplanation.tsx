
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
          icon: "xx",
          title: "Maintien abonnement gratuit",
          description: "Vous resterez sur un abonnement gratuit."
        };
      } else {
        return {
          icon: "xx",
          title: "Montant inchangé",
          description: "Vous conserverez votre abonnement actuel."
        };
      }
    }
    
    if (finalSelectedAmount > currentAmount) {
      if (currentAmount === 0) {
        return {
          icon: " ️",
          title: "Passage de gratuit à payant",
          description: "Vous passerez à un abonnement payant. Un paiement sera demandé après la mise à jour de votre souscription."
        };
      } else {
        return {
          icon: " ️",
          title: "Montant sélectionné supérieur",
          description: "Vous augmenterez le montant de votre abonnement. Un ajustement au prorata sera calculé pour le mois en cours. Le nouveau montant total sera facturé lors de votre prochaine échéance mensuelle."
        };
      }
    }
    
    if (finalSelectedAmount === 0 && currentAmount > 0) {
      return {
        icon: ":",
        title: "Passage de payant à gratuit",
        description: "Vous passerez à un abonnement gratuit. Votre abonnement payant en cours sera résilié, et vous ne serez plus facturé à partir d'aujourd'hui. Vous conservez votre visibilité gratuite selon les options activées."
      };
    }
    
    // finalSelectedAmount < currentAmount && finalSelectedAmount > 0
    return {
      icon: "!️",
      title: "Montant sélectionné inférieur",
      description: "Vous diminuerez le montant de votre abonnement. Un avoir correspondant à la différence sera automatiquement déduit de votre prochaine facture. Le nouveau tarif réduit prend effet immédiatement."
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

