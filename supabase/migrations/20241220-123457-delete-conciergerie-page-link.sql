-- Migration pour supprimer la colonne conciergerie_page_link
-- de la table subscriptions

-- Supprimer la colonne conciergerie_page_link
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS conciergerie_page_link;

-- Vérifier que la colonne a bien été supprimée
-- (optionnel, pour confirmation)
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'subscriptions'
AND column_name = 'conciergerie_page_link';
