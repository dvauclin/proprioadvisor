
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { UseFormReturn } from "react-hook-form";
import { FormuleFormData } from "./FormuleFormSchema";

interface FeesFieldsProps {
  form: UseFormReturn<FormuleFormData>;
}

export const FeesFields: React.FC<FeesFieldsProps> = ({ form }) => {
  console.log("FeesFields rendering with values:", {
    fraisMenageHeure: form.getValues("fraisMenageHeure"),
    fraisDemarrage: form.getValues("fraisDemarrage"),
    abonnementMensuel: form.getValues("abonnementMensuel"),
    fraisSupplementaireLocation: form.getValues("fraisSupplementaireLocation")
  });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fraisMenageHeure"
          render={({ field }) => {
            const numericValue = typeof field.value === 'number' ? field.value : 0;
            
            return (
              <FormItem>
                <FormLabel>Frais de mÃ©nage (â‚¬/heure)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    value={numericValue}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
          
        <FormField
          control={form.control}
          name="fraisDemarrage"
          render={({ field }) => {
            const numericValue = typeof field.value === 'number' ? field.value : 0;
            
            return (
              <FormItem>
                <FormLabel>Frais de dÃ©marrage (â‚¬)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    value={numericValue}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="abonnementMensuel"
          render={({ field }) => {
            const numericValue = typeof field.value === 'number' ? field.value : 0;
            
            return (
              <FormItem>
                <FormLabel>Abonnement mensuel (â‚¬)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    value={numericValue}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
          
        <FormField
          control={form.control}
          name="fraisSupplementaireLocation"
          render={({ field }) => {
            const numericValue = typeof field.value === 'number' ? field.value : 0;
            console.log("Rendering fraisSupplementaireLocation with value:", field.value, "numeric value:", numericValue);
            
            return (
              <FormItem>
                <FormLabel>Frais supplÃ©mentaire par location (â‚¬)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    value={numericValue}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      console.log("Changing fraisSupplementaireLocation to:", value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </>
  );
};

export default FeesFields;

