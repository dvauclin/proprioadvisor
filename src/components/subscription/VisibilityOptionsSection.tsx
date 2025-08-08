import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui-kit/form';
import { Checkbox } from '@/components/ui-kit/checkbox';
import { Input } from '@/components/ui-kit/input';
import { SubscriptionFormValues } from '@/types/subscription';
interface VisibilityOptionsSectionProps {
  form: UseFormReturn<SubscriptionFormValues>;
  currentPoints: number;
  currentMonthlyPayment?: number;
  renewalDay?: number | null;
}
export const VisibilityOptionsSection: React.FC<VisibilityOptionsSectionProps> = ({
  form,
  currentPoints,
  currentMonthlyPayment,
  renewalDay
}) => {
  return <div className="border border-gray-200 rounded-lg p-6 md:p-6 p-3 bg-white px-[12px] py-[12px]">
      
      
      <div className="space-y-4 md:space-y-4 space-y-2">
        <FormField control={form.control} name="useCustomAmount" render={({
        field
      }) => <FormItem className="space-y-3">
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:p-4 p-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none flex-1">
                  <FormLabel className="text-base">
                    J'accepte de passer Ã  un abonnement payant
                    <div className="text-gray-600 text-xs mt-1">Si vous souhaitez Ãªtre considÃ©rÃ© comme une conciergerie partenaire et recevoir des prospects.</div>
                    <div className="text-blue-600 font-medium text-sm mt-1 md:mt-1 mt-0.5">1â‚¬ = 1 point supplÃ©mentaire</div>
                  </FormLabel>
                </div>
              </div>
              {form.watch("useCustomAmount") && <FormField control={form.control} name="customAmount" render={({
          field: amountField
        }) => <FormItem className="ml-8 md:ml-8 ml-4">
                      <FormLabel>Montant mensuel (en â‚¬)</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Input type="number" min={1} value={amountField.value} onChange={amountField.onChange} placeholder="5" className="w-24" />
                          <span className="ml-2 text-sm text-gray-500">â‚¬/mois</span>
                        </div>
                      </FormControl>
                    </FormItem>} />}
            </FormItem>} />
      </div>

      <div className={`mt-6 md:mt-6 mt-3 p-4 md:p-4 p-2 rounded-lg ${currentPoints === 0 ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-sm font-medium ${currentPoints === 0 ? 'text-red-800' : 'text-blue-800'}`}>
          Total de points : {currentPoints} points
        </p>
        <p className={`text-xs mt-2 ${currentPoints === 0 ? 'text-red-600' : 'text-blue-600'}`}>
          {currentPoints === 0 ? "Avec 0 point vous ne serez pas considÃ©rÃ© comme une conciergerie partenaire. Les clients ne pourront pas vous contacter et vous serez placÃ© tout en bas des listings. Votre visibilitÃ© est quasi nulle. Il faut au moins 1 point pour Ãªtre considÃ©rÃ© comme une conciergerie partenaire." : "Si une autre conciergerie de votre ville a moins de points elle sera positionnÃ©e derriÃ¨re, si elle en a plus elle sera positionnÃ©e devant. Plus vous avez de points, plus vous maximisez votre visibilitÃ©."}
        </p>
        {currentMonthlyPayment && currentMonthlyPayment > 0 && form.watch("useCustomAmount") && Number(form.watch("customAmount")) !== currentMonthlyPayment && <div className="mt-3">
            <p className="text-sm font-medium text-green-700">
              Nouvel abonnement : {form.watch("customAmount")}â‚¬/mois (abonnement actuel : {currentMonthlyPayment}â‚¬/mois)
            </p>
            {renewalDay && <p className="text-xs text-green-600">
                Renouvellement le {renewalDay} de chaque mois
              </p>}
          </div>}
        {currentMonthlyPayment && currentMonthlyPayment > 0 && !form.watch("useCustomAmount") && <div className="mt-3">
            <p className="text-sm font-medium text-red-700">
              Annulation de l'abonnement : {currentMonthlyPayment}â‚¬/mois
            </p>
          </div>}
        {currentMonthlyPayment && currentMonthlyPayment > 0 && form.watch("useCustomAmount") && Number(form.watch("customAmount")) === currentMonthlyPayment && <div className="mt-3">
            <p className="text-sm font-medium text-green-700">
              Montant de l'abonnement : {currentMonthlyPayment}â‚¬/mois
            </p>
            {renewalDay && <p className="text-xs text-green-600">
                Renouvellement le {renewalDay} de chaque mois
              </p>}
          </div>}
      </div>
    </div>;
};

