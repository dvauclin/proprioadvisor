
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { Star } from "lucide-react";

interface ScoreFieldSectionProps {
  form: UseFormReturn<any>;
}

const ScoreFieldSection: React.FC<ScoreFieldSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-2">
                    <Star className="mr-2 h-5 w-5 text-brand-chartreuse" />
        <h3 className="text-lg font-medium">Score (Admin uniquement)</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Score de classement</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    // Si le parsage résulte en NaN (ex: pour un champ vide ou invalide),
                    // on met la valeur du champ à null. Sinon, on utilise le nombre parsé.
                    field.onChange(isNaN(value) ? null : value);
                  }}
                  placeholder="Laisser vide pour un calcul automatique"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ScoreFieldSection;

