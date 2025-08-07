import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { logStep } from "../utils/logging.ts";
import { triggerWebhook } from "../utils/webhook.ts";
import { corsHeaders } from "../utils/cors.ts";

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  logStep("Processing checkout.session.completed", { 
    sessionId: session.id,
    paymentStatus: session.payment_status,
    subscriptionId: session.subscription
  });

  if (session.payment_status !== "paid") {
    logStep("Payment not completed yet", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status 
    });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Initialize Supabase client with service role key
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  // Find subscription with this pending session ID
  const { data: subscription, error: fetchError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('pending_stripe_session_id', session.id)
    .single();

  if (fetchError) {
    logStep("Error finding subscription with pending session ID", { 
      error: fetchError.message, 
      sessionId: session.id 
    });
    return new Response(`Database error: ${fetchError.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }

  if (!subscription) {
    logStep("No subscription found with pending session ID", { sessionId: session.id });
    return new Response(`No subscription found for session: ${session.id}`, { 
      status: 404,
      headers: corsHeaders 
    });
  }

  logStep("Found subscription for confirmation", { 
    subscriptionId: subscription.id,
    pendingAmount: subscription.pending_monthly_amount,
    pointsOptions: subscription.points_options
  });

  // Get the Stripe subscription ID from the session
  let stripeSubscriptionId = null;
  if (session.subscription) {
    stripeSubscriptionId = typeof session.subscription === 'string' 
      ? session.subscription 
      : session.subscription.id;
    logStep("Extracted Stripe subscription ID", { stripeSubscriptionId });
  }

  // Get the renewal day from the Stripe subscription
  let renewalDay = null;
  if (stripeSubscriptionId) {
    try {
      const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
        apiVersion: "2023-10-16",
      });
      const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
      renewalDay = new Date(stripeSubscription.current_period_end * 1000).getDate();
      logStep("Extracted renewal day from Stripe subscription", { renewalDay });
    } catch (error) {
      logStep("Error retrieving Stripe subscription for renewal day", { error: error.message });
      // Set to current day as fallback
      renewalDay = new Date().getDate();
    }
  }

  // Calculate total points: points_options + monthly_amount
  const totalPoints = subscription.points_options + subscription.pending_monthly_amount;

  // Confirm the subscription: move pending amount to actual amount
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ 
      monthly_amount: subscription.pending_monthly_amount,
      total_points: totalPoints,
      payment_status: 'completed',
      stripe_session_id: session.id,
      stripe_subscription_id: stripeSubscriptionId,
      subscription_renewal_day: renewalDay,
      pending_monthly_amount: null,
      pending_stripe_session_id: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', subscription.id)
    .select('*')
    .single();

  if (error) {
    logStep("Error confirming subscription payment", { 
      error: error.message, 
      subscriptionId: subscription.id 
    });
    return new Response(`Database error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }

  logStep("Subscription payment confirmed successfully", { 
    subscriptionId: subscription.id,
    confirmedAmount: data.monthly_amount,
    totalPoints: data.total_points,
    renewalDay: data.subscription_renewal_day,
    stripeSubscriptionId: data.stripe_subscription_id,
    sessionId: session.id
  });

  // Update conciergerie score and auto-validate if payment confirmed
  let conciergerieEmail = null;
  try {
    const { data: conciergerie } = await supabase
      .from('conciergeries')
      .select('mail, validated')
      .eq('id', subscription.conciergerie_id)
      .single();
    
    conciergerieEmail = conciergerie?.mail;

    // Auto-validate conciergerie when payment is confirmed
    const updateData: any = {};
    if (!conciergerie?.validated) {
      updateData.validated = true;
      logStep("Auto-validating conciergerie due to confirmed payment", { 
        conciergerieId: subscription.conciergerie_id 
      });
    }

    // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('conciergeries')
        .update(updateData)
        .eq('id', subscription.conciergerie_id);
      
      if (updateError) {
        logStep("Error updating conciergerie", { error: updateError });
      } else {
        logStep("Updated conciergerie", { 
          conciergerieId: subscription.conciergerie_id, 
          autoValidated: !conciergerie?.validated
        });
      }
    }
  } catch (updateError) {
    logStep("Error during conciergerie update", { error: updateError });
  }

  // Trigger webhook for payment confirmation
  await triggerWebhook({
    type: "subscription_payment",
    conciergerieId: subscription.conciergerie_id,
    amount: subscription.pending_monthly_amount,
    totalPoints,
    isFree: false,
    email: conciergerieEmail,
    basic_listing: data.basic_listing || false,
    partner_listing: data.partner_listing || false,
    website_link: data.website_link || false,
    phone_number: data.phone_number || false,
    backlink_home: data.backlink || false,
    backlink_gmb: data.conciergerie_page_link || false,
    timestamp: new Date().toISOString()
  });

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}