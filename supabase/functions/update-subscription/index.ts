
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@14.15.0';

// Webhook service
const triggerWebhook = async (data: any) => {
  try {
    const webhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    if (!webhookUrl) return;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    logStep("Webhook triggered successfully", { type: data.type });
  } catch (error) {
    logStep("Error triggering webhook", { error: error.message });
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[UPDATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Set up the Stripe client
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get the request body
    const { amount, conciergerieId, subscriptionData, existingSubscriptionId } = await req.json();

    logStep("Received update request", { amount, conciergerieId, existingSubscriptionId });

    if (!existingSubscriptionId) {
      throw new Error("No existing subscription ID provided");
    }

    // Get the existing subscription from Supabase
    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('id', existingSubscriptionId)
      .single();

    if (fetchError || !existingSubscription) {
      logStep("Error fetching existing subscription", { error: fetchError });
      throw new Error("Existing subscription not found");
    }

    logStep("Found existing subscription", { 
      subscriptionId: existingSubscriptionId,
      stripeSubscriptionId: existingSubscription.stripe_subscription_id 
    });

    // Verify that we have a Stripe subscription ID
    if (!existingSubscription.stripe_subscription_id) {
      logStep("ERROR: No stripe_subscription_id found", { subscriptionId: existingSubscriptionId });
      throw new Error("Cannot update subscription: no Stripe subscription ID found");
    }

    // Update the Stripe subscription directly using the stored ID
    try {
      // Create new price for the updated amount
      const newPrice = await stripe.prices.create({
        currency: "eur",
        product_data: {
          name: "Abonnement Proprioadvisor",
        },
        unit_amount: amount,
        recurring: {
          interval: "month",
        },
      });

      logStep("Created new price", { priceId: newPrice.id, amount });

      // Get the subscription items to update
      const stripeSubscription = await stripe.subscriptions.retrieve(existingSubscription.stripe_subscription_id);
      
      // Update the Stripe subscription with the new price
      const updatedStripeSubscription = await stripe.subscriptions.update(existingSubscription.stripe_subscription_id, {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: newPrice.id,
          },
        ],
        proration_behavior: 'create_prorations', // This will handle prorated billing
      });

      logStep("Updated Stripe subscription", { subscriptionId: updatedStripeSubscription.id });

      // Update the subscription in Supabase
      const { error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          ...subscriptionData,
          monthly_amount: amount / 100, // Convert from cents to euros
          updated_at: new Date().toISOString(),
          payment_status: 'completed' // The subscription is already active, so mark as completed
        })
        .eq('id', existingSubscriptionId);

      if (updateError) {
        logStep("Error updating subscription in Supabase", { error: updateError });
        throw updateError;
      }

      logStep("Successfully updated subscription in Supabase", { subscriptionId: existingSubscriptionId });

      // Get conciergerie email for webhook and check validation
      let conciergerieEmail = null;
      if (conciergerieId) {
        const { data: conciergerie } = await supabaseAdmin
          .from('conciergeries')
          .select('mail, validated')
          .eq('id', conciergerieId)
          .single();
        conciergerieEmail = conciergerie?.mail;

        // ❌ NE PAS VALIDER ICI - La validation se fera uniquement après confirmation du paiement
        // Log pour indiquer que la validation attendra la confirmation du paiement
        if ((amount / 100) > 0) {
          logStep("Subscription updated - validation will occur after payment confirmation", { 
            conciergerieId 
          });
        }
      }

      // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement

      // Trigger webhook for subscription update
      await triggerWebhook({
        type: "subscription_updated",
        conciergerieId,
        amount: amount / 100,
        totalPoints: subscriptionData.total_points,
        isFree: (amount / 100) === 0,
        email: conciergerieEmail,
        phone_number: subscriptionData.phone_number || false,
        website_link: subscriptionData.website_link || false,
        backlink: subscriptionData.backlink || false,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({ 
        success: true, 
        subscriptionId: updatedStripeSubscription.id,
        message: "Subscription updated successfully"
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (stripeError) {
      logStep("Error updating Stripe subscription", { 
        error: stripeError.message,
        stripeSubscriptionId: existingSubscription.stripe_subscription_id 
      });
      throw new Error(`Failed to update Stripe subscription: ${stripeError.message}`);
    }
  } catch (error) {
    logStep("CRITICAL ERROR in update-subscription", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
