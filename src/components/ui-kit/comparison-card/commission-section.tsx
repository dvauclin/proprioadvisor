import React from "react";

interface CommissionSectionProps {
  commission: number;
  tva?: string | null;
  variant?: "default" | "details";
}

const CommissionSection: React.FC<CommissionSectionProps> = ({ commission, tva, variant = "default" }) => {
  // Fonction pour formater la TVA
  const formatTva = (tva: string | null | undefined) => {
    if (!tva) return "";
    
    if (tva === "TTC/HT") {
      return " TTC/HT";
    }
    
    // Si c'est un pourcentage
    if (tva.includes("%")) {
      return ` ${tva}`;
    }
    
    // Si c'est TTC ou HT
    if (tva === "TTC" || tva === "HT") {
      return ` ${tva}`;
    }
    
    return "";
  };

  const paddingClass = variant === "details" ? "p-5" : "p-4";

  return (
    <div className={`border rounded-md ${paddingClass}`}>
      <div className="text-sm text-gray-600 mb-2">Commission</div>
      <div className="text-sm">
        <span className="font-medium text-lg">{commission}%</span>
        {formatTva(tva) && <span className="text-sm font-medium">{formatTva(tva)}</span>}
      </div>
    </div>
  );
};

export default CommissionSection;

