"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisibilityOptionsSection } from "@/components/subscription/VisibilityOptionsSection";
import { PaidPlanOptionsSection } from "@/components/subscription/PaidPlanOptionsSection";
import { PasswordForm } from "@/components/subscription/PasswordForm";
import { useSubscriptionSubmit } from "@/hooks/useSubscriptionSubmit";
import { useFormPreFill } from "@/hooks/useFormPreFill";
import { createSubscriptionSchema } from "@/schemas/subscriptionSchemaFactory";
import { SubscriptionFormValues } from "@/types/subscription";

interface SubscriptionFormProps {
  existingSubscription: any;
  conciergerieId: string | null;
  conciergerieEmail: string;
  currentMonthlyPayment: number;
}
export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  existingSubscription,
  conciergerieId,
  conciergerieEmail,
  currentMonthlyPayment
}) => {
  const subscriptionSchema = useMemo(() => {
    return createSubscriptionSchema(!!existingSubscription, !!conciergerieEmail);
  }, [existingSubscription, conciergerieEmail]);
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      options: {
        basicListing: true,
        partnerListing: false,
        websiteLink: false,
        phoneNumber: false,
        backlink: false,
        conciergeriePageLink: false
      },
      customAmount: "5",
      useCustomAmount: false,
      websiteUrl: "",
      phoneNumberValue: "",
      password: "",
      confirmPassword: ""
    }
  });
  useFormPreFill({
    form,
    existingSubscription
  });

  // Watch form values for reactive calculation
  const options = form.watch("options");
  const useCustomAmount = form.watch("useCustomAmount");
  const customAmount = form.watch("customAmount");

  // Calculate current points based on watched form values
  const currentPoints = useMemo(() => {
    const customAmountValue = useCustomAmount ? Number(customAmount) || 0 : 0;
    const optionPoints = (options.backlink ? 5 : 0) + (options.conciergeriePageLink ? 5 : 0);
    return optionPoints + customAmountValue;
  }, [options.backlink, options.conciergeriePageLink, useCustomAmount, customAmount]);
  const isPaidPlan = useCustomAmount && Number(customAmount) >= 1;
  const {
    handleSubscription,
    loading
  } = useSubscriptionSubmit({
    totalMonthlyFee: Number(customAmount) || 0,
    totalPoints: currentPoints,
    conciergerieId,
    conciergerieEmail,
    existingSubscription
  });
  return <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100 px-[12px] py-[12px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubscription)} className="space-y-6 md:space-y-6 space-y-3">
          <VisibilityOptionsSection form={form} currentPoints={currentPoints} currentMonthlyPayment={currentMonthlyPayment} renewalDay={existingSubscription?.subscription_renewal_day} />

          <PaidPlanOptionsSection form={form} isPaid={isPaidPlan} />

          <PasswordForm form={form} existingSubscription={existingSubscription} conciergerieEmail={conciergerieEmail} />

          <div className="text-center pt-6 md:pt-6 pt-3">
            <Button type="submit" size="lg" className="bg-brand-chartreuse hover:bg-brand-chartreuse/90 text-black" disabled={loading}>
              {loading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Traitement en cours...
                </> : existingSubscription ? "Mettre à jour la souscription" : "Souscrire maintenant"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Vous pourrez modifier ou annuler votre souscription à tout moment
            </p>
          </div>
        </form>
      </Form>
    </div>;
};