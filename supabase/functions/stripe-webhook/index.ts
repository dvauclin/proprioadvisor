import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { corsHeaders } from "./utils/cors.ts";
import { logStep } from "./utils/logging.ts";
import { handleCheckoutSessionCompleted } from "./handlers/checkout-session-completed.ts";
import { handleSubscriptionCreated } from "./handlers/subscription-created.ts";
import { handleSubscriptionUpdated } from "./handlers/subscription-updated.ts";
import { handleSubscriptionDeleted } from "./handlers/subscription-deleted.ts";
import { handleInvoicePaymentFailed } from "./handlers/invoice-payment-failed.ts";
import { handleSubscriptionStatusChanged } from "./handlers/subscription-status-changed.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No stripe-signature header found");
    }

    // Get the raw body
    const body = await req.text();
    logStep("Received webhook body", { bodyLength: body.length });

    // Verify the webhook signature using the ASYNC version
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook signature verified", { eventType: event.type });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook signature verification failed: ${err.message}`, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        return await handleCheckoutSessionCompleted(session);

      case "customer.subscription.created":
        const createdSubscription = event.data.object as Stripe.Subscription;
        return await handleSubscriptionCreated(createdSubscription);

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;
        // Vérifier si le statut a changé vers un état problématique
        if (['past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired'].includes(updatedSubscription.status)) {
          return await handleSubscriptionStatusChanged(updatedSubscription);
        }
        return await handleSubscriptionUpdated(updatedSubscription);

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        return await handleSubscriptionDeleted(deletedSubscription);

      case "invoice.payment_failed":
        const invoice = event.data.object as Stripe.Invoice;
        return await handleInvoicePaymentFailed(invoice);

      default:
        logStep("Unhandled event type", { eventType: event.type });
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
