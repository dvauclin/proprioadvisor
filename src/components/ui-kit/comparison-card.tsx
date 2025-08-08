
import React from "react";
import CommissionSection from "@/components/ui-kit/comparison-card/commission-section";
import DurationSection from "@/components/ui-kit/comparison-card/duration-section";
import FeesSection from "@/components/ui-kit/comparison-card/fees-section";
import ServicesSection from "@/components/ui-kit/comparison-card/services-section";
import FavoriteButton from "@/components/ui-kit/favorite-button";
import { Button } from "@/components/ui-kit/button";

interface ComparisonCardProps {
  formule: any;
  conciergerie?: any;
  subscription?: any;
  onDevisClick?: () => void;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ formule, conciergerie, subscription, onDevisClick }) => {
  void subscription; // currently unused
  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="font-semibold text-lg mb-4">{formule?.nom || "Formule"}</h3>
      <div className="space-y-4">
        <CommissionSection commission={formule?.commission || 0} tva={conciergerie?.tva} />
        <DurationSection dureeGestionMin={formule?.dureeGestionMin || 0} />
        <FeesSection
          fraisDemarrage={formule?.fraisDemarrage}
          fraisMenageHeure={formule?.fraisMenageHeure}
          abonnementMensuel={formule?.abonnementMensuel}
          fraisReapprovisionnement={formule?.fraisReapprovisionnement}
          forfaitReapprovisionnement={formule?.forfaitReapprovisionnement}
          locationLinge={formule?.locationLinge}
          prixLocationLinge={formule?.prixLocationLinge}
          fraisSupplementaireLocation={formule?.fraisSupplementaireLocation}
        />
        <ServicesSection services={formule?.servicesInclus || []} />
      </div>
      <div className="flex items-center gap-2 mt-6">
        <FavoriteButton formule={formule} conciergerie={conciergerie} className="flex-shrink-0" />
        {onDevisClick && (
          <Button onClick={onDevisClick} className="flex-1">
            Demander un devis
          </Button>
        )}
      </div>
    </div>
  );
};

export default ComparisonCard;

