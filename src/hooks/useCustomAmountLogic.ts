
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubscriptionFormValues } from '@/types/subscription';

interface UseCustomAmountLogicProps {
  form: UseFormReturn<SubscriptionFormValues>;
  setPaymentPoints: (points: number) => void;
  setTotalPoints: (points: number) => void;
  setTotalMonthlyFee: (fee: number) => void;
  backlinkPoints: number;
  lastValidCustomAmountRef: React.MutableRefObject<string>;
  calculateDefaultAmount: (options: SubscriptionFormValues["options"]) => number;
  defaultAmount: number;
}

export const useCustomAmountLogic = ({
  form,
  setPaymentPoints,
  setTotalPoints,
  setTotalMonthlyFee,
  backlinkPoints,
  lastValidCustomAmountRef,
  calculateDefaultAmount,
  defaultAmount,
}: UseCustomAmountLogicProps) => {
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      form.setValue("customAmount", "", { shouldValidate: true });
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        let clampedValue = Math.min(Math.max(0, Math.floor(numValue)), 1000);
        
        // Si le montant est inférieur au montant par défaut, le corriger automatiquement
        if (clampedValue < defaultAmount) {
          clampedValue = defaultAmount;
        }
        
        form.setValue("customAmount", String(clampedValue), { shouldValidate: true });
        lastValidCustomAmountRef.current = String(clampedValue);

        if (form.getValues('useCustomAmount')) {
          setPaymentPoints(clampedValue);
          setTotalPoints(backlinkPoints + clampedValue);
          setTotalMonthlyFee(clampedValue);
        }
      }
    }
  };

  const handleToggleCustomAmount = (useCustom: boolean) => {
    form.setValue("useCustomAmount", useCustom, { shouldValidate: true });
    if (useCustom) {
      const storedCustomAmount = lastValidCustomAmountRef.current;
      let customValue = Number(storedCustomAmount);
      
      // S'assurer que le montant personnalisé est au moins égal au montant par défaut
      if (customValue < defaultAmount) {
        customValue = defaultAmount;
        form.setValue("customAmount", String(customValue), { shouldValidate: true });
        lastValidCustomAmountRef.current = String(customValue);
      }
      
      setPaymentPoints(customValue);
      setTotalPoints(backlinkPoints + customValue);
      setTotalMonthlyFee(customValue);
    } else {
      const defaultFee = calculateDefaultAmount(form.getValues("options"));
      setPaymentPoints(defaultFee);
      setTotalPoints(backlinkPoints + defaultFee);
      setTotalMonthlyFee(defaultFee);
    }
  };

  return { handleCustomAmountChange, handleToggleCustomAmount };
};

