-- Migration pour supprimer les colonnes basic_listing et partner_listing
-- de la table subscriptions

-- Supprimer les colonnes basic_listing et partner_listing
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS basic_listing;
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS partner_listing;

-- Vérifier que les colonnes ont bien été supprimées
-- (optionnel, pour confirmation)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
AND column_name IN ('basic_listing', 'partner_listing');
