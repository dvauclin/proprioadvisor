
import React from "react";
import { Filter } from "@/types";
import { Button } from "@/components/ui-kit/button";
import { Checkbox } from "@/components/ui-kit/checkbox";
import { Label } from "@/components/ui-kit/label";
import { Input } from "@/components/ui-kit/input";

import { Slider } from "@/components/ui-kit/slider";
import { propertyTypeOptions } from "@/services/supabaseService";
import { availableServices } from "@/utils/serviceMapping";
import { ScrollArea } from "@/components/ui-kit/scroll-area";

interface ConciergerieFiltersProps {
  filters: Filter;
  onFilterChange: (key: keyof Filter, value: any) => void;
  onServiceToggle: (serviceId: string) => void;
  onResetFilters: () => void;
  onHideFilters: () => void;
}

const ConciergerieFilters: React.FC<ConciergerieFiltersProps> = ({
  filters,
  onFilterChange,
  onServiceToggle,
  onResetFilters,
  onHideFilters
}) => {
  // Filter out the "tous" option from propertyTypeOptions
  const filteredPropertyTypes = propertyTypeOptions.filter(option => option.id !== "tous");
  
  return <div className="mt-4 p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-4">Filtrer les conciergeries</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 className="font-medium mb-2">Type de bien</h3>
          <div className="space-y-2">
            {filteredPropertyTypes.map(option => <div key={option.id} className="flex items-center">
                <input type="radio" id={`type-${option.id}`} name="typeBien" className="mr-2" checked={filters.typeBien === option.id} onChange={() => onFilterChange('typeBien', option.id)} />
                <Label htmlFor={`type-${option.id}`}>{option.label}</Label>
              </div>)}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Options de gestion</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="residence-principale" checked={filters.accepteResidencePrincipale === true} onCheckedChange={checked => onFilterChange('accepteResidencePrincipale', checked === true ? true : undefined)} />
                <Label htmlFor="residence-principale">Accepte les rÃ©sidences principales</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="gestion-partielle" checked={filters.accepteGestionPartielle === true} onCheckedChange={checked => onFilterChange('accepteGestionPartielle', checked === true ? true : undefined)} />
                <Label htmlFor="gestion-partielle">Accepte la gestion partielle</Label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commission" className="mb-1 block">Commission maximale (%)</Label>
              <div className="flex items-center gap-4">
                <Slider id="commission" min={0} max={30} step={1} defaultValue={[filters.commissionMax || 30]} onValueChange={values => onFilterChange('commissionMax', values[0])} className="flex-1" />
                <span className="w-12 text-center font-medium">
                  {filters.commissionMax || 30}%
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="dureeGestionMin" className="mb-1 block">DurÃ©e de mise Ã  disposition envisagÃ©e (mois)</Label>
              <Input id="dureeGestionMin" type="number" value={filters.dureeGestionMin || ''} onChange={e => onFilterChange('dureeGestionMin', parseInt(e.target.value) || 0)} placeholder="DurÃ©e (mois)" className="w-full" min="0" />
            </div>

            <div>
              <Label htmlFor="noteMin" className="mb-1 block">Note minimale</Label>
              <div className="flex items-center gap-4">
                <Slider 
                  id="noteMin" 
                  min={0} 
                  max={5} 
                  step={0.5} 
                  defaultValue={[filters.noteMin || 0]} 
                  onValueChange={values => onFilterChange('noteMin', values[0])} 
                  className="flex-1" 
                />
                <span className="w-12 text-center font-medium">
                  {filters.noteMin || 0}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Services inclus</h3>
          <ScrollArea className="h-80">
            <div className="space-y-2 pr-4">
              {availableServices.map(service => (
                <div key={service.id} className="flex items-center">
                  <Checkbox 
                    id={`service-${service.id}`} 
                    checked={filters.servicesInclus?.includes(service.id) || false} 
                    onCheckedChange={() => onServiceToggle(service.id)} 
                    className="mr-2" 
                  />
                  <Label htmlFor={`service-${service.id}`}>{service.label}</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onResetFilters} className="mr-2">
          RÃ©initialiser
        </Button>
        <Button onClick={onHideFilters}>Appliquer</Button>
      </div>
    </div>;
};
export default ConciergerieFilters;

