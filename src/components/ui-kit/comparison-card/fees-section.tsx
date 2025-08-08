import React from "react";

interface FeesSectionProps {
  fraisDemarrage?: number;
  fraisMenageHeure?: number;
  abonnementMensuel?: number;
  fraisReapprovisionnement?: string | number | boolean;
  forfaitReapprovisionnement?: number;
  locationLinge?: string | boolean;
  prixLocationLinge?: number;
  fraisSupplementaireLocation?: number;
}

const FeesSection: React.FC<FeesSectionProps> = (props) => {
  const entries: Array<[string, React.ReactNode]> = [
    ["Frais de dÃ©marrage", props.fraisDemarrage],
    ["MÃ©nage (â‚¬/h)", props.fraisMenageHeure],
    ["Abonnement mensuel", props.abonnementMensuel],
    ["RÃ©approvisionnement", props.fraisReapprovisionnement?.toString()],
    ["Forfait rÃ©appro", props.forfaitReapprovisionnement],
    ["Location linge", typeof props.locationLinge === 'boolean' ? (props.locationLinge ? 'Oui' : 'Non') : props.locationLinge],
    ["Prix location linge", props.prixLocationLinge],
    ["Frais suppl. location", props.fraisSupplementaireLocation],
  ];

  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600 mb-2">Autres frais</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {entries.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">{value ?? 'â€”'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeesSection;

