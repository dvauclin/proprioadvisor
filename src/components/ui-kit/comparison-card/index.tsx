
import React from 'react';
import { Card } from '@/components/ui-kit/card';
import { Button } from '@/components/ui-kit/button';
import { Conciergerie, Formule } from '@/types';
import CardHeader from './CardHeader';
import CommissionSection from './CommissionSection';
import DurationSection from './DurationSection';
import FeesSection from './FeesSection';
import ServicesSection from './ServicesSection';
import PropertiesSection from './PropertiesSection';
import FavoriteButton from '@/components/ui-kit/FavoriteButton';

interface ComparisonCardProps {
  conciergerie: Conciergerie;
  formule: Formule;
  subscription?: {
    website_url?: string;
    phone_number_value?: string;
    website_link?: boolean;
    phone_number?: boolean;
  };
  onDevisClick: () => void;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  conciergerie,
  formule,
  subscription,
  onDevisClick
}) => {


  // NEW LOGIC: Use effective score (scoreManuel) instead of calculated score
  const effectiveScore = conciergerie.scoreManuel ?? 0;
  const isNotRecommended = effectiveScore <= 0;

  // Ensure tva is properly typed
  const tvaValue = typeof conciergerie.tva === 'boolean' 
    ? (conciergerie.tva ? 'TTC' : 'HT') 
    : (conciergerie.tva as "TTC" | "HT" | undefined);

  // Ensure typeLogementAccepte is properly typed
  const typeLogementValue = conciergerie.typeLogementAccepte as "standard" | "luxe" | "tous";

  return (
    <Card className={`p-6 h-full flex flex-col relative ${isNotRecommended ? 'opacity-60' : ''}`}>
      <CardHeader 
        conciergerie={conciergerie} 
        formule={formule}
        subscription={subscription} 
      />
      
      <div className="space-y-4 flex-1">
        <CommissionSection commission={formule.commission} tva={tvaValue} />
        <DurationSection dureeGestionMin={formule.dureeGestionMin} />
        <FeesSection 
          fraisDemarrage={formule.fraisDemarrage}
          fraisMenageHeure={formule.fraisMenageHeure}
          abonnementMensuel={formule.abonnementMensuel}
          fraisReapprovisionnement={formule.fraisReapprovisionnement}
          forfaitReapprovisionnement={formule.forfaitReapprovisionnement}
          locationLinge={formule.locationLinge}
          prixLocationLinge={formule.prixLocationLinge}
          fraisSupplementaireLocation={formule.fraisSupplementaireLocation}
        />
        <ServicesSection services={formule.servicesInclus} />
        <PropertiesSection 
          typeLogementAccepte={typeLogementValue}
          superficieMin={conciergerie.superficieMin}
          nombreChambresMin={conciergerie.nombreChambresMin}
          accepteGestionPartielle={conciergerie.accepteGestionPartielle}
          accepteResidencePrincipale={conciergerie.accepteResidencePrincipale}
        />
      </div>
      
      {/* Add devis button with favorite button inline */}
      <div className="mt-4 pt-4 border-t">
        {isNotRecommended ? (
          <button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed py-2 px-4 rounded">
            Non recommandée
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <FavoriteButton 
              formule={formule} 
              conciergerie={conciergerie} 
              className="flex-shrink-0"
            />
            <Button onClick={onDevisClick} className="flex-1">
              Demander un devis
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComparisonCard;
