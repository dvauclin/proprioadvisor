
import { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubscriptionFormValues } from '@/types/subscription';

interface UseSubscriptionCalculationsProps {
  form: UseFormReturn<SubscriptionFormValues>;
  setDefaultAmount: (amount: number) => void;
  setBacklinkPoints: (points: number) => void;
  setPaymentPoints: (points: number) => void;
  setTotalPoints: (points: number) => void;
  setTotalMonthlyFee: (fee: number) => void;
  lastValidCustomAmount: React.MutableRefObject<string>;
  backlinkPoints: number;
}

export const useSubscriptionCalculations = ({
  form,
  setDefaultAmount,
  setBacklinkPoints,
  setPaymentPoints,
  setTotalPoints,
  setTotalMonthlyFee,
  lastValidCustomAmount,
  backlinkPoints
}: UseSubscriptionCalculationsProps) => {
  const calculationInProgress = useRef(false);
  const optionsJustChanged = useRef(false);
  const previousOptionsRef = useRef<SubscriptionFormValues["options"]>({
    basicListing: true,
    partnerListing: false,
    websiteLink: false,
    phoneNumber: false,
    backlink: false,
    conciergeriePageLink: false
  });

  // Calculate the default amount based on selected options
  const calculateDefaultAmount = (options: SubscriptionFormValues["options"]): number => {
    let fee = 0;
    
    if (options.partnerListing) fee += 5;
    if (options.websiteLink) fee += 10;
    if (options.phoneNumber) fee += 5;
    if (options.backlink) fee -= 5;
    if (options.conciergeriePageLink) fee -= 5;
    
    return Math.max(0, fee);
  };

  // Calculate points from options (points_options)
  const calculateOptionsPoints = (options: SubscriptionFormValues["options"]): number => {
    return (options.backlink ? 5 : 0) + (options.conciergeriePageLink ? 5 : 0);
  };
  
  // Helper function to check if options have changed
  const haveOptionsChanged = (prevOptions: SubscriptionFormValues["options"], newOptions: SubscriptionFormValues["options"]) => {
    return Object.keys(prevOptions).some(key => {
      const optionKey = key as keyof SubscriptionFormValues["options"];
      return prevOptions[optionKey] !== newOptions[optionKey];
    });
  };

  // Recalculate all values and update state
  const recalculateAll = () => {
    if (calculationInProgress.current) {
      return; // Prevent recursive calls
    }
    
    calculationInProgress.current = true;
    
    try {
      const formValues = form.getValues();
      const options = formValues.options;
      const useCustomAmount = formValues.useCustomAmount;
      
      // Calculate the default amount
      const defaultFee = calculateDefaultAmount(options);
      setDefaultAmount(defaultFee);
      
      // Calculate options points (points_options)
      const optionsPoints = calculateOptionsPoints(options);
      setBacklinkPoints(optionsPoints);
      
      // Check if options have changed since last calculation
      const optionsChanged = haveOptionsChanged(previousOptionsRef.current, options);
      
      // Always update the custom amount when options change, regardless of which
      // option is selected (default or custom)
      if (optionsChanged) {
        const suggestedAmount = Math.max(defaultFee + 5, 5);
        form.setValue("customAmount", String(suggestedAmount), { shouldValidate: true });
        lastValidCustomAmount.current = String(suggestedAmount);
        optionsJustChanged.current = true;
      }
      
      // Calculate final fee based on custom amount or default
      let finalFee = defaultFee;
      if (useCustomAmount) {
        // Always use the current custom amount value for calculations
        const customFeeStr = form.getValues("customAmount");
        const customFee = customFeeStr ? Number(customFeeStr) : defaultFee + 5;
        finalFee = Math.max(customFee, 0); // Ensure custom amount is not negative
      }
      
      setTotalMonthlyFee(finalFee);
      
      // Set payment points (this is just the amount for display, not stored directly)
      setPaymentPoints(finalFee);
      
      // Calculate total points: points_options + monthly_amount
      // Note: In the frontend we show the potential total, but in the database
      // total_points will be calculated as points_options + monthly_amount
      setTotalPoints(optionsPoints + finalFee);
      
      // Update previous options reference
      previousOptionsRef.current = { ...options };
      
      // Reset the flag after calculation is complete
      if (optionsJustChanged.current) {
        optionsJustChanged.current = false;
      }
    } finally {
      calculationInProgress.current = false;
    }
  };

  // Watch for any option changes and recalculate
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      // Only trigger a full recalculation when necessary
      if (!calculationInProgress.current) {
        // Check if the change is in options
        if (name && name.startsWith('options.')) {
          // Flag that options have changed to properly update the custom amount
          optionsJustChanged.current = true;
          
          // Force an immediate recalculation after option change
          setTimeout(() => recalculateAll(), 0);
        }
        
        // If custom amount is changed directly by the user, update points immediately
        if (name === 'customAmount' && type === 'change' && form.getValues('useCustomAmount')) {
          const customAmount = form.getValues('customAmount');
          if (customAmount) {
            const numValue = Number(customAmount);
            if (!isNaN(numValue)) {
              // Recalculate options points to ensure we have the current value
              const currentOptionsPoints = calculateOptionsPoints(form.getValues('options'));
              setPaymentPoints(numValue);
              setTotalPoints(currentOptionsPoints + numValue);
              setTotalMonthlyFee(numValue); // Also update the total monthly fee
            }
          }
        }
        
        // If useCustomAmount is changed, update points based on the selected payment method
        if (name === 'useCustomAmount') {
          recalculateAll();
        }
      }
    });
    
    // Initial calculation
    recalculateAll();
    
    return () => subscription.unsubscribe();
  }, [form, backlinkPoints]);

  return { recalculateAll, calculateDefaultAmount, calculateOptionsPoints };
};
