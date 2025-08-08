import React from "react";

interface DurationSectionProps {
  dureeGestionMin: number;
}

const DurationSection: React.FC<DurationSectionProps> = ({ dureeGestionMin }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600">DurÃ©e d'engagement</div>
      <div className="font-semibold">{dureeGestionMin} mois</div>
    </div>
  );
};

export default DurationSection;

