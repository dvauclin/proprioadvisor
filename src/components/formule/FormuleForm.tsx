"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui-kit/form";
import { Button } from "@/components/ui-kit/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-kit/dialog";
import { formuleSchema, FormuleFormData } from "./FormuleFormSchema";
import ServicesSection from "./ServicesSection";
import BasicInfoFields from "./BasicInfoFields";
import FeesFields from "./FeesFields";
import ReapproOptions from "./ReapproOptions";
import LingeOptions from "./LingeOptions";
import { availableServices } from "@/utils/serviceMapping";

interface FormuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormuleFormData) => void;
  formuleData?: FormuleFormData & Record<string, any>;
}

export function FormuleForm({
  open,
  onOpenChange,
  onSubmit,
  formuleData
}: FormuleFormProps) {
  const form = useForm<FormuleFormData>({
    resolver: zodResolver(formuleSchema),
    defaultValues: {
      nom: "",
      commission: 0,
      dureeGestionMin: 0,
      servicesInclus: [],
      fraisMenageHeure: 0,
      fraisDemarrage: 0,
      abonnementMensuel: 0,
      fraisSupplementaireLocation: 0,
      fraisReapprovisionnement: "inclus",
      forfaitReapprovisionnement: 0,
      locationLinge: "inclus",
      prixLocationLinge: 0
    }
  });

  // Ã‰tats pour les options conditionnelles
  const [showReapproOptions, setShowReapproOptions] = useState(false);
  const [showForfaitReappro, setShowForfaitReappro] = useState(false);
  const [showLingeOptions, setShowLingeOptions] = useState(false);
  const [showPrixLinge, setShowPrixLinge] = useState(false);
  
  // Ã‰tat pour suivre les services sÃ©lectionnÃ©s
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // Ã‰tat pour les services personnalisÃ©s
  const [customServices, setCustomServices] = useState<string[]>([]);

  useEffect(() => {
    if (formuleData) {
      console.log("FormuleData chargÃ©:", formuleData);
      
      // Conversion explicite des valeurs avec vÃ©rification dÃ©taillÃ©e des valeurs numÃ©riques
      const processedData: FormuleFormData = {
        nom: formuleData.nom || "",
        commission: ensureNumeric(formuleData.commission),
        dureeGestionMin: ensureNumeric(formuleData.dureeGestionMin || formuleData.duree_gestion_min),
        servicesInclus: formuleData.servicesInclus || formuleData.services_inclus || [],
        fraisMenageHeure: ensureNumeric(formuleData.fraisMenageHeure || formuleData.frais_menage_heure),
        fraisDemarrage: ensureNumeric(formuleData.fraisDemarrage || formuleData.frais_demarrage),
        abonnementMensuel: ensureNumeric(formuleData.abonnementMensuel || formuleData.abonnement_mensuel),
        fraisSupplementaireLocation: ensureNumeric(formuleData.fraisSupplementaireLocation || formuleData.frais_supplementaire_location),
        fraisReapprovisionnement: formuleData.fraisReapprovisionnement || formuleData.frais_reapprovisionnement || "inclus",
        forfaitReapprovisionnement: ensureNumeric(formuleData.forfaitReapprovisionnement || formuleData.forfait_reapprovisionnement),
        locationLinge: formuleData.locationLinge || formuleData.location_linge || "inclus",
        prixLocationLinge: ensureNumeric(formuleData.prixLocationLinge || formuleData.prix_location_linge),
      };
      
      console.log("DonnÃ©es traitÃ©es pour le formulaire:", processedData);
      
      // Initialiser les services standard et personnalisÃ©s
      const standards = processedData.servicesInclus.filter(service => 
        availableServices.some(s => s.id === service)
      );
      const customs = processedData.servicesInclus.filter(service => 
        !availableServices.some(s => s.id === service)
      );
      
      setSelectedServices(standards);
      setCustomServices(customs);
      
      // Mettre Ã  jour les options conditionnelles
      setShowReapproOptions(standards.includes('reapprovisionnement'));
      setShowLingeOptions(standards.includes('fournitureLinge'));
      setShowForfaitReappro(processedData.fraisReapprovisionnement === 'forfait');
      setShowPrixLinge(processedData.locationLinge === 'optionnel' || processedData.locationLinge === 'obligatoire');
      
      // RÃ©initialiser le formulaire avec les donnÃ©es traitÃ©es
      form.reset(processedData);
    } else {
      // RÃ©initialiser les Ã©tats si pas de formuleData
      setSelectedServices([]);
      setCustomServices([]);
      setShowReapproOptions(false);
      setShowForfaitReappro(false);
      setShowLingeOptions(false);
      setShowPrixLinge(false);
    }
  }, [formuleData, form]);

  // Fonction utilitaire pour s'assurer qu'une valeur est numÃ©rique
  const ensureNumeric = (value: any, isInteger = false): number => {
    console.log(`Converting value to ${isInteger ? 'integer' : 'number'}: `, value, typeof value);
    
    // Handle undefined/null
    if (value === undefined || value === null) {
      return 0;
    }
    
    // Already a number
    if (typeof value === 'number') {
      return isInteger ? Math.floor(value) : value;
    }
    
    // Empty string
    if (value === '') {
      return 0;
    }
    
    // String conversion
    if (typeof value === 'string') {
      const parsed = isInteger ? parseInt(value, 10) : parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    // If we get here, just try to convert or return 0
    const result = isInteger ? Math.floor(Number(value)) : Number(value);
    return isNaN(result) ? 0 : result;
  };

  const handleFormSubmit = (values: FormuleFormData) => {
    // Mise Ã  jour des valeurs en fonction des cases cochÃ©es
    const formValues = {
      ...values,
      servicesInclus: [...selectedServices, ...customServices]
    };
    
    console.log("Envoi du formulaire avec valeurs:", formValues);
    
    onSubmit(formValues);
    onOpenChange(false);
    form.reset();
    setSelectedServices([]);
    setCustomServices([]);
    setShowReapproOptions(false);
    setShowForfaitReappro(false);
    setShowLingeOptions(false);
    setShowPrixLinge(false);
  };
  
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      const newServices = prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId];

      // GÃ©rer les options conditionnelles
      if (serviceId === 'reapprovisionnement') {
        setShowReapproOptions(newServices.includes('reapprovisionnement'));
        if (!newServices.includes('reapprovisionnement')) {
          form.setValue('fraisReapprovisionnement', 'inclus');
          setShowForfaitReappro(false);
        }
      }
      if (serviceId === 'fournitureLinge') {
        setShowLingeOptions(newServices.includes('fournitureLinge'));
        if (!newServices.includes('fournitureLinge')) {
          form.setValue('locationLinge', 'inclus');
          setShowPrixLinge(false);
        }
      }
      return newServices;
    });
  };

  // Gestion des services personnalisÃ©s
  const handleAddCustomService = (service: string) => {
    setCustomServices(prev => [...prev, service]);
  };

  const handleRemoveCustomService = (service: string) => {
    setCustomServices(customServices.filter(s => s !== service));
  };

  // Handle fraisReapprovisionnement changes
  const handleFraisReapproChange = (value: string) => {
    form.setValue('fraisReapprovisionnement', value as "reel" | "forfait" | "inclus");
    setShowForfaitReappro(value === 'forfait');
    
    // If not forfait, ensure the forfait value is set to 0
    if (value !== 'forfait') {
      form.setValue('forfaitReapprovisionnement', 0);
    }
  };

  // Handle locationLinge changes
  const handleLocationLingeChange = (value: string) => {
    form.setValue('locationLinge', value as "optionnel" | "obligatoire" | "inclus");
    setShowPrixLinge(value === 'optionnel' || value === 'obligatoire');
    
    // If not requiring price, ensure the price value is set to 0
    if (value !== 'optionnel' && value !== 'obligatoire') {
      form.setValue('prixLocationLinge', 0);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formuleData ? "Modifier une formule" : "Ajouter une formule"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Basic info fields */}
            <BasicInfoFields form={form} />
            
            {/* Services section */}
            <ServicesSection 
              selectedServices={selectedServices}
              customServices={customServices}
              onServiceToggle={handleServiceToggle}
              onCustomServiceAdd={handleAddCustomService}
              onCustomServiceRemove={handleRemoveCustomService}
            />
            
            {/* Fees fields */}
            <FeesFields form={form} />
            
            {/* Conditional options */}
            {showReapproOptions && (
              <ReapproOptions 
                form={form} 
                showForfaitReappro={showForfaitReappro}
                onFraisReapproChange={handleFraisReapproChange}
              />
            )}

            {showLingeOptions && (
              <LingeOptions 
                form={form} 
                showPrixLinge={showPrixLinge}
                onLocationLingeChange={handleLocationLingeChange}
              />
            )}

            <Button type="submit" className="w-full">
              {formuleData ? "Modifier la formule" : "Ajouter la formule"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default FormuleForm;

