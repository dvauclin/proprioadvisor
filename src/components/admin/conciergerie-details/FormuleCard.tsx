import React from "react";
import { Formule } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui-kit/card";
import { Badge } from "@/components/ui-kit/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-kit/table";
import { renderServiceWithIcon } from "@/utils/serviceMapping.tsx";

interface FormuleCardProps {
  formule: Formule;
}

// Define the service order for consistent display
const servicesOrder = [
  'menage', 
  'checkInOut', 
  'remiseDesClefs', 
  'gestionAnnonce', 
  'assistance247', 
  'photosProfessionnelles', 
  'reapprovisionnement', 
  'fournitureLinge', 
  'maintenanceReparations'
];

const FormuleCard: React.FC<FormuleCardProps> = ({
  formule,
}) => {
  // Helper to format reapprovisionnement display
  const getReapproDisplayText = () => {
    if (!formule.fraisReapprovisionnement || formule.fraisReapprovisionnement === 'inclus') {
      return '';
    } else if (formule.fraisReapprovisionnement === 'reel') {
      return 'CoÃ»t rÃ©el refacturÃ©';
    } else if (formule.fraisReapprovisionnement === 'forfait' && formule.forfaitReapprovisionnement) {
      return `${formule.forfaitReapprovisionnement}â‚¬/mois`;
    }
    return '';
  };

  // Helper to format linen display
  const getLinenDisplayText = () => {
    if (!formule.locationLinge || formule.locationLinge === 'inclus') {
      return '';
    } else {
      // Only show (option) for optional items, nothing for mandatory
      const status = formule.locationLinge === 'optionnel' ? ' (option)' : '';
      return formule.prixLocationLinge > 0 ? `${formule.prixLocationLinge}â‚¬/mois${status}` : '';
    }
  };

  // Helper to format duration display
  const getDurationDisplayText = () => {
    return formule.dureeGestionMin === 0 
      ? "Pas de durÃ©e minimum d'engagement"
      : `${formule.dureeGestionMin} mois`;
  };
  
  // Sort services based on predefined order
  const sortedServices = [...formule.servicesInclus].sort((a, b) => {
    const aIndex = servicesOrder.indexOf(a);
    const bIndex = servicesOrder.indexOf(b);
    // Put known services first in the defined order
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    // If only one service is in the order list, prioritize it
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    // For custom services not in the order list, sort alphabetically
    return a.localeCompare(b);
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50">
        <CardTitle>{formule.nom}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CritÃ¨re</TableHead>
                <TableHead>Valeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Commission</TableCell>
                <TableCell>{formule.commission}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">DurÃ©e minimale</TableCell>
                <TableCell>{getDurationDisplayText()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Frais de mÃ©nage</TableCell>
                <TableCell>{formule.fraisMenageHeure}â‚¬/h</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Frais de dÃ©marrage</TableCell>
                <TableCell>{formule.fraisDemarrage}â‚¬</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Abonnement mensuel</TableCell>
                <TableCell>{formule.abonnementMensuel}â‚¬</TableCell>
              </TableRow>
              
              {formule.fraisSupplementaireLocation > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Frais supp. par location</TableCell>
                  <TableCell>{formule.fraisSupplementaireLocation}â‚¬/location</TableCell>
                </TableRow>
              )}
              
              {getReapproDisplayText() && (
                <TableRow>
                  <TableCell className="font-medium">RÃ©appro.</TableCell>
                  <TableCell>{getReapproDisplayText()}</TableCell>
                </TableRow>
              )}
              
              {getLinenDisplayText() && (
                <TableRow>
                  <TableCell className="font-medium">Location de linge</TableCell>
                  <TableCell>{getLinenDisplayText()}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div>
            <h4 className="font-medium mb-2">Services inclus</h4>
            <div className="flex flex-wrap gap-2">
              {sortedServices.map((service, index) => (
                <Badge key={index} variant="outline" className="flex items-center">
                  {renderServiceWithIcon(service)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormuleCard;

