
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.15.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-ACTIVE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }

    logStep("Checking active subscription for email", { email });

    // Set up the Stripe client
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Find the Stripe customer
    const customers = await stripe.customers.list({ 
      email: email, 
      limit: 1 
    });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found", { email });
      return new Response(JSON.stringify({ hasActiveSubscription: false }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all', // Récupérer tous les statuts pour pouvoir filtrer
      limit: 100
    });

    // Filtrer pour ne garder que les abonnements vraiment actifs
    const activeSubscriptions = subscriptions.data.filter(sub => 
      ['active', 'trialing'].includes(sub.status)
    );

    const hasActiveSubscription = activeSubscriptions.length > 0;
    logStep("Active subscription check result", { 
      hasActiveSubscription, 
      subscriptionCount: activeSubscriptions.length,
      totalSubscriptions: subscriptions.data.length,
      subscriptionStatuses: subscriptions.data.map(s => ({ id: s.id, status: s.status }))
    });

    return new Response(JSON.stringify({ hasActiveSubscription }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    logStep("CRITICAL ERROR in check-active-subscription", { error: error.message });
    return new Response(JSON.stringify({ error: error.message, hasActiveSubscription: false }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
