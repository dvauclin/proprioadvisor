
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-kit/select";
import { UseFormReturn } from "react-hook-form";
import { FormuleFormData } from "./FormuleFormSchema";

interface LingeOptionsProps {
  form: UseFormReturn<FormuleFormData>;
  showPrixLinge: boolean;
  onLocationLingeChange: (value: string) => void;
}

export const LingeOptions: React.FC<LingeOptionsProps> = ({
  form,
  showPrixLinge,
  onLocationLingeChange
}) => {
  console.log("LingeOptions rendering with prixLocationLinge:", form.getValues("prixLocationLinge"));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="locationLinge"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location de linge</FormLabel>
            <Select 
              value={field.value} 
              onValueChange={(value: "inclus" | "optionnel" | "obligatoire") => {
                field.onChange(value);
                onLocationLingeChange(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inclus">Inclus</SelectItem>
                <SelectItem value="optionnel">Optionnel</SelectItem>
                <SelectItem value="obligatoire">Obligatoire</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {showPrixLinge && (
        <FormField
          control={form.control}
          name="prixLocationLinge"
          render={({ field }) => {
            const numericValue = typeof field.value === 'number' ? field.value : 0;
            
            return (
              <FormItem>
                <FormLabel>Prix location mensuel du linge (€)</FormLabel>
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
      )}
    </div>
  );
};

export default LingeOptions;

