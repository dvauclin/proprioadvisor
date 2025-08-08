import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionFormValues } from '@/types/subscription';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ProcessDirectSubscriptionParams {
  values: SubscriptionFormValues;
  conciergerieId: string;
  totalMonthlyFee: number;
  totalPoints: number;
  existingSubscription: any;
  normalizedWebsiteUrl: string | null;
  supabase: SupabaseClient;
  navigate: AppRouterInstance;
  toast: ({ title, description, variant }: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
}

export const processDirectSubscription = async ({
  values,
  conciergerieId,
  totalMonthlyFee,
  totalPoints,
  existingSubscription,
  normalizedWebsiteUrl,
  supabase,
  navigate,
  toast,
}: ProcessDirectSubscriptionParams): Promise<void> => {
  const subscriptionData = {
    conciergerie_id: conciergerieId,
    basic_listing: values.options.basicListing,
    partner_listing: values.options.partnerListing,
    website_link: values.options.websiteLink,
    phone_number: values.options.phoneNumber,
    backlink: values.options.backlink,
    conciergerie_page_link: values.options.conciergeriePageLink,
    monthly_amount: totalMonthlyFee,
    use_custom_amount: values.useCustomAmount,
    total_points: totalPoints,
    payment_status: 'completed',
    website_url: normalizedWebsiteUrl || null,
    phone_number_value: values.phoneNumberValue || null
  };

  let subscriptionId;
  let error;

  if (existingSubscription) {
    const { data: updateData, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        ...subscriptionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingSubscription.id)
      .select('id')
      .single();
    error = updateError;
    subscriptionId = updateData?.id || existingSubscription.id;
  } else {
    const { data: insertData, error: insertError } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select('id')
      .single();
    error = insertError;
    subscriptionId = insertData?.id;
  }

  if (error) {
    console.error("Error saving subscription:", error);
    toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la souscription directement.",
        variant: "destructive"
    });
    throw error; // Re-throw to be caught by the main handler
  }

  // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement
  
  toast({
    title: existingSubscription ? "Souscription mise à jour" : "Souscription réussie",
    description: "Votre souscription a été traitée avec succès.",
  });

  const updateParam = existingSubscription ? "&update=true" : "";
  navigate.push(`/success?subscription_id=${subscriptionId}&points=${totalPoints}${updateParam}`);
};

