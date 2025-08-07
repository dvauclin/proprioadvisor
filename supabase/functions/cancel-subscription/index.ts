import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@14.15.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
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
    const { subscriptionId } = await req.json();

    logStep("Received cancellation request", { subscriptionId });

    if (!subscriptionId) {
      throw new Error("No subscription ID provided");
    }

    // Get the existing subscription from Supabase
    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError || !existingSubscription) {
      logStep("Error fetching existing subscription", { error: fetchError });
      throw new Error("Existing subscription not found");
    }

    logStep("Found existing subscription", { 
      subscriptionId,
      stripeSubscriptionId: existingSubscription.stripe_subscription_id 
    });

    // Check if there's a Stripe subscription to cancel
    if (existingSubscription.stripe_subscription_id) {
      try {
        // Cancel the Stripe subscription
        const canceledSubscription = await stripe.subscriptions.cancel(
          existingSubscription.stripe_subscription_id
        );

        logStep("Cancelled Stripe subscription", { 
          stripeSubscriptionId: canceledSubscription.id,
          status: canceledSubscription.status
        });
      } catch (stripeError) {
        logStep("Error cancelling Stripe subscription", { 
          error: stripeError.message,
          stripeSubscriptionId: existingSubscription.stripe_subscription_id 
        });
        // Continue even if Stripe cancellation fails - we still want to update our DB
      }
    } else {
      logStep("No Stripe subscription to cancel");
    }

    // Update the subscription in Supabase to reflect cancellation
    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        monthly_amount: 0,
        payment_status: 'cancelled',
        stripe_subscription_id: null,
        stripe_session_id: null,
        total_points: 0,
        use_custom_amount: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);

    if (updateError) {
      logStep("Error updating subscription in Supabase", { error: updateError });
      throw updateError;
    }

    logStep("Successfully cancelled subscription", { subscriptionId });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription cancelled successfully"
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    logStep("CRITICAL ERROR in cancel-subscription", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});