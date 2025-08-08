
import React from "react";
import { List } from "lucide-react";
import { Badge } from "@/components/ui-kit/badge";
import { getServiceLabel } from "@/utils/serviceMapping.tsx";

interface ServicesSectionProps {
  services: string[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  // Order of displayed services - Ensure this exact order
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

  // Sort services based on predefined order
  const sortedServices = [...services].sort((a, b) => {
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
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <List className="h-5 w-5 text-brand-chartreuse mr-2" />
        <h3 className="font-medium text-sm">Services inclus</h3>
      </div>
      <div className="flex flex-wrap gap-1 pl-7 px-0">
        {sortedServices.map(service => 
          <Badge key={service} variant="outline" className="text-xs bg-gray-50 text-gray-700 hover:bg-gray-100">
            {getServiceLabel(service)}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
