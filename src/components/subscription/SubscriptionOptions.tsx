import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui-kit/form';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Input } from '@/components/ui-kit/input';
import { BacklinkInfoDialog } from './BacklinkInfoDialog';
import { GMBInfoDialog } from './GMBInfoDialog';
import { SubscriptionFormValues } from '@/types/subscription';
interface SubscriptionOptionsProps {
  form: UseFormReturn<SubscriptionFormValues>;
  conciergerieId: string | null;
}
export const SubscriptionOptions: React.FC<SubscriptionOptionsProps> = ({
  form,
  conciergerieId
}) => {
  return <div className="space-y-4">
      <FormField control={form.control} name="options.basicListing" render={({
      field
    }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={true} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">
                Je souhaite apparaître sur les listings
                <span className="ml-2 text-green-600 font-medium">(Gratuit)</span>
              </FormLabel>
              <p className="text-sm text-gray-500">
                Votre conciergerie est référencée dans les listings des villes sélectionnées sous 24 à 48h
              </p>
            </div>
          </FormItem>} />

      <FormField control={form.control} name="options.partnerListing" render={({
      field
    }) => <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={checked => {
          field.onChange(checked);
        }} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-base">
                Je souhaite pouvoir être contacté
                <span className="ml-2 text-amber-600 font-medium">(5€/mois)</span>
              </FormLabel>
                <p className="text-sm text-gray-500">
                  <span className="text-blue-600 font-medium">Recommandé</span> - Attirer de nouveaux clients en étant plus visible et en donnant aux visiteurs la possibilité de vous contacter
                </p>
            </div>
          </FormItem>} />

      <FormField control={form.control} name="options.websiteLink" render={({
      field
    }) => <FormItem className="space-y-3">
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={checked => {
            field.onChange(checked);
          }} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  Je souhaite ajouter un lien vers le site web de la conciergerie
                  <span className="ml-2 text-amber-600 font-medium">(10€/mois)</span>
                </FormLabel>
                <p className="text-sm text-gray-500">
                  Les visiteurs pourront se rendre sur le site web de la conciergerie
                </p>
              </div>
            </div>
            {form.watch("options.websiteLink") && <FormField control={form.control} name="websiteUrl" render={({
        field: urlField
      }) => <FormItem className="ml-8">
                    <FormLabel>URL de votre site web</FormLabel>
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
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={checked => {
            field.onChange(checked);
          }} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-base">
                  Je souhaite ajouter un numéro de téléphone de contact
                  <span className="ml-2 text-amber-600 font-medium">(5€/mois)</span>
                </FormLabel>
                <p className="text-sm text-gray-500">
                  Les visiteurs pourront vous appeler directement
                </p>
              </div>
            </div>
            {form.watch("options.phoneNumber") && <FormField control={form.control} name="phoneNumberValue" render={({
        field: phoneField
      }) => <FormItem className="ml-8">
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input {...phoneField} placeholder="01 23 45 67 89" type="tel" />
                    </FormControl>
                  </FormItem>} />}
          </FormItem>} />

      <FormField control={form.control} name="options.backlink" render={({
      field
    }) => <FormItem className="space-y-3">
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={checked => {
            field.onChange(checked);
          }} />
              </FormControl>
              <div className="space-y-1 leading-none flex-1">
                <div className="flex items-center gap-2">
                  <FormLabel className="text-base">
                    J'accepte d'ajouter un lien vers Proprioadvisor sur la page d'accueil du site de la conciergerie
                    <span className="ml-2 text-green-600 font-medium">(-5€/mois)</span>
                  </FormLabel>
                  <BacklinkInfoDialog conciergerieId={conciergerieId} />
                </div>
                <p className="text-sm text-gray-500">
                  <span className="text-blue-600 font-medium">Recommandé</span> - Une vérification sera effectuée dans 48h puis une vérification automatique interviendra tous les mois
                </p>
              </div>
            </div>
            {form.watch("options.backlink") && <FormField control={form.control} name="websiteUrl" render={({
        field: urlField
      }) => <FormItem className="ml-8">
                    <FormLabel>URL de votre site web</FormLabel>
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

      <FormField control={form.control} name="options.conciergeriePageLink" render={({
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
                  J'accepte d'ajouter la page conciergerie comme Site Web sur Google My Business
                  <span className="ml-2 text-green-600 font-medium">(-5€/mois)</span>
                </FormLabel>
                <GMBInfoDialog conciergerieId={conciergerieId} />
              </div>
                <p className="text-sm text-gray-500">
                  Une vérification sera effectuée dans 48h puis une vérification automatique interviendra tous les mois
                </p>
            </div>
          </FormItem>} />
    </div>;
};
