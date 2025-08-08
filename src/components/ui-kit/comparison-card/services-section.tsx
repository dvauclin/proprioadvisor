import React from "react";
import { renderServiceWithIcon } from "@/utils/serviceMapping";

interface ServicesSectionProps {
  services: string[] | undefined;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="border rounded-md p-2">
        <div className="text-sm text-gray-600">Services inclus</div>
        <div className="text-xs">Aucun service renseigné</div>
      </div>
    );
  }

  return (
    <div className="border rounded-md p-2">
      <div className="text-sm text-gray-600 mb-1">Services inclus</div>
      <div className="flex flex-wrap gap-1">
        {services.map((serviceId, i) => (
          <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded-md border text-xs">
            {renderServiceWithIcon(serviceId)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;

