
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DevisForm } from "@/components/DevisForm";
import ConciergerieLogoDisplay from "@/components/ui/ConciergerieLogoDisplay";
import { Formule, Conciergerie } from "@/types";

interface DevisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFormule: { formuleId: string; conciergerieId: string } | null;
  formuleData: (Formule & { conciergerie?: Conciergerie }) | null;
}

const DevisModal: React.FC<DevisModalProps> = ({
  open,
  onOpenChange,
  selectedFormule,
  formuleData
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {formuleData?.conciergerie?.logo && (
              <ConciergerieLogoDisplay 
                logoUrl={formuleData.conciergerie.logo} 
                altText={formuleData.conciergerie.nom || ""} 
                size="md" 
              />
            )}
            Demande de devis
          </DialogTitle>
        </DialogHeader>
        
        {selectedFormule && formuleData && formuleData.conciergerie && (
          <DevisForm 
            formuleId={selectedFormule.formuleId} 
            conciergerieName={formuleData.conciergerie.nom || ''} 
            formuleName={formuleData.nom || ''} 
            onSuccess={() => onOpenChange(false)} 
            conciergerieId={selectedFormule.conciergerieId} 
            conciergerieEmail={formuleData.conciergerie.mail || ''}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DevisModal;
