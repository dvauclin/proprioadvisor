
import React from "react";
import { Clock } from "lucide-react";

interface DurationSectionProps {
  dureeGestionMin: number;
}

const DurationSection: React.FC<DurationSectionProps> = ({ dureeGestionMin }) => {
  const displayText = dureeGestionMin === 0
    ? "Pas de durée minimum d'engagement"
    : `Durée minimum ${dureeGestionMin} mois`;

  return (
    <div className="mb-4 flex items-center">
      <Clock className="h-5 w-5 text-brand-chartreuse mr-2" />
      <span className="text-sm">
        <span className="font-semibold">{displayText}</span>
      </span>
    </div>
  );
};

export default DurationSection;
