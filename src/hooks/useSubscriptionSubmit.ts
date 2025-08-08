
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui-kit/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionFormValues } from '@/types/subscription';
import { handleUserAuthentication } from '@/utils/subscriptionAuthHelper';
import { triggerWebhook } from '@/utils/webhookService';

interface UseSubscriptionSubmitProps {
  totalMonthlyFee: number;
  totalPoints: number;
  conciergerieId: string | null;
  conciergerieEmail: string;
  existingSubscription: any;
}

export const useSubscriptionSubmit = ({
  totalMonthlyFee,
  totalPoints,
  conciergerieId,
  conciergerieEmail,
  existingSubscription
}: UseSubscriptionSubmitProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscription = async (values: SubscriptionFormValues) => {
    console.log("handleSubscription appelé avec:", values);
    
    if (!conciergerieId) {
      toast({ title: "Erreur", description: "ID de conciergerie manquant.", variant: "destructive" });
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const amountInCents = totalMonthlyFee * 100;
      
      if (totalMonthlyFee < 0) {
        toast({ title: "Erreur", description: "Le montant ne peut pas être négatif.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Normalize website URL
      let normalizedWebsiteUrl = values.websiteUrl;
      if (normalizedWebsiteUrl && normalizedWebsiteUrl.trim() !== "") {
        const trimmedUrl = normalizedWebsiteUrl.trim();
        if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
          normalizedWebsiteUrl = `https://${trimmedUrl}`;
        } else {
          normalizedWebsiteUrl = trimmedUrl;
        }
      }

      // Attempt authentication only if email and password are provided and user is not already logged in
      if (conciergerieEmail && values.password && !user) {
        const authResult = await handleUserAuthentication({
          email: conciergerieEmail,
          password: values.password,
          supabase,
          signIn,
          toast
        });
        
        if (authResult.errorOccurred && !authResult.userLoggedIn) {
          setLoading(false);
          return;
        }
      }

      // Prepare subscription data
      const subscriptionData = {
        basic_listing: values.options.basicListing,
        partner_listing: values.options.partnerListing,
        website_link: values.options.websiteLink,
        phone_number: values.options.phoneNumber,
        backlink: values.options.backlink,
        conciergerie_page_link: values.options.conciergeriePageLink,
        use_custom_amount: values.useCustomAmount,
        website_url: normalizedWebsiteUrl || null,
        phone_number_value: values.phoneNumberValue || null
      };

      // Si c'est une souscription gratuite (pas d'abonnement payant coché), traiter directement
      if (!values.useCustomAmount || totalMonthlyFee === 0) {
        console.log("Souscription gratuite détectée, traitement direct sans Stripe");
        
        // Si on a une souscription existante qui était payante, il faut d'abord annuler l'abonnement Stripe
        if (existingSubscription && existingSubscription.stripe_subscription_id && existingSubscription.monthly_amount > 0) {
          console.log("Annulation de l'abonnement Stripe existant");
          try {
            const { error: cancelError } = await supabase.functions.invoke("cancel-subscription", {
              body: { subscriptionId: existingSubscription.id }
            });
            
            if (cancelError) {
              console.error("Erreur lors de l'annulation:", cancelError);
              toast({
                title: "Erreur",
                description: "Impossible d'annuler l'abonnement existant.",
                variant: "destructive"
              });
              setLoading(false);
              return;
            }
            
            console.log("Abonnement Stripe annulé avec succès");
          } catch (cancelError) {
            console.error("Erreur lors de l'annulation de l'abonnement:", cancelError);
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de l'annulation de l'abonnement.",
              variant: "destructive"
            });
            setLoading(false);
            return;
          }
        }
        
        // Traiter la souscription gratuite directement
        // Vérifier s'il existe déjà une souscription pour cette conciergerie
        const { data: existingData } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('conciergerie_id', conciergerieId)
          .single();

        let subscriptionId;
        let isUpdate = false;

        if (existingData) {
          // Mettre à jour la souscription existante
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              ...subscriptionData,
              monthly_amount: 0,
              payment_status: 'active',
              total_points: totalPoints,
              updated_at: new Date().toISOString()
            })
            .eq('conciergerie_id', conciergerieId);

          if (updateError) {
            throw updateError;
          }
          
          subscriptionId = existingData.id;
          isUpdate = true;
        } else {
          // Créer une nouvelle souscription
          const { data: insertData, error: insertError } = await supabase
            .from('subscriptions')
            .insert({
              conciergerie_id: conciergerieId,
              ...subscriptionData,
              monthly_amount: 0,
              payment_status: 'active',
              total_points: totalPoints,
              updated_at: new Date().toISOString()
            })
            .select('id')
            .single();

          if (insertError) {
            throw insertError;
          }
          
          subscriptionId = insertData.id;
          isUpdate = false;
        }

        // Auto-validation conciergerie pour la souscription gratuite
        try {
          const { data: conciergerie } = await supabase
            .from('conciergeries')
            .select('validated')
            .eq('id', conciergerieId)
            .single();
          
          if (!conciergerie?.validated) {
            const { error: updateError } = await supabase
              .from('conciergeries')
              .update({ validated: true })
              .eq('id', conciergerieId);
            
            if (updateError) {
              console.error("Error auto-validating conciergerie for free subscription:", updateError);
            } else {
              console.log("Auto-validated conciergerie for free subscription:", conciergerieId);
            }
          }
        } catch (error) {
          console.error("Error during conciergerie validation for free subscription:", error);
        }
        
        // Déclencher le webhook
        try {
          await triggerWebhook({
            type: 'subscription_update',
            subscription_id: subscriptionId,
            conciergerie_id: conciergerieId,
            total_points: totalPoints,
            monthly_amount: 0,
            is_update: isUpdate,
            is_free: true
          });
        } catch (webhookError) {
          console.error("Erreur lors du déclenchement du webhook:", webhookError);
        }

        // Rediriger vers la page de succès avec tous les paramètres
        const params = new URLSearchParams({
          subscription_id: subscriptionId,
          points: totalPoints.toString(),
          updated: isUpdate.toString(),
          free: 'true'
        });
        
        router.push(`/success?${params.toString()}`);
        return;
      }

      console.log("Calling create-checkout with:", {
        amount: amountInCents,
        score: totalPoints,
        conciergerieId,
        subscriptionData
      });

      // Create the cancel URL that redirects to the subscription page for this specific conciergerie
      const cancelUrl = `${window.location.origin}/subscription?conciergerieId=${conciergerieId}`;

      // Call create-checkout edge function
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          amount: amountInCents,
          score: totalPoints,
          conciergerieId: conciergerieId,
          subscriptionData,
          cancelUrl: cancelUrl
        }
      });

      if (error) {
        console.error("Error creating checkout:", error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session de paiement.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log("Checkout response:", data);

      if (data?.url) {
        // Déclencher le webhook pour les souscriptions payantes
        try {
          await triggerWebhook({
            type: 'subscription_checkout',
            conciergerie_id: conciergerieId,
            total_points: totalPoints,
            monthly_amount: totalMonthlyFee,
            checkout_url: data.url
          });
        } catch (webhookError) {
          console.error("Erreur lors du déclenchement du webhook:", webhookError);
        }
        
        // Redirect to URL
        if (data.url.includes('/success')) {
          window.location.href = data.url;
        } else {
          window.location.href = data.url;
        }
      } else {
        throw new Error("No checkout URL received");
      }

    } catch (error) {
      console.error("Erreur lors de la souscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la souscription.",
        variant: "destructive"
      });
    } finally {
      if (document.visibilityState === 'visible') {
        setLoading(false);
      }
    }
  };

  return { handleSubscription, loading };
};


