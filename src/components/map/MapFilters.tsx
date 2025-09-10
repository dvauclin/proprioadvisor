
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui-kit/select";

// Define regions in France
const regions = [
  { id: 'all', name: 'Toutes les régions' },
  { id: 'ile-de-france', name: '}le-de-France' },
  { id: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes' },
  { id: 'provence-alpes-cote-azur', name: 'Provence-Alpes-Côte d\'Azur' },
  { id: 'occitanie', name: 'Occitanie' },
  { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine' },
  { id: 'hauts-de-france', name: 'Hauts-de-France' },
  { id: 'grand-est', name: 'Grand Est' },
  { id: 'normandie', name: 'Normandie' },
  { id: 'bretagne', name: 'Bretagne' },
  { id: 'pays-de-la-loire', name: 'Pays de la Loire' },
  { id: 'centre-val-de-loire', name: 'Centre-Val de Loire' },
  { id: 'bourgogne-franche-comte', name: 'Bourgogne-Franche-Comté' },
];

// Define population size ranges
const populationSizes = [
  { id: 'all', name: 'Toutes les tailles' },
  { id: 'small', name: 'Petites villes (<50 000 hab.)' },
  { id: 'medium', name: 'Villes moyennes (50 000 - 200 000 hab.)' },
  { id: 'large', name: 'Grandes villes (>200 000 hab.)' },
];

interface MapFiltersProps {
  selectedRegion: string;
  selectedPopulationSize: string;
  onRegionChange: (region: string) => void;
  onPopulationSizeChange: (size: string) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({
  selectedRegion,
  selectedPopulationSize,
  onRegionChange,
  onPopulationSizeChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-1/2">
        <Select value={selectedRegion} onValueChange={onRegionChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrer par région" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-1/2">
        <Select value={selectedPopulationSize} onValueChange={onPopulationSizeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrer par taille" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {populationSizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MapFilters;

