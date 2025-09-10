import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "../utils/logging.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  logStep("Processing invoice.payment_failed", { 
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription,
    amount: invoice.amount_due,
    status: invoice.status
  });

  if (!invoice.subscription) {
    logStep("No subscription associated with this invoice", { invoiceId: invoice.id });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const subscriptionId = typeof invoice.subscription === 'string' 
    ? invoice.subscription 
    : invoice.subscription.id;

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
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (fetchError || !dbSubscription) {
      logStep("No matching subscription found in database", { stripeSubscriptionId: subscriptionId });
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Found subscription for payment failure update", { 
      subscriptionId: dbSubscription.id,
      conciergerieId: dbSubscription.conciergerie_id
    });

    // Update subscription status to reflect payment failure
    // When payment fails, total_points should only include points_options (exclude monthly_amount)
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        payment_status: 'failed',
        total_points: dbSubscription.points_options || 0, // Exclude monthly_amount when payment fails
        updated_at: new Date().toISOString()
      })
      .eq('id', dbSubscription.id);

    if (updateError) {
      logStep("Error updating subscription payment status", { error: updateError.message });
      throw updateError;
    }

    logStep("Successfully updated subscription payment status to failed", { 
      subscriptionId: dbSubscription.id,
      totalPointsUpdated: dbSubscription.points_options || 0,
      excludedMonthlyAmount: true
    });

    // Optionally, you could also update the conciergerie validation status here
    // to remove premium features access

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    logStep("Error processing invoice payment failed", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
