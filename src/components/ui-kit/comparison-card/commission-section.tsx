import React from "react";

interface CommissionSectionProps {
  commission: number;
  tva?: number;
}

const CommissionSection: React.FC<CommissionSectionProps> = ({ commission, tva }) => {
  const tvaText = typeof tva === "number" ? ` (TVA: ${tva}%)` : "";
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600">Commission</div>
      <div className="font-semibold">{commission}%{tvaText}</div>
    </div>
  );
};

export default CommissionSection;

