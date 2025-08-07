
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Home } from "lucide-react";
import { propertyTypeOptions } from "@/services/supabaseService";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyConfigSectionProps {
  form: UseFormReturn<any>;
}

const PropertyConfigSection: React.FC<PropertyConfigSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <Home className="mr-2 h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium">Configuration du logement</h3>
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
    </div>
  );
};

export default PropertyConfigSection;
