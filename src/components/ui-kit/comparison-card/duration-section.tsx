import React from "react";

interface DurationSectionProps {
  dureeGestionMin: number;
  variant?: "default" | "details";
}

const DurationSection: React.FC<DurationSectionProps> = ({ dureeGestionMin, variant = "default" }) => {
  const paddingClass = variant === "details" ? "p-6" : "p-5";

  return (
    <div className={`border rounded-md ${paddingClass}`}>
      <div className="text-sm text-gray-600 mb-2">Durée d'engagement</div>
      <div className="text-sm">
        <span className="font-medium">{dureeGestionMin === 0 ? "Aucun engagement" : `${dureeGestionMin} mois`}</span>
      </div>
    </div>
  );
};

export default DurationSection;

