// Types pour les webhooks
export interface WebhookData {
  type: string;
  timestamp: string;
  [key: string]: any;
}

// Configuration des webhooks
const WEBHOOK_CONFIG = {
  url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL,
  timeout: 10000, // 10 secondes
  retries: 2
};

// Fonction principale pour déclencher les webhooks avec gestion d'erreur améliorée
export const triggerWebhook = async (data: WebhookData): Promise<boolean> => {
  if (!WEBHOOK_CONFIG.url) {
    console.warn('⚠️ N8N webhook URL not configured');
    return false;
  }

  for (let attempt = 0; attempt <= WEBHOOK_CONFIG.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

      const response = await fetch(WEBHOOK_CONFIG.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status} ${response.statusText}`);
      }

      console.log(`✅ Webhook ${data.type} envoyé avec succès`);
      return true;

    } catch (err) {
      const error = err as Error;
      console.error(`❌ Tentative ${attempt + 1}/${WEBHOOK_CONFIG.retries + 1} échouée pour ${data.type}:`, error.message);
      
      if (attempt === WEBHOOK_CONFIG.retries) {
        console.error(`💥 Webhook ${data.type} définitivement échoué après ${WEBHOOK_CONFIG.retries + 1} tentatives`);
        return false;
      }

      // Attendre avant de réessayer (backoff exponentiel)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return false;
};

// ============================================================================
// WEBHOOKS ESSENTIELS UNIFORMISÉS
// ============================================================================

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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
    type: 'lead_submitted',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 9. Envoi multiple de leads
export const triggerMultipleLeadsSubmitted = async (data: {
  total_leads: number;
  conciergeries: Array<{ nom: string; email: string }>;
}): Promise<boolean> => {
  return await triggerWebhook({
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
}): Promise<boolean> => {
  return await triggerWebhook({
    type: 'contact_message_sent',
    timestamp: new Date().toISOString(),
    ...data
  });
};

// 11. Validation conciergerie
export const triggerConciergerieValidation = async (data: {
  nom: string;
  email: string;
  villesSelectionnees: Array<{ nom: string; url: string }>;
  conciergerieID: string;
  nombrePoints: number;
  montantAbonnement: number;
}): Promise<boolean> => {
  return await triggerWebhook({
    type: 'validation_conciergerie',
    timestamp: new Date().toISOString(),
    ...data
  });
};



// 12. Avis soumis
export const triggerAvisSubmitted = async (data: {
  conciergerie_id: string;
  emetteur: string;
  note: number;
  commentaire: string;
}): Promise<boolean> => {
  return await triggerWebhook({
    type: 'avis_submitted',
    timestamp: new Date().toISOString(),
    avis: {
      ...data,
      date: new Date().toISOString()
    }
  });
};

// ============================================================================
// UTILITAIRES
// ============================================================================

// Fonction pour vérifier la configuration des webhooks
export const checkWebhookConfiguration = (): boolean => {
  const isConfigured = !!WEBHOOK_CONFIG.url;
  if (!isConfigured) {
    console.warn('⚠️ Configuration webhook manquante. Vérifiez N8N_WEBHOOK_URL');
  }
  return isConfigured;
};

// Fonction pour obtenir la configuration des webhooks
export const getWebhookConfiguration = () => ({
  ...WEBHOOK_CONFIG,
  url: WEBHOOK_CONFIG.url ? '***CONFIGURÉ***' : 'NON CONFIGURÉ'
});

