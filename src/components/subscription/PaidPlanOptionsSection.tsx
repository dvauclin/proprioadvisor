import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui-kit/form';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Input } from '@/components/ui-kit/input';
import { SubscriptionFormValues } from '@/types/subscription';
interface PaidPlanOptionsSectionProps {
  form: UseFormReturn<SubscriptionFormValues>;
  isPaid: boolean;
}
export const PaidPlanOptionsSection: React.FC<PaidPlanOptionsSectionProps> = ({
  form,
  isPaid
}) => {
  if (!isPaid) {
    return null;
  }
  return <div className="border border-gray-200 rounded-lg p-6 md:p-6 p-3 bg-white">
      <h3 className="font-semibold text-lg mb-4 md:mb-4 mb-2">Options pour plan payant</h3>
      
      <p className="text-sm text-gray-600 mb-4 md:mb-4 mb-2">Puisque vous avez opté pour un abonnement payant, vous pouvez ajouter gratuitement un numéro de téléphone ou votre site web à votre fiche ProprioAdvisor.</p>
      

      <div className="space-y-4 md:space-y-4 space-y-2">
        <FormField control={form.control} name="options.websiteLink" render={({
        field
      }) => <FormItem className="space-y-3">
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:p-4 p-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none flex-1">
                  <FormLabel className="text-base">Je souhaite afficher un lien vers le site web de la conciergerie</FormLabel>
                </div>
              </div>
              {form.watch("options.websiteLink") && <FormField control={form.control} name="websiteUrl" render={({
          field: urlField
        }) => <FormItem className="ml-8 md:ml-8 ml-4">
                      <FormLabel>URL à afficher</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                            https://
                          </span>
                          <Input value={urlField.value || ""} onChange={e => {
                let value = e.target.value;
                if (value.startsWith('https://')) {
                  value = value.substring(8);
                } else if (value.startsWith('http://')) {
                  value = value.substring(7);
                }
                urlField.onChange(value);
              }} placeholder="votre-site.com" className="rounded-l-none" />
                        </div>
                      </FormControl>
                    </FormItem>} />}
            </FormItem>} />

        <FormField control={form.control} name="options.phoneNumber" render={({
        field
      }) => <FormItem className="space-y-3">
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:p-4 p-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none flex-1">
                  <FormLabel className="text-base">Je souhaite afficher un numéro de téléphone de contact</FormLabel>
                </div>
              </div>
              {form.watch("options.phoneNumber") && <FormField control={form.control} name="phoneNumberValue" render={({
          field: phoneField
        }) => <FormItem className="ml-8 md:ml-8 ml-4">
                      <FormLabel>Numéro de téléphone à afficher</FormLabel>
                      <FormControl>
                        <Input {...phoneField} placeholder="01 23 45 67 89" type="tel" />
                      </FormControl>
                    </FormItem>} />}
            </FormItem>} />
      </div>
    </div>;
};

