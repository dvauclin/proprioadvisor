
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubscriptionFormValues } from '@/types/subscription';

interface UseFormPreFillProps {
  form: UseFormReturn<SubscriptionFormValues>;
  existingSubscription: any;
}

export const useFormPreFill = ({ form, existingSubscription }: UseFormPreFillProps) => {
  useEffect(() => {
    if (existingSubscription) {
      // Pre-fill form with existing subscription data
      form.setValue('options.basicListing', existingSubscription.basic_listing);
      form.setValue('options.partnerListing', existingSubscription.partner_listing);
      form.setValue('options.websiteLink', existingSubscription.website_link);
      form.setValue('options.phoneNumber', existingSubscription.phone_number);
      form.setValue('options.backlink', existingSubscription.backlink);
      form.setValue('options.conciergeriePageLink', existingSubscription.conciergerie_page_link);
      
      // If there's a paid subscription (monthly_amount > 0), set useCustomAmount to true
      const hasPaidSubscription = existingSubscription.monthly_amount > 0;
      form.setValue('useCustomAmount', hasPaidSubscription || existingSubscription.use_custom_amount);
      form.setValue('customAmount', String(existingSubscription.monthly_amount || 5));

      let websiteUrlForInput = existingSubscription.website_url || "";
      if (websiteUrlForInput.startsWith('https://')) {
        websiteUrlForInput = websiteUrlForInput.substring(8);
      } else if (websiteUrlForInput.startsWith('http://')) {
        websiteUrlForInput = websiteUrlForInput.substring(7);
      }
      form.setValue('websiteUrl', websiteUrlForInput);
      form.setValue('phoneNumberValue', existingSubscription.phone_number_value || "");
    }
  }, [existingSubscription, form]);
};

