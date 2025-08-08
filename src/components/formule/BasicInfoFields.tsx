
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { UseFormReturn } from "react-hook-form";
import { FormuleFormData } from "./FormuleFormSchema";

interface BasicInfoFieldsProps {
  form: UseFormReturn<FormuleFormData>;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="nom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de la formule</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Essentiel, Premium, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission (%)</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          
        <FormField
          control={form.control}
          name="dureeGestionMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DurÃ©e de gestion minimale (mois)</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BasicInfoFields;

