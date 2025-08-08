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
      <FormLabel className="text-sm">Services inclus</FormLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-1 gap-1">
        {availableServices.map(service => (
          <div key={service.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`service-${service.id}`} 
              checked={selectedServices.includes(service.id)} 
              onCheckedChange={() => onServiceToggle(service.id)} 
            />
            <label 
              htmlFor={`service-${service.id}`} 
              className="text-xs font-medium leading-none cursor-pointer"
            >
              {service.label}
            </label>
          </div>
        ))}
      </div>
      
      {/* Services personnalisés */}
      <div className="mt-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            placeholder="Service personnalisé" 
            value={customService} 
            onChange={e => setCustomService(e.target.value)} 
            className="flex-1 text-sm" 
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddCustomService} 
            className="whitespace-nowrap text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter
          </Button>
        </div>
        
        {customServices.length > 0 && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium">Services personnalisés ajoutés</p>
            <div className="flex flex-wrap gap-1">
              {customServices.map((service, index) => (
                <div key={index} className="bg-gray-100 rounded-md px-2 py-0.5 text-xs flex items-center">
                  {service}
                  <button 
                    type="button" 
                    onClick={() => onCustomServiceRemove(service)} 
                    className="ml-1 text-gray-500 hover:text-red-500"
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

