"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui-kit/checkbox";
import { Input } from "@/components/ui-kit/input";
import { Button } from "@/components/ui-kit/button";
import { availableServices } from "@/utils/serviceMapping";
import { FormLabel } from "@/components/ui-kit/form";
import { Plus } from "lucide-react";

interface ServicesSectionProps {
  selectedServices: string[];
  customServices: string[];
  onServiceToggle: (serviceId: string) => void;
  onCustomServiceAdd: (service: string) => void;
  onCustomServiceRemove: (service: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  selectedServices,
  customServices,
  onServiceToggle,
  onCustomServiceAdd,
  onCustomServiceRemove
}) => {
  const [customService, setCustomService] = useState("");
  
  const handleAddCustomService = () => {
    if (customService.trim() && !customServices.includes(customService.trim())) {
      onCustomServiceAdd(customService.trim());
      setCustomService("");
    }
  };

  return (
    <div>
      <FormLabel>Services inclus</FormLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-2 gap-2">
        {availableServices.map(service => (
          <div key={service.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`service-${service.id}`} 
              checked={selectedServices.includes(service.id)} 
              onCheckedChange={() => onServiceToggle(service.id)} 
            />
            <label 
              htmlFor={`service-${service.id}`} 
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {service.label}
            </label>
          </div>
        ))}
      </div>
      
      {/* Services personnalisés */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            placeholder="Service personnalisé" 
            value={customService} 
            onChange={e => setCustomService(e.target.value)} 
            className="flex-1" 
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddCustomService} 
            className="whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
        
        {customServices.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-sm font-medium">Services personnalisés ajoutés</p>
            <div className="flex flex-wrap gap-2">
              {customServices.map((service, index) => (
                <div key={index} className="bg-gray-100 rounded-md px-3 py-1 text-sm flex items-center">
                  {service}
                  <button 
                    type="button" 
                    onClick={() => onCustomServiceRemove(service)} 
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesSection;
