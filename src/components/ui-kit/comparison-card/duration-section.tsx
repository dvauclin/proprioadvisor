import React from "react";

interface DurationSectionProps {
  dureeGestionMin: number;
}

const DurationSection: React.FC<DurationSectionProps> = ({ dureeGestionMin }) => {
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600">Durée d'engagement</div>
      <div>{dureeGestionMin === 0 ? "Aucun engagement" : `${dureeGestionMin} mois`}</div>
    </div>
  );
};

export default DurationSection;

