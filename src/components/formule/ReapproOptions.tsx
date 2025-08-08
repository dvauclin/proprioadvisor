
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-kit/select";
import { UseFormReturn } from "react-hook-form";
import { FormuleFormData } from "./FormuleFormSchema";

interface ReapproOptionsProps {
  form: UseFormReturn<FormuleFormData>;
  showForfaitReappro: boolean;
  onFraisReapproChange: (value: string) => void;
}

export const ReapproOptions: React.FC<ReapproOptionsProps> = ({
  form,
  showForfaitReappro,
  onFraisReapproChange
}) => {
  console.log("ReapproOptions rendering with forfaitReapprovisionnement:", form.getValues("forfaitReapprovisionnement"));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="fraisReapprovisionnement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frais de réapprovisionnement</FormLabel>
            <Select 
              value={field.value}
              onValueChange={(value: "inclus" | "reel" | "forfait") => {
                field.onChange(value);
                onFraisReapproChange(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inclus">Inclus</SelectItem>
                <SelectItem value="reel">Coût réel refacturé</SelectItem>
                <SelectItem value="forfait">Forfait mensuel</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {showForfaitReappro && (
        <FormField
          control={form.control}
          name="forfaitReapprovisionnement"
          render={({ field }) => {
            const numericValue = typeof field.value === 'number' ? field.value : 0;
            console.log("Rendering forfait field with value:", field.value, "numeric value:", numericValue);
            
            return (
              <FormItem>
                <FormLabel>Forfait mensuel réappro. ()</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    value={numericValue}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      console.log("Changing forfaitReapprovisionnement to:", value);
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

export default ReapproOptions;

