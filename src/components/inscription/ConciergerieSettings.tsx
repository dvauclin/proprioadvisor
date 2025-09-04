
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui-kit/form";
import { Input } from "@/components/ui-kit/input";
import { propertyTypeOptions } from "@/services/supabaseService";

const ConciergerieSettings = () => {
  const form = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="typeLogementAccepte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de logement accepté</FormLabel>
              <FormControl>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  {...field}
                >
                  {propertyTypeOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Le choix TTC/HT est désormais géré par formule à l'étape 2 */}
    </>
  );
};

export default ConciergerieSettings;

