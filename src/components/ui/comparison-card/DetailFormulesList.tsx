"use client";

import React, { useState } from "react";
import { Formule, Conciergerie } from "@/types";
import DetailFormuleCard from "./DetailFormuleCard";
import DevisModal from "@/components/conciergerie/DevisModal";

interface DetailFormulesListProps {
  formules: Formule[];
  conciergerie: Partial<Conciergerie>;
}

const DetailFormulesList: React.FC<DetailFormulesListProps> = ({
  formules,
  conciergerie
}) => {
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState<{ formuleId: string; conciergerieId: string; } | null>(null);

  const handleDevisRequest = (formuleId: string, conciergerieId: string) => {
    setSelectedFormule({
      formuleId,
      conciergerieId
    });
    setShowDevisModal(true);
  };

  // Find the selected formule data for the DevisModal
  const selectedFormuleData = selectedFormule ? 
    formules.find(f => f.id === selectedFormule.formuleId) : null;

  // Create the formule with conciergerie data for DevisModal
  const formuleWithConciergerie = selectedFormuleData ? {
    ...selectedFormuleData,
    conciergerie: conciergerie as Conciergerie
  } : null;

  if (formules.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune formule disponible pour cette conciergerie</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid affichant 1 formule par ligne */}
      <div className="grid grid-cols-1 gap-6">
        {formules.map(formule => {
          // Create a clean formule object without the conciergerie property to avoid conflicts
          const cleanFormule: Formule = {
            id: formule.id,
            nom: formule.nom,
            conciergerieId: formule.conciergerieId,
            commission: formule.commission,
            dureeGestionMin: formule.dureeGestionMin,
            servicesInclus: formule.servicesInclus,
            fraisMenageHeure: formule.fraisMenageHeure,
            fraisDemarrage: formule.fraisDemarrage,
            abonnementMensuel: formule.abonnementMensuel,
            fraisReapprovisionnement: formule.fraisReapprovisionnement,
            forfaitReapprovisionnement: formule.forfaitReapprovisionnement,
            locationLinge: formule.locationLinge,
            prixLocationLinge: formule.prixLocationLinge,
            fraisSupplementaireLocation: formule.fraisSupplementaireLocation,
            createdAt: formule.createdAt
          };

          return (
            <DetailFormuleCard
              key={formule.id}
              formule={cleanFormule}
              conciergerie={conciergerie}
              onDevisClick={() => handleDevisRequest(formule.id, conciergerie.id || '')}
            />
          );
        })}
      </div>

      <DevisModal
        open={showDevisModal}
        onOpenChange={setShowDevisModal}
        selectedFormule={selectedFormule}
        formuleData={formuleWithConciergerie}
      />
    </>
  );
};

export default DetailFormulesList;
