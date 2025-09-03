import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase/supabase-js@2.45.0";
import { logStep } from "../utils/logging.ts";
import { triggerSubscriptionCancelled } from "../utils/webhook.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logStep("Processing customer.subscription.deleted", { subscriptionId: subscription.id });

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

  logStep("Found subscription to cancel", { 
    subscriptionId: dbSubscription.id,
    conciergerieId: dbSubscription.conciergerie_id
  });

  // Get conciergerie email for webhook
  let conciergerieEmail = null;
  try {
    const { data: conciergerie } = await supabase
      .from('conciergeries')
      .select('mail')
      .eq('id', dbSubscription.conciergerie_id)
      .single();
    
    conciergerieEmail = conciergerie?.mail;
  } catch (error) {
    logStep("Error fetching conciergerie data", { error: error.message });
  }

  // Update the subscription in Supabase to reflect cancellation
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      monthly_amount: 0,
      payment_status: 'cancelled',
      stripe_subscription_id: null,
      stripe_session_id: null,
      total_points: dbSubscription.points_options || 0, // Keep basic points if any
      subscription_renewal_day: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', dbSubscription.id);

  if (updateError) {
    logStep("Error updating subscription in Supabase", { error: updateError });
    return new Response(`Database error: ${updateError.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }

  logStep("Successfully cancelled subscription in Supabase", { subscriptionId: dbSubscription.id });

  // Trigger webhook for subscription cancellation
  await triggerSubscriptionCancelled({
    subscription_id: dbSubscription.id,
    conciergerie_id: dbSubscription.conciergerie_id,
    amount: 0,
    total_points: dbSubscription.points_options || 0,
    is_free: true,
    email: conciergerieEmail || '',
    website_link: dbSubscription.website_link || false,
    phone_number: dbSubscription.phone_number || false,
    backlink: dbSubscription.backlink || false,
            
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
