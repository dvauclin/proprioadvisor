
import React, { useMemo } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { UseFormReturn } from "react-hook-form";
import { FormuleFormData } from "./FormuleFormSchema";

interface FeesFieldsProps {
  form: UseFormReturn<FormuleFormData>;
}

export const FeesFields: React.FC<FeesFieldsProps> = ({ form }) => {
  // Utiliser useMemo pour éviter les re-rendus inutiles
  const formValues = useMemo(() => ({
    fraisMenageHeure: form.getValues("fraisMenageHeure"),
    fraisDemarrage: form.getValues("fraisDemarrage"),
    abonnementMensuel: form.getValues("abonnementMensuel"),
    fraisSupplementaireLocation: form.getValues("fraisSupplementaireLocation")
  }), [form]);

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
                <FormLabel>Frais de ménage (€/heure)</FormLabel>
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
                <FormLabel>Frais de démarrage (€)</FormLabel>
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
                <FormLabel>Abonnement mensuel (€)</FormLabel>
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
            
            return (
              <FormItem>
                <FormLabel>Frais supplémentaires par location (€)</FormLabel>
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
    </>
  );
};

export default FeesFields;

