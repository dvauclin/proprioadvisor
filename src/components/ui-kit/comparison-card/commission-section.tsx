import React from "react";

interface CommissionSectionProps {
  commission: number;
  tva?: string | null;
}

const CommissionSection: React.FC<CommissionSectionProps> = ({ commission, tva }) => {
  // Fonction pour formater la TVA
  const formatTva = (tva: string | null | undefined) => {
    if (!tva) return "";
    
    if (tva === "TTC/HT") {
      return " (TTC/HT)";
    }
    
    // Si c'est un pourcentage
    if (tva.includes("%")) {
      return ` (${tva})`;
    }
    
    // Si c'est TTC ou HT
    if (tva === "TTC" || tva === "HT") {
      return ` (${tva})`;
    }
    
    return "";
  };

  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600">Commission</div>
      <div className="font-semibold">{commission}%{formatTva(tva)}</div>
    </div>
  );
};

export default CommissionSection;

