import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "../utils/logging.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function handleSubscriptionStatusChanged(subscription: Stripe.Subscription) {
  logStep("Processing subscription status change", { 
    subscriptionId: subscription.id,
    status: subscription.status,
    previousStatus: subscription.status // Note: Stripe doesn't provide previous status in this event
  });

  // Initialize Supabase client with service role key
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
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

    logStep("Found subscription for status change update", { 
      subscriptionId: dbSubscription.id,
      conciergerieId: dbSubscription.conciergerie_id
    });

    // Map Stripe status to our payment_status
    let paymentStatus: string;
    switch (subscription.status) {
      case 'past_due':
        paymentStatus = 'past_due';
        break;
      case 'unpaid':
        paymentStatus = 'unpaid';
        break;
      case 'canceled':
        paymentStatus = 'cancelled';
        break;
      case 'incomplete':
        paymentStatus = 'incomplete';
        break;
      case 'incomplete_expired':
        paymentStatus = 'expired';
        break;
      default:
        paymentStatus = 'unknown';
    }

    // Update subscription status
    // For problematic payment statuses, total_points should only include points_options (exclude monthly_amount)
    const shouldExcludeMonthlyAmount = ['past_due', 'unpaid', 'cancelled', 'expired'].includes(paymentStatus);
    const newTotalPoints = shouldExcludeMonthlyAmount 
      ? (dbSubscription.points_options || 0) 
      : dbSubscription.total_points;

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        payment_status: paymentStatus,
        total_points: newTotalPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', dbSubscription.id);

    if (updateError) {
      logStep("Error updating subscription status", { error: updateError.message });
      throw updateError;
    }

    logStep("Successfully updated subscription status", { 
      subscriptionId: dbSubscription.id,
      newStatus: paymentStatus,
      totalPointsUpdated: newTotalPoints,
      excludedMonthlyAmount: shouldExcludeMonthlyAmount
    });

    // If subscription is in a problematic state, we might want to:
    // 1. Remove premium features access
    // 2. Send notification to user
    // 3. Update conciergerie validation status

    if (['past_due', 'unpaid', 'cancelled', 'expired'].includes(paymentStatus)) {
      logStep("Subscription in problematic state - premium features should be disabled", {
        subscriptionId: dbSubscription.id,
        status: paymentStatus
      });
      
      // Here you could add logic to:
      // - Update conciergerie validation status
      // - Send email notification
      // - Log the issue for admin review
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Error processing subscription status change", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
