import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui-kit/form";
import { Checkbox } from "@/components/ui-kit/checkbox";

interface AcceptanceOptionsSectionProps {
  form: UseFormReturn<any>;
}
const AcceptanceOptionsSection: React.FC<AcceptanceOptionsSectionProps> = ({
  form
}) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField control={form.control} name="accepteGestionPartielle" render={({
      field
    }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <div className="flex items-center">
                
                <FormLabel>
                  Accepte la gestion partielle
                </FormLabel>
              </div>
            </div>
          </FormItem>} />

      <FormField control={form.control} name="accepteResidencePrincipale" render={({
      field
    }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <div className="flex items-center">
                
                <FormLabel>
                  Accepte les rÃ©sidences principales
                </FormLabel>
              </div>
            </div>
          </FormItem>} />
    </div>;
};
export default AcceptanceOptionsSection;

