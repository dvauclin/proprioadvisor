import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui-kit/input';
import { SubscriptionFormValues } from '@/types/subscription';
import { PricingExplanation } from './PricingExplanation';
import { RenewalDayDisplay } from './RenewalDayDisplay';
interface PricingSectionProps {
  form: UseFormReturn<SubscriptionFormValues>;
  defaultAmount: number;
  handleToggleCustomAmount: (useCustom: boolean) => void;
  handleCustomAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentMonthlyPayment?: number;
  renewalDay?: number | null;
  showCurrentPaymentInfo?: boolean;
}
export const PricingSection: React.FC<PricingSectionProps> = ({
  form,
  defaultAmount,
  handleToggleCustomAmount,
  handleCustomAmountChange,
  currentMonthlyPayment = 0,
  renewalDay = null,
  showCurrentPaymentInfo = false
}) => {
  const useCustomAmount = form.getValues("useCustomAmount");
  const customAmount = form.getValues("customAmount");
  const selectedAmount = useCustomAmount ? Number(customAmount) || 0 : defaultAmount;
  return <div className="border border-gray-200 rounded-lg p-4 mt-6 bg-white">
      <h3 className="font-semibold text-lg mb-3">Montant à payer</h3>
      
      {showCurrentPaymentInfo && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Montant actuellement payé :</span> {currentMonthlyPayment}/mois
          </p>
          {renewalDay && <div className="mt-2">
              <RenewalDayDisplay renewalDay={renewalDay} isCurrentPaymentInfo={true} />
            </div>}
        </div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${!useCustomAmount ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`} onClick={() => handleToggleCustomAmount(false)}>
          <div className="flex items-center mb-2">
            <div className={`w-5 h-5 rounded-full border ${!useCustomAmount ? 'bg-green-500 border-green-500' : 'border-gray-300'} mr-2`}>
              {!useCustomAmount && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5"></div>}
            </div>
            <span className="font-medium">Montant calculé par défaut</span>
          </div>
          <p className="text-2xl font-bold ml-7">
            {defaultAmount}<span className="text-sm font-normal text-gray-500">/mois</span>
          </p>
        </div>

        <div className={`border rounded-lg p-4 cursor-pointer transition-all ${useCustomAmount ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`} onClick={() => handleToggleCustomAmount(true)}>
          <div className="flex items-center mb-2">
            <div className={`w-5 h-5 rounded-full border ${useCustomAmount ? 'bg-green-500 border-green-500' : 'border-gray-300'} mr-2`}>
              {useCustomAmount && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5"></div>}
            </div>
            <span className="font-medium">Montant personnalisé</span>
          </div>
          
          <div className="ml-7">
            <div className="flex items-center">
              <Input type="number" min={0} max="1000" step="1" className="w-24 text-lg font-medium text-center" value={customAmount} onClick={e => {
              e.stopPropagation();
              handleToggleCustomAmount(true);
            }} onChange={handleCustomAmountChange} />
              <span className="text-lg font-medium ml-2"><span className="text-sm font-normal text-gray-500">/mois</span></span>
            </div>
            
          </div>
        </div>
      </div>
      
      {showCurrentPaymentInfo && <PricingExplanation currentAmount={currentMonthlyPayment} selectedAmount={selectedAmount} />}
      
      <p className="text-sm text-gray-600 italic mt-3">C'est un système d'enchères au plus offrant pour apparaître en haut des listings et obtenir plus de visibilité sur Proprioadvisor, Google et ChatGPT.</p>
    </div>;
};

