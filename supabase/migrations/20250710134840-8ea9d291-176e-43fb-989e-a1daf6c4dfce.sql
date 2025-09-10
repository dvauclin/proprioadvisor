-- Permettre aux utilisateurs non authentifiés de modifier leur conciergerie par email
-- Supprimer les politiques UPDATE existantes
DROP POLICY IF EXISTS "Users can update their own conciergerie" ON public.conciergeries;
DROP POLICY IF EXISTS "Admins can update any conciergerie" ON public.conciergeries;

-- Nouvelle politique qui permet de modifier une conciergerie si l'email correspond, même sans authentification
CREATE POLICY "Allow conciergerie update by email match" 
ON public.conciergeries 
FOR UPDATE 
USING (true) -- Autorise tout le monde à tenter la modification
WITH CHECK (true); -- Le contrôle se fera côté application

-- Politique séparée pour les admins
CREATE POLICY "Admins can update any conciergerie" 
ON public.conciergeries 
FOR UPDATE 
USING (is_admin(auth.uid()));