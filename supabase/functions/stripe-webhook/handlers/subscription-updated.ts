import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "../utils/logging.ts";
import { triggerWebhook } from "../utils/webhook.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  logStep("Processing customer.subscription.updated", { subscriptionId: subscription.id });

  // Initialize Supabase client with service role key
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  // Find subscription in our database
  const { data: dbSubscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (fetchError || !dbSubscription) {
    logStep("No matching subscription found in database", { stripeSubscriptionId: subscription.id });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Get conciergerie email and check if validation is needed
  let conciergerieEmail = null;
  try {
    const { data: conciergerie } = await supabase
      .from('conciergeries')
      .select('mail, validated')
      .eq('id', dbSubscription.conciergerie_id)
      .single();
    
    conciergerieEmail = conciergerie?.mail;

    // Auto-validate conciergerie when subscription is updated and payment is confirmed
    // Only validate if the subscription is paid (monthly_amount > 0) and conciergerie is not already validated
    if (dbSubscription.monthly_amount > 0 && !conciergerie?.validated) {
      const { error: updateError } = await supabase
        .from('conciergeries')
        .update({ validated: true })
        .eq('id', dbSubscription.conciergerie_id);
      
      if (updateError) {
        logStep("Error auto-validating conciergerie", { error: updateError });
      } else {
        logStep("Auto-validated conciergerie due to confirmed paid subscription update", { 
          conciergerieId: dbSubscription.conciergerie_id 
        });
      }
    }
  } catch (error) {
    logStep("Error fetching conciergerie data", { error: error.message });
  }

  // Trigger webhook for subscription update
  await triggerWebhook({
    type: "subscription_updated",
    conciergerieId: dbSubscription.conciergerie_id,
    amount: dbSubscription.monthly_amount,
    totalPoints: dbSubscription.total_points,
    isFree: dbSubscription.monthly_amount === 0,
    email: conciergerieEmail,
    basic_listing: dbSubscription.basic_listing || false,
    partner_listing: dbSubscription.partner_listing || false,
    website_link: dbSubscription.website_link || false,
    phone_number: dbSubscription.phone_number || false,
    backlink_home: dbSubscription.backlink || false,
    backlink_gmb: dbSubscription.conciergerie_page_link || false,
    timestamp: new Date().toISOString()
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}