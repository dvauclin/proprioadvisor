import React from "react";
import { getServiceLabel } from "@/utils/serviceMapping";

interface ServicesSectionProps {
  services: string[] | undefined;
  variant?: "default" | "details";
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services, variant = "default" }) => {
  const paddingClass = variant === "details" ? "p-5" : "p-4";

  if (!services || services.length === 0) {
    return (
      <div className={`border rounded-md ${paddingClass}`}>
        <div className="text-sm text-gray-600">Services inclus</div>
        <div className="text-xs">Aucun service renseigné</div>
      </div>
    );
  }

  return (
    <div className={`border rounded-md ${paddingClass}`}>
      <div className="text-sm text-gray-600 mb-2">Services inclus</div>
      <div className="flex flex-wrap gap-1">
        {services.map((serviceId, i) => (
          <span key={i} className="inline-flex items-center px-1.5 py-0.5 rounded-md border text-xs">
            {getServiceLabel(serviceId)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;

