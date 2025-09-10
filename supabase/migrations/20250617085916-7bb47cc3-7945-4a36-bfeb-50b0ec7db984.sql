
-- Ajouter les champs pending pour gérer les changements d'abonnement en attente
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS pending_monthly_amount integer,
ADD COLUMN IF NOT EXISTS pending_stripe_session_id text;

-- Créer un index sur pending_stripe_session_id pour optimiser les recherches du webhook
CREATE INDEX IF NOT EXISTS idx_subscriptions_pending_stripe_session_id 
ON public.subscriptions(pending_stripe_session_id) 
WHERE pending_stripe_session_id IS NOT NULL;
