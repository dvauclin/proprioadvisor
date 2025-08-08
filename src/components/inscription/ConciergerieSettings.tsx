
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-chartreuse focus:border-brand-chartreuse"
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

        <FormField
          control={form.control}
          name="deductionFrais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Déduction des frais</FormLabel>
              <FormControl>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-chartreuse focus:border-brand-chartreuse"
                  {...field}
                >
                  <option value="deductTous">Déduction de tous les frais</option>
                  <option value="deductMenage">Déduction du ménage seulement</option>
                  <option value="inclus">Frais inclus</option>
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

      <FormField
        control={form.control}
        name="tva"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TVA</FormLabel>
            <FormControl>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-chartreuse focus:border-brand-chartreuse"
                {...field}
              >
                <option value="TTC">TTC</option>
                <option value="HT">HT</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ConciergerieSettings;

