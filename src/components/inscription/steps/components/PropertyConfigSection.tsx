
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Checkbox } from "@/components/ui-kit/checkbox";
import { Home } from "lucide-react";
import { propertyTypeOptions } from "@/services/supabaseService";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-kit/select";

interface PropertyConfigSectionProps {
  form: UseFormReturn<any>;
}

const PropertyConfigSection: React.FC<PropertyConfigSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Home className="mr-2 h-5 w-5 text-brand-chartreuse" />
        <h3 className="text-lg font-medium">Configuration des logements recherchés</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="typeLogementAccepte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de logement accepté</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypeOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="superficieMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Superficie minimale (m²)</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombreChambresMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de chambres minimum</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Options d'acceptation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <FormField 
          control={form.control} 
          name="accepteGestionPartielle" 
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Accepte la gestion partielle
                </FormLabel>
              </div>
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="accepteResidencePrincipale" 
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Accepte les résidences principales
                </FormLabel>
              </div>
            </FormItem>
          )} 
        />
      </div>
    </div>
  );
};

export default PropertyConfigSection;

