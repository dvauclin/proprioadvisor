import { logStep } from "./logging.ts";

// Fonction principale pour déclencher les webhooks
export const triggerWebhook = async (data: any) => {
  const webhookUrl = Deno.env.get('N8N_WEBHOOK_URL');

  if (!webhookUrl) {
    console.warn('N8N webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error('Webhook trigger failed:', err);
  }
};

// Webhooks essentiels uniformisés pour Stripe

// 1. Création souscription
export const triggerSubscriptionCreated = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_free: boolean;
  email: string;
  website_link: boolean;
  phone_number: boolean;
  backlink: boolean;
}) => {
  await triggerWebhook({
    type: 'subscription_created',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 2. Modification souscription
export const triggerSubscriptionUpdated = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_free: boolean;
  email: string;
  website_link: boolean;
  phone_number: boolean;
  backlink: boolean;
}) => {
  await triggerWebhook({
    type: 'subscription_updated',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 3. Annulation souscription
export const triggerSubscriptionCancelled = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_free: boolean;
  email: string;
  website_link: boolean;
  phone_number: boolean;
  backlink: boolean;
}) => {
  await triggerWebhook({
    type: 'subscription_cancelled',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 4. Premier paiement réussi - création abonnement
export const triggerFirstPaymentSuccess = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_first_payment: boolean;
}) => {
  await triggerWebhook({
    type: 'checkout_session_completed',
    timestamp: new Date().toISOString(),
    ...data
  });
};
