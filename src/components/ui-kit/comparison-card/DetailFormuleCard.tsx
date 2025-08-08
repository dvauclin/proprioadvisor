
import React from "react";
import { Formule, Conciergerie } from "@/types";
import { Button } from "@/components/ui-kit/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-kit/card";
import CommissionSection from "./CommissionSection";
import DurationSection from "./DurationSection";
import FeesSection from "./FeesSection";
import ServicesSection from "./ServicesSection";
import FavoriteButton from "@/components/ui-kit/FavoriteButton";

interface DetailFormuleCardProps {
  formule: Formule;
  conciergerie: Partial<Conciergerie>;
  onDevisClick: () => void;
}

const DetailFormuleCard: React.FC<DetailFormuleCardProps> = ({
  formule,
  conciergerie,
  onDevisClick
}) => {
  // Ensure tva is properly typed
  const tvaValue = typeof conciergerie.tva === 'boolean' 
    ? (conciergerie.tva ? 'TTC' : 'HT') 
    : (conciergerie.tva as "TTC" | "HT" | undefined);

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <CardHeader className="bg-gray-50">
        <CardTitle>
          <h2 className="text-lg font-semibold">{formule.nom}</h2>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
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
        
        {/* Always show buttons on detail pages - removed the score condition */}
        <div className="flex items-center gap-2 mt-4">
          <FavoriteButton 
            formule={formule} 
            conciergerie={conciergerie as Conciergerie} 
            className="flex-shrink-0"
          />
          <Button onClick={onDevisClick} className="flex-1">
            Demander un devis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailFormuleCard;
