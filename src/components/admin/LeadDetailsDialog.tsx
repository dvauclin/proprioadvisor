import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-kit/dialog";
import { Badge } from "@/components/ui-kit/badge";
import { Lead } from "@/types";
interface LeadDetailsDialogProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}
const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({
  lead,
  open,
  onClose
}) => {
  if (!lead) return null;
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails du lead</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Nom</h4>
              <p>{lead.nom}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Email</h4>
              <p>{lead.mail}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Téléphone</h4>
              <p>{lead.telephone}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Date</h4>
              <Badge variant="outline">
                {lead.date ? new Date(lead.date).toLocaleDateString() : 'Date non disponible'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Ville</h4>
              <p>{lead.ville}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Adresse</h4>
              <p>{lead.adresse}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Superficie</h4>
              <p>{lead.superficie} m²</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Chambres</h4>
              <p>{lead.nombreChambres}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Type de bien</h4>
              <p>{lead.typeBien}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Durée de mise à disposition</h4>
            <p>{lead.dureeEspacementDisposition}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Résidence principale</h4>
              <Badge variant={lead.residencePrincipale ? "default" : "secondary"}>
                {lead.residencePrincipale ? "Oui" : "Non"}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600">Plusieurs logements</h4>
              <Badge variant={lead.plusieursLogements ? "default" : "secondary"}>
                {lead.plusieursLogements ? "Oui" : "Non"}
              </Badge>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-gray-600">Prestations recherchées</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {lead.prestationsRecherchees && Array.isArray(lead.prestationsRecherchees) ? lead.prestationsRecherchees.map((prestation, index) => <Badge key={index} variant="outline">
                    {prestation}
                  </Badge>) : <p className="text-sm text-gray-500">Aucune prestation spécifiée</p>}
            </div>
          </div>
          
          {(lead.conciergerieNom || lead.formuleNom) && <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 rounded-md">
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Conciergerie</h4>
                <p className="font-medium text-blue-800">
                  {lead.conciergerieNom || "Non spécifiée"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600">Formule</h4>
                <p className="font-medium text-blue-800">
                  {lead.formuleNom || "Non spécifiée"}
                </p>
              </div>
            </div>}
          
          {lead.message && <div>
              
              
            </div>}
        </div>
      </DialogContent>
    </Dialog>;
};
export default LeadDetailsDialog;

