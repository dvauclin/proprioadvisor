
import React from 'react';
import { 
  Camera, 
  DoorClosed, 
  ShoppingBag, 
  Headphones, 
  Undo, 
  Shirt, 
  Wrench 
} from 'lucide-react';

// Maps service IDs to their display labels
const serviceLabels: Record<string, string> = {
  'menage': 'Ménage / blanchisserie',
  'checkInOut': 'Check-in / Check-out',
  'remiseDesClefs': 'Remise des clés en personne',
  'gestionAnnonce': 'Gestion de l\'annonce',
  'assistance247': 'Assistance voyageurs 24/7',
  'photosProfessionnelles': 'Photos professionnelles',
  'reapprovisionnement': 'Réapprovisionnement',
  'fournitureLinge': 'Fourniture de linge',
  'maintenanceReparations': 'Maintenance et réparations',
};

// Map service IDs to their icons
const serviceIcons: Record<string, React.ReactNode> = {
  'menage': <Shirt className="h-4 w-4 mr-1" />,
  'checkInOut': <DoorClosed className="h-4 w-4 mr-1" />,
  'remiseDesClefs': <DoorClosed className="h-4 w-4 mr-1" />,
  'gestionAnnonce': <ShoppingBag className="h-4 w-4 mr-1" />,
  'assistance247': <Headphones className="h-4 w-4 mr-1" />,
  'photosProfessionnelles': <Camera className="h-4 w-4 mr-1" />,
  'reapprovisionnement': <Undo className="h-4 w-4 mr-1" />,
  'fournitureLinge': <Shirt className="h-4 w-4 mr-1" />,
  'maintenanceReparations': <Wrench className="h-4 w-4 mr-1" />,
};

// Function to get a service label from its ID
export const getServiceLabel = (serviceId: string): string => {
  return serviceLabels[serviceId] || serviceId;
};

// Function to render service with icon
export const renderServiceWithIcon = (serviceId: string) => {
  return (
    <div className="flex items-center">
      {serviceIcons[serviceId] || <span className="w-4 h-4 mr-1"></span>}
      <span>{getServiceLabel(serviceId)}</span>
    </div>
  );
};

// List of available services
export const availableServices = Object.entries(serviceLabels).map(([id, label]) => ({
  id,
  label
}));

// Validation function for frais_reapprovisionnement
export const validateFraisReapprovisionnement = (value: string | undefined | null): 'reel' | 'forfait' | 'inclus' => {
  if (value === 'reel' || value === 'forfait' || value === 'inclus') {
    return value;
  }
  return 'inclus';
};

// Validation function for location_linge
export const validateLocationLinge = (value: string | undefined | null): 'optionnel' | 'obligatoire' | 'inclus' => {
  if (value === 'optionnel' || value === 'obligatoire' || value === 'inclus') {
    return value;
  }
  return 'inclus';
};

