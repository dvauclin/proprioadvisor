
import React from 'react';
import { SubscriptionFormValues } from '@/types/subscription';
import { UseFormReturn } from 'react-hook-form';

interface PointsSectionProps {
  backlinkPoints: number;
  totalMonthlyFee: number;
  paymentPoints: number;
  totalPoints: number;
  form: UseFormReturn<SubscriptionFormValues>;
}

export const PointsSection: React.FC<PointsSectionProps> = ({
  backlinkPoints,
  totalMonthlyFee,
  paymentPoints,
  totalPoints,
  form
}) => {
  const backlinkSelected = form.watch("options.backlink");
  const gmbSelected = form.watch("options.conciergeriePageLink");

  const getPointsMessage = () => {
    if (backlinkSelected && gmbSelected) {
      return "Vous avez déjà 10 points car vous avez déclaré accepter d'ajouter des liens sur votre page d'accueil et sur votre fiche Google.";
    } else if (backlinkSelected) {
      return "Vous avez déjà 5 points car vous avez déclaré accepter d'ajouter un lien sur votre page d'accueil.";
    } else if (gmbSelected) {
      return "Vous avez déjà 5 points car vous avez déclaré accepter d'ajouter un lien sur votre fiche Google.";
    } else {
      return "Vous pourriez avoir déjà 5 points si vous acceptiez d'ajouter un lien sur votre page d'accueil.";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Système de points et positionnement</h3>
      
      <div className="space-y-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold">Points d'options :</span> {backlinkPoints} points
          </p>
          <p className="text-gray-600 text-xs mt-1">
            {getPointsMessage()}
          </p>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-gray-700 text-sm">
            <span className="font-semibold">Points de paiement :</span> {paymentPoints} points
          </p>
          <p className="text-gray-600 text-xs mt-1">
            En payant <span className="font-bold text-amber-600">{totalMonthlyFee}/mois</span>, vous obtenez {paymentPoints} points supplémentaires.
          </p>
        </div>
        
        <div className={`p-3 rounded-lg border-2 ${totalPoints === 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className="text-gray-700">
            <span className="font-semibold">Total :</span> <span className={`font-bold text-xl ${totalPoints === 0 ? 'text-red-600' : 'text-emerald-600'}`}>{totalPoints} points</span>
          </p>
          {totalPoints === 0 ? (
            <p className="text-red-600 text-sm mt-2 font-medium">
              Avec 0 point vous ne serez pas considéré comme une conciergerie partenaire. Les clients ne pourront pas vous contacter et vous serez placé tout en bas des listings. Votre visibilité est quasi nulle. Il faut au moins 1 point pour être considéré comme une conciergerie partenaire.
            </p>
          ) : (
            <p className="text-gray-600 text-xs mt-1">
              Ce score définira votre position dans les listings.
            </p>
          )}
        </div>
      </div>
      
      {totalPoints > 0 && (
        <p className="text-sm text-gray-600 italic">
          C'est simple, si une autre conciergerie de votre ville a moins de points elle sera positionnée derrière, 
          si elle en a plus elle sera positionnée devant.
        </p>
      )}
    </div>
  );
};

