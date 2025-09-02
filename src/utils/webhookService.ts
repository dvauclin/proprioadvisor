// Types pour les webhooks
export interface WebhookData {
  type: string;
  timestamp: string;
  [key: string]: any;
}

// Fonction principale pour déclencher les webhooks
export const triggerWebhook = async (data: WebhookData) => {
  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('N8N webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error('Webhook trigger failed:', err);
  }
};

// Webhooks essentiels uniformisés

// 1. Création conciergerie
export const triggerConciergerieCreation = async (data: {
  conciergerie_id: string;
  nom: string;
  email: string;
  telephone_contact: string | null;
  nom_contact: string | null;
  type_logement_accepte: string | null;
  deduction_frais: boolean | null;
  accepte_gestion_partielle: boolean | null;
  accepte_residence_principale: boolean | null;
  superficie_min: number | null;
  nombre_chambres_min: number | null;
  zone_couverte: string | null;
  url_avis: string | null;
  villes_ids: string[];
  nombre_formules: number;
}) => {
  await triggerWebhook({
    type: 'inscription_conciergerie',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 2. Modification conciergerie
export const triggerConciergerieModification = async (data: {
  conciergerie_id: string;
  nom: string;
  email: string;
}) => {
  await triggerWebhook({
    type: 'modification_conciergerie',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 3. Création compte utilisateur
export const triggerUserAccountCreation = async (data: {
  user_id: string;
  email: string;
  conciergerie_id?: string;
}) => {
  await triggerWebhook({
    type: 'creation_compte',
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

// 5. Création souscription
export const triggerSubscriptionCreated = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_free: boolean;
  email: string;
  basic_listing: boolean;
  partner_listing: boolean;
  website_link: boolean;
  phone_number: boolean;
  backlink_home: boolean;
  backlink_gmb: boolean;
}) => {
  await triggerWebhook({
    type: 'subscription_created',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 6. Modification souscription
export const triggerSubscriptionUpdated = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_free: boolean;
  email: string;
  basic_listing: boolean;
  partner_listing: boolean;
  website_link: boolean;
  phone_number: boolean;
  backlink_home: boolean;
  backlink_gmb: boolean;
}) => {
  await triggerWebhook({
    type: 'subscription_updated',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 7. Annulation souscription
export const triggerSubscriptionCancelled = async (data: {
  subscription_id: string;
  conciergerie_id: string;
  amount: number;
  total_points: number;
  is_free: boolean;
  email: string;
  basic_listing: boolean;
  partner_listing: boolean;
  website_link: boolean;
  phone_number: boolean;
  backlink_home: boolean;
  backlink_gmb: boolean;
}) => {
  await triggerWebhook({
    type: 'subscription_cancelled',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 8. Envoi d'un lead
export const triggerLeadSubmitted = async (data: {
  nom: string;
  email: string;
  conciergerie_id?: string;
}) => {
  await triggerWebhook({
    type: 'lead_submitted',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 9. Envoi multiple de leads
export const triggerMultipleLeadsSubmitted = async (data: {
  total_leads: number;
  conciergeries: Array<{ nom: string; email: string }>;
}) => {
  await triggerWebhook({
    type: 'multiple_leads_submitted',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 10. Message de contact
export const triggerContactMessageSent = async (data: {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}) => {
  await triggerWebhook({
    type: 'contact_message_sent',
    timestamp: new Date().toISOString(),
    ...data
  });
};

