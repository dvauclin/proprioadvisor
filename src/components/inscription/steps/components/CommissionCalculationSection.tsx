
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Percent } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-kit/select";

interface CommissionCalculationSectionProps {
  form: UseFormReturn<any>;
}

const CommissionCalculationSection: React.FC<CommissionCalculationSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="deductionFrais"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <Percent className="mr-2 h-4 w-4 text-gray-600" />
              <FormLabel>Méthode calcul de la commission</FormLabel>
            </div>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deductTous">Déduction de tous les frais</SelectItem>
                  <SelectItem value="deductMenage">Déduction du ménage seulement</SelectItem>
                  <SelectItem value="inclus">Frais inclus</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tva"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center">
              <Percent className="mr-2 h-4 w-4 text-gray-600" />
              <FormLabel>% de commission en</FormLabel>
            </div>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TTC">TTC</SelectItem>
                  <SelectItem value="HT">HT</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CommissionCalculationSection;
