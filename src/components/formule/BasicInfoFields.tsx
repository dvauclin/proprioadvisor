
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { UseFormReturn } from "react-hook-form";
import { FormuleFormData } from "./FormuleFormSchema";
// removed radio group; using simple neutral buttons for TTC/HT selection

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
              <div className="flex items-center gap-3 w-full">
                <FormControl className="flex-1">
                  <Input type="number" min="0" step="1" {...field} className="w-full" />
                </FormControl>
                <FormField
                  control={form.control}
                  name="tva"
                  render={({ field: tvaField }) => (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => tvaField.onChange("TTC")}
                        className={`px-3 py-1 rounded border text-sm ${ (tvaField.value || "TTC") === "TTC" ? 'bg-gray-200 text-gray-900 border-gray-300' : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                        aria-pressed={(tvaField.value || 'TTC') === 'TTC'}
                      >
                        TTC
                      </button>
                      <button
                        type="button"
                        onClick={() => tvaField.onChange("HT")}
                        className={`px-3 py-1 rounded border text-sm ${ tvaField.value === "HT" ? 'bg-gray-200 text-gray-900 border-gray-300' : 'bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                        aria-pressed={tvaField.value === 'HT'}
                      >
                        HT
                      </button>
                    </div>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dureeGestionMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée de gestion minimale (mois)</FormLabel>
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

