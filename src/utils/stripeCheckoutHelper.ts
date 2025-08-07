import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionFormValues } from '@/types/subscription';

interface InitiateStripeCheckoutParams {
  totalMonthlyFee: number;
  totalPoints: number;
  conciergerieId: string | null;
  values: SubscriptionFormValues;
  normalizedWebsiteUrl: string | null;
  existingSubscription: any;
  userLoggedIn: boolean;
  supabase: SupabaseClient;
  toast: ({ title, description, variant }: { title: string; description: string; variant?: 'default' | 'destructive' }) => void;
}

export const initiateStripeCheckout = async ({
  totalMonthlyFee,
  totalPoints,
  conciergerieId,
  values,
  normalizedWebsiteUrl,
  existingSubscription,
  userLoggedIn,
  supabase,
  toast,
}: InitiateStripeCheckoutParams): Promise<void> => {
  if (!conciergerieId) {
    toast({ title: "Erreur", description: "ID de conciergerie manquant.", variant: "destructive" });
    throw new Error("ID de conciergerie manquant.");
  }
  const amount = totalMonthlyFee * 100;

  toast({
    title: "Redirection vers Stripe",
    description: "Vous allez être redirigé vers notre page de paiement sécurisée."
  });

  console.log("Envoi de la requête à Stripe avec montant:", amount, "et score:", totalPoints);

  const currentUrl = window.location.href;
  const returnUrl = userLoggedIn 
    ? `${window.location.origin}/subscription?conciergerieId=${conciergerieId}&logged_in=true` 
    : currentUrl;

  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      amount: amount,
      score: totalPoints,
      conciergerieId: conciergerieId,
      subscriptionData: {
        basic_listing: values.options.basicListing,
        partner_listing: values.options.partnerListing,
        website_link: values.options.websiteLink,
        phone_number: values.options.phoneNumber,
        backlink: values.options.backlink,
        conciergerie_page_link: values.options.conciergeriePageLink,
        monthly_amount: totalMonthlyFee,
        use_custom_amount: values.useCustomAmount,
        total_points: totalPoints,
        website_url: normalizedWebsiteUrl || null,
        phone_number_value: values.phoneNumberValue || null
      },
      isUpdate: !!existingSubscription,
      existingSubscriptionId: existingSubscription?.id,
      cancelUrl: returnUrl
    }
  });

  if (error) {
    console.error("Error invoking create-checkout function:", error);
    toast({
        title: "Erreur Stripe",
        description: "Impossible d'initier le paiement Stripe.",
        variant: "destructive"
    });
    throw error; // Re-throw to be caught by the main handler
  }

  console.log("Réponse de la fonction create-checkout:", data);
  if (data?.url) {
    console.log("Redirection vers:", data.url);
    window.location.href = data.url;
  } else {
    toast({
        title: "Erreur Stripe",
        description: "URL de paiement non reçue de Stripe.",
        variant: "destructive"
    });
    throw new Error("URL de paiement non reçue");
  }
};
