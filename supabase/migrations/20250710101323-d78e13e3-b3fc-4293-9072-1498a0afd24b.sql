
-- Corriger les politiques RLS pour permettre aux utilisateurs de modifier leur propre conciergerie
-- Supprimer la politique restrictive actuelle
DROP POLICY IF EXISTS "Only admins can update conciergeries" ON public.conciergeries;

-- Ajouter une politique qui permet aux utilisateurs de modifier leur propre conciergerie
CREATE POLICY "Users can update their own conciergerie" 
ON public.conciergeries 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = conciergeries.mail
))
WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.email = conciergeries.mail
));

-- Garder une politique séparée pour les admins
CREATE POLICY "Admins can update any conciergerie" 
ON public.conciergeries 
FOR UPDATE 
USING (is_admin(auth.uid()));
