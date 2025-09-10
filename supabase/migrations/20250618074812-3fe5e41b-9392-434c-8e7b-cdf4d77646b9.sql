
-- Ajouter le champ points_options pour séparer les points des options du montant
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS points_options integer NOT NULL DEFAULT 0;

-- Mettre à jour les données existantes pour calculer points_options
-- en supposant que total_points - monthly_amount = points_options
UPDATE public.subscriptions 
SET points_options = GREATEST(0, total_points - monthly_amount)
WHERE points_options = 0;
