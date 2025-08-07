
import React from "react";

interface CommissionSectionProps {
  commission: number;
  tva?: "TTC" | "HT" | null;
}

const CommissionSection: React.FC<CommissionSectionProps> = ({ commission, tva }) => {
  if (commission === undefined) return null;
  
  return (
    <div className="mb-4 flex items-center">
      <div className="bg-green-100 p-2 rounded-full mr-2">
        <span className="text-green-600 font-bold text-xl">
          {commission}%
        </span>
        {tva && (
          <span className="text-green-600 text-sm ml-1">
            {tva}
          </span>
        )}
      </div>
      <span className="text-gray-700">de commission</span>
    </div>
  );
};

export default CommissionSection;
