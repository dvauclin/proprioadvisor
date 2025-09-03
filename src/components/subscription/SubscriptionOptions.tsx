import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui-kit/form';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { SubscriptionFormValues } from '@/types/subscription';

interface SubscriptionOptionsProps {
  form: UseFormReturn<SubscriptionFormValues>;
}

export const SubscriptionOptions: React.FC<SubscriptionOptionsProps> = ({
  form
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 md:p-6 p-3 bg-white px-[12px] py-[12px]">
      <h3 className="text-lg font-semibold mb-4">Options de visibilité</h3>
      
      <div className="space-y-4 md:space-y-4 space-y-2">
        <FormField control={form.control} name="options.websiteLink" render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={checked => {
              field.onChange(checked);
            }} />
          </FormControl>
          <div className="space-y-1 leading-none flex-1">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">
                J'accepte d'ajouter le lien vers mon site web
                <span className="ml-2 text-red-600 font-medium">(+10/mois)</span>
              </FormLabel>
            </div>
            <p className="text-sm text-gray-500">
              Votre site web sera visible dans les résultats de recherche
            </p>
          </div>
        </FormItem>} />

        <FormField control={form.control} name="options.phoneNumber" render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={checked => {
              field.onChange(checked);
            }} />
          </FormControl>
          <div className="space-y-1 leading-none flex-1">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">
                J'accepte d'ajouter mon numéro de téléphone
                <span className="ml-2 text-red-600 font-medium">(+5/mois)</span>
              </FormLabel>
            </div>
            <p className="text-sm text-gray-500">
              Votre numéro de téléphone sera visible pour les clients
            </p>
          </div>
        </FormItem>} />

        <FormField control={form.control} name="options.backlink" render={({
          field
        }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={checked => {
              field.onChange(checked);
            }} />
          </FormControl>
          <div className="space-y-1 leading-none flex-1">
            <div className="flex items-center gap-2">
              <FormLabel className="text-base">
                J'accepte d'ajouter un lien vers Proprioadvisor sur la page d'accueil de mon site
                <span className="ml-2 text-green-600 font-medium">(-5/mois)</span>
              </FormLabel>
            </div>
            <p className="text-sm text-gray-500">
              Une vérification sera effectuée dans 48h puis une vérification automatique interviendra tous les mois
            </p>
          </div>
        </FormItem>} />
      </div>
    </div>
  );
};
