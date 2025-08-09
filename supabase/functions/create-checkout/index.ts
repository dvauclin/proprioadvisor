
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from 'https://esm.sh/stripe@14.15.0';

// Webhook service
const triggerWebhook = async (data: any) => {
  try {
    const webhookUrl = "https://n8n.davidvauclin.fr/webhook/235febdf-0463-42fd-adb2-dbb6e1c2302d";
    
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
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Calculate points from options
const calculateOptionsPoints = (subscriptionData: any): number => {
  return (subscriptionData.backlink ? 5 : 0) + (subscriptionData.conciergerie_page_link ? 5 : 0);
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
    const { amount, score, conciergerieId, subscriptionData, cancelUrl } = await req.json();

    logStep("Received request", { amount, score, conciergerieId });
    logStep("Subscription data received", { subscriptionData });

    if (!conciergerieId) {
      throw new Error("conciergerieId is required");
    }

    const requestedAmount = amount / 100; // Convert from cents to euros
    const optionsPoints = calculateOptionsPoints(subscriptionData);

    // Check if subscription already exists
    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('conciergerie_id', conciergerieId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      logStep("Error fetching existing subscription", { error: fetchError });
      throw fetchError;
    }

    // Get conciergerie email for Stripe customer lookup
    const { data: conciergerie, error: conciergerieError } = await supabaseAdmin
      .from('conciergeries')
      .select('mail')
      .eq('id', conciergerieId)
      .single();

    if (conciergerieError || !conciergerie?.mail) {
      logStep("Error fetching conciergerie", { error: conciergerieError });
      throw new Error("Conciergerie not found or no email");
    }

    let subscriptionId;
    let isNewSubscription = !existingSubscription;

    // Create the cancel URL that redirects to the subscription page for this specific conciergerie
    const origin = req.headers.get("origin");
    const dynamicCancelUrl = `${origin}/subscription?conciergerieId=${conciergerieId}`;

    if (existingSubscription) {
      logStep("Found existing subscription", { 
        subscriptionId: existingSubscription.id,
        currentAmount: existingSubscription.monthly_amount,
        currentStatus: existingSubscription.payment_status,
        stripeSubscriptionId: existingSubscription.stripe_subscription_id,
        requestedAmount
      });

      subscriptionId = existingSubscription.id;
      const currentAmount = existingSubscription.monthly_amount;

      if (requestedAmount === 0) {
        // Transition to free (payant → gratuit) - Cas 6
        logStep("Transitioning to free subscription");
        
        // If there's a stripe_subscription_id, cancel it
        if (existingSubscription.stripe_subscription_id) {
          try {
            await stripe.subscriptions.cancel(existingSubscription.stripe_subscription_id);
            logStep("Cancelled Stripe subscription using stored ID", { 
              stripeSubscriptionId: existingSubscription.stripe_subscription_id 
            });
          } catch (stripeError) {
            logStep("Error cancelling Stripe subscription", { 
              error: stripeError.message,
              stripeSubscriptionId: existingSubscription.stripe_subscription_id 
            });
            // Continue anyway as we still want to update the database
          }
        } else {
          logStep("No stripe_subscription_id found, skipping Stripe cancellation");
        }

        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            ...subscriptionData,
            monthly_amount: 0,
            points_options: optionsPoints,
            total_points: optionsPoints, // total_points = points_options + 0
            payment_status: 'completed',
            stripe_subscription_id: null, // Clear the Stripe subscription ID
            subscription_renewal_day: null, // Remove renewal day when cancelling
            pending_monthly_amount: null,
            pending_stripe_session_id: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        if (updateError) {
          logStep("Error updating to free subscription", { error: updateError });
          throw updateError;
        }

        logStep("Successfully updated to free subscription");
        
        // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement

          // Trigger webhook for subscription modification
          logStep("Preparing webhook data for free subscription", { 
            websiteLink: subscriptionData.website_link,
            backlink: subscriptionData.backlink,
            subscriptionData 
          });
          
          await triggerWebhook({
            type: "subscription_updated",
            conciergerieId,
            amount: 0,
            totalPoints: optionsPoints,
            isFree: true,
            email: conciergerie.mail,
            basic_listing: subscriptionData.basic_listing || false,
            partner_listing: subscriptionData.partner_listing || false,
            website_link: subscriptionData.website_link || false,
            phone_number: subscriptionData.phone_number || false,
            backlink_home: subscriptionData.backlink || false,
            backlink_gmb: subscriptionData.conciergerie_page_link || false,
            timestamp: new Date().toISOString()
          });

        return new Response(JSON.stringify({ 
          url: `${req.headers.get("origin")}/success?subscription_id=${subscriptionId}&points=${optionsPoints}&updated=true&free=true`
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } else if (currentAmount > 0 && requestedAmount > 0) {
        // Transition from paid to paid (changement de tarif) - Cas 5
        logStep("Updating existing paid subscription", { currentAmount, requestedAmount });
        
        if (!existingSubscription.stripe_subscription_id) {
          logStep("ERROR: No stripe_subscription_id found for existing paid subscription", { 
            subscriptionId: existingSubscription.id 
          });
          throw new Error("Cannot update subscription: no Stripe subscription ID found");
        }
        
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

          // Update the Stripe subscription with proration
          const updatedStripeSubscription = await stripe.subscriptions.update(existingSubscription.stripe_subscription_id, {
            items: [
              {
                id: (await stripe.subscriptions.retrieve(existingSubscription.stripe_subscription_id)).items.data[0].id,
                price: newPrice.id,
              },
            ],
            proration_behavior: 'create_prorations',
          });

          logStep("Updated Stripe subscription with proration", { subscriptionId: updatedStripeSubscription.id });

          // Update the subscription in Supabase immediately since it's an existing active subscription
          const totalPoints = optionsPoints + requestedAmount;
          const { error: updateError } = await supabaseAdmin
            .from('subscriptions')
            .update({
              ...subscriptionData,
              monthly_amount: requestedAmount,
              points_options: optionsPoints,
              total_points: totalPoints,
              payment_status: 'completed',
              pending_monthly_amount: null,
              pending_stripe_session_id: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', subscriptionId);

          if (updateError) {
            logStep("Error updating subscription in Supabase", { error: updateError });
            throw updateError;
          }

          logStep("Successfully updated subscription in Supabase", { subscriptionId });

          // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement

          // Trigger webhook for subscription modification
          await triggerWebhook({
            type: "subscription_updated",
            conciergerieId,
            amount: requestedAmount,
            totalPoints,
            isFree: false,
            email: conciergerie.mail,
            basic_listing: subscriptionData.basic_listing || false,
            partner_listing: subscriptionData.partner_listing || false,
            website_link: subscriptionData.website_link || false,
            phone_number: subscriptionData.phone_number || false,
            backlink_home: subscriptionData.backlink || false,
            backlink_gmb: subscriptionData.conciergerie_page_link || false,
            timestamp: new Date().toISOString()
          });

          return new Response(JSON.stringify({ 
            url: `${req.headers.get("origin")}/success?subscription_id=${subscriptionId}&points=${totalPoints}&updated=true`
          }), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });

        } catch (stripeError) {
          logStep("Error updating Stripe subscription", { error: stripeError.message });
          throw new Error(`Failed to update Stripe subscription: ${stripeError.message}`);
        }
      } else if (currentAmount === 0 && requestedAmount > 0) {
        // Transition from free to paid (gratuit → payant) - Cas 7
        logStep("Preparing paid subscription transition", { currentAmount, requestedAmount });
        
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            ...subscriptionData,
            points_options: optionsPoints,
            pending_monthly_amount: requestedAmount,
            total_points: optionsPoints, // Keep current total_points until payment confirmed
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        if (updateError) {
          logStep("Error updating subscription with pending amount", { error: updateError });
          throw updateError;
        }

        logStep("Updated subscription with pending amount", { subscriptionId, pendingAmount: requestedAmount });
      } else {
        // Same amount, just update options (Cas 4)
        logStep("Updating subscription options without amount change");
        
        const totalPoints = optionsPoints + currentAmount;
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            ...subscriptionData,
            points_options: optionsPoints,
            total_points: totalPoints,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        if (updateError) {
          logStep("Error updating subscription options", { error: updateError });
          throw updateError;
        }

        // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement

        // Trigger webhook for subscription options update
        await triggerWebhook({
          type: "subscription_updated",
          conciergerieId,
          amount: currentAmount,
          totalPoints,
          isFree: currentAmount === 0,
          email: conciergerie.mail,
          basic_listing: subscriptionData.basic_listing || false,
          partner_listing: subscriptionData.partner_listing || false,
          website_link: subscriptionData.website_link || false,
          phone_number: subscriptionData.phone_number || false,
          backlink_home: subscriptionData.backlink || false,
          backlink_gmb: subscriptionData.conciergerie_page_link || false,
          timestamp: new Date().toISOString()
        });

        return new Response(JSON.stringify({ 
          url: `${req.headers.get("origin")}/success?subscription_id=${subscriptionId}&points=${totalPoints}&updated=true`
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    } else {
      // Create new subscription
      logStep("Creating new subscription");
      
      if (requestedAmount === 0) {
        // Create free subscription directly (Cas 1)
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('subscriptions')
          .insert({
            conciergerie_id: conciergerieId,
            ...subscriptionData,
            monthly_amount: 0,
            points_options: optionsPoints,
            total_points: optionsPoints, // total_points = points_options + 0
            payment_status: 'completed'
          })
          .select('id')
          .single();
        
        if (insertError) {
          logStep("Error creating free subscription", { error: insertError });
          throw insertError;
        }
        
        subscriptionId = insertData.id;
        logStep("Created free subscription", { subscriptionId });
        
        // Do NOT auto-validate on free subscription (business rule)
        logStep("Skipping auto-validation for free subscription", { conciergerieId });
        
        // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement

        // Trigger webhook for new free subscription
        await triggerWebhook({
          type: "subscription_created",
          conciergerieId,
          amount: 0,
          totalPoints: optionsPoints,
          isFree: true,
          email: conciergerie.mail,
          basic_listing: subscriptionData.basic_listing || false,
          partner_listing: subscriptionData.partner_listing || false,
          website_link: subscriptionData.website_link || false,
          phone_number: subscriptionData.phone_number || false,
          backlink_home: subscriptionData.backlink || false,
          backlink_gmb: subscriptionData.conciergerie_page_link || false,
          timestamp: new Date().toISOString()
        });

        return new Response(JSON.stringify({ 
          url: `${req.headers.get("origin")}/success?subscription_id=${subscriptionId}&points=${optionsPoints}&new=true&free=true`
        }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } else {
        // Create pending paid subscription (Cas 2)
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('subscriptions')
          .insert({
            conciergerie_id: conciergerieId,
            ...subscriptionData,
            monthly_amount: 0,
            points_options: optionsPoints,
            total_points: optionsPoints, // Will be updated after payment confirmation
            payment_status: 'pending',
            pending_monthly_amount: requestedAmount
          })
          .select('id')
          .single();
        
        if (insertError) {
          logStep("Error creating pending subscription", { error: insertError });
          throw insertError;
        }
        
        subscriptionId = insertData.id;
        logStep("Created pending subscription", { subscriptionId });
      }
    }

    // Create Stripe checkout session for paid subscriptions
    if (requestedAmount > 0) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Abonnement Proprioadvisor",
                description: "Support mensuel pour Proprioadvisor",
              },
              unit_amount: amount, // amount in cents
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}&subscription_id=${subscriptionId}&points=${optionsPoints + requestedAmount}&${isNewSubscription ? 'new=true' : 'updated=true'}`,
        cancel_url: dynamicCancelUrl,
        metadata: {
          conciergerieId: conciergerieId,
          subscriptionId: subscriptionId,
          score: optionsPoints + requestedAmount || 0,
        },
      });

      logStep("Stripe session created", { sessionId: session.id, subscriptionId });

      // Update subscription with pending Stripe session ID
      const { error: updateSessionError } = await supabaseAdmin
        .from('subscriptions')
        .update({ 
          pending_stripe_session_id: session.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (updateSessionError) {
        logStep("CRITICAL ERROR: Failed to update pending_stripe_session_id", { 
          error: updateSessionError, 
          subscriptionId, 
          sessionId: session.id 
        });
        throw new Error(`Failed to update pending_stripe_session_id: ${updateSessionError.message}`);
      }

      logStep("Successfully updated pending_stripe_session_id", { subscriptionId, sessionId: session.id });

      // Ne pas mettre à jour score_manuel - ce champ doit rester modifiable manuellement uniquement

      // Trigger webhook for new paid subscription (pending payment)
      await triggerWebhook({
        type: "subscription_created",
        conciergerieId,
        amount: requestedAmount,
        totalPoints: optionsPoints + requestedAmount,
        isFree: false,
        email: conciergerie.mail,
        basic_listing: subscriptionData.basic_listing || false,
        partner_listing: subscriptionData.partner_listing || false,
        website_link: subscriptionData.website_link || false,
        phone_number: subscriptionData.phone_number || false,
        backlink_home: subscriptionData.backlink || false,
        backlink_gmb: subscriptionData.conciergerie_page_link || false,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error) {
    logStep("CRITICAL ERROR in create-checkout", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
