import React from "react";
import { Formule } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      return 'Coût réel refacturé';
    } else if (formule.fraisReapprovisionnement === 'forfait' && formule.forfaitReapprovisionnement) {
      return `${formule.forfaitReapprovisionnement}€/mois`;
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
      return formule.prixLocationLinge > 0 ? `${formule.prixLocationLinge}€/mois${status}` : '';
    }
  };

  // Helper to format duration display
  const getDurationDisplayText = () => {
    return formule.dureeGestionMin === 0 
      ? "Pas de durée minimum d'engagement"
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
                <TableHead>Critère</TableHead>
                <TableHead>Valeur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Commission</TableCell>
                <TableCell>{formule.commission}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Durée minimale</TableCell>
                <TableCell>{getDurationDisplayText()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Frais de ménage</TableCell>
                <TableCell>{formule.fraisMenageHeure}€/h</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Frais de démarrage</TableCell>
                <TableCell>{formule.fraisDemarrage}€</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Abonnement mensuel</TableCell>
                <TableCell>{formule.abonnementMensuel}€</TableCell>
              </TableRow>
              
              {formule.fraisSupplementaireLocation > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Frais supp. par location</TableCell>
                  <TableCell>{formule.fraisSupplementaireLocation}€/location</TableCell>
                </TableRow>
              )}
              
              {getReapproDisplayText() && (
                <TableRow>
                  <TableCell className="font-medium">Réappro.</TableCell>
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
