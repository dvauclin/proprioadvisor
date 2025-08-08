import React from "react";

interface ServicesSectionProps {
  services: string[] | undefined;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="border rounded-md p-3">
        <div className="text-sm text-gray-600">Services inclus</div>
        <div className="text-sm">Aucun service renseignÃ©</div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-3">
      <div className="text-sm text-gray-600 mb-2">Services inclus</div>
      <ul className="list-disc pl-5 text-sm">
        {services.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesSection;

