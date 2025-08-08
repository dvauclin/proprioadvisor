
import React from 'react';

interface RenewalDayDisplayProps {
  renewalDay: number | null;
  isCurrentPaymentInfo?: boolean;
}

export const RenewalDayDisplay: React.FC<RenewalDayDisplayProps> = ({
  renewalDay,
  isCurrentPaymentInfo = false
}) => {
  if (!renewalDay) return null;

  const getRenewalText = () => {
    if (isCurrentPaymentInfo) {
      return `(renouvelÃ© le ${renewalDay} de chaque mois)`;
    } else {
      return `Prochain renouvellement : le ${renewalDay} de chaque mois`;
    }
  };

  const getSpecialNote = () => {
    if (renewalDay === 31) {
      if (isCurrentPaymentInfo) {
        return "Pour les mois ne comportant pas de 31, le renouvellement aura lieu le dernier jour du mois.";
      } else {
        return "Si un mois ne comporte pas de 31, le renouvellement se fera le dernier jour du mois.";
      }
    }
    return null;
  };

  const specialNote = getSpecialNote();

  return (
    <div>
      <p className={`text-sm ${isCurrentPaymentInfo ? 'text-blue-800' : 'text-gray-600'}`}>
        {getRenewalText()}
      </p>
      {specialNote && (
        <p className={`text-xs mt-1 ${isCurrentPaymentInfo ? 'text-blue-700' : 'text-gray-500'} italic`}>
          {specialNote}
        </p>
      )}
    </div>
  );
};

