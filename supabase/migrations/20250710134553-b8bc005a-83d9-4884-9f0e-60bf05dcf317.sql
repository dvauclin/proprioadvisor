-- Corriger les politiques RLS pour permettre l'inscription publique
-- Supprimer la politique restrictive qui empêche l'inscription
DROP POLICY IF EXISTS "Only admins can insert conciergeries" ON public.conciergeries;

-- S'assurer que la politique d'inscription publique existe
DROP POLICY IF EXISTS "Allow public inscription" ON public.conciergeries;
CREATE POLICY "Allow public inscription" 
ON public.conciergeries 
FOR INSERT 
WITH CHECK (true);