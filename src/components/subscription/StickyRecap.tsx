import React from 'react';
interface StickyRecapProps {
  totalPoints: number;
  totalMonthlyFee: number;
}
export const StickyRecap: React.FC<StickyRecapProps> = ({
  totalPoints,
  totalMonthlyFee
}) => {
  return <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg border border-gray-200 rounded-full px-6 py-3 flex items-center gap-4 text-sm font-medium">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Points</span>
        <span className="font-semibold text-green-600">{totalPoints}</span>
      </div>
      <div className="w-px h-4 bg-gray-300"></div>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Abonnement</span>
        <span className="font-semibold text-blue-600">{totalMonthlyFee}€/mois</span>
      </div>
    </div>;
};
