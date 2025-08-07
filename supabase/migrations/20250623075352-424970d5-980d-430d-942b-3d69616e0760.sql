
-- Supprimer les policies actuelles qui ne fonctionnent pas pour les utilisateurs anonymes
DROP POLICY IF EXISTS "Anyone can submit unvalidated avis" ON public.avis;
DROP POLICY IF EXISTS "Anyone can read validated avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can read all avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can update avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can delete avis" ON public.avis;

-- Nouvelles policies corrigées pour les utilisateurs anonymes
-- 1. Permettre à TOUS (y compris anonymes) d'insérer des avis non validés
CREATE POLICY "Allow anonymous avis submission" 
  ON public.avis 
  FOR INSERT 
  WITH CHECK (valide = false);

-- 2. Permettre à TOUS de lire les avis validés
CREATE POLICY "Allow reading validated avis" 
  ON public.avis 
  FOR SELECT 
  USING (valide = true);

-- 3. Permettre aux admins connectés de lire TOUS les avis
CREATE POLICY "Allow admins to read all avis" 
  ON public.avis 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- 4. Permettre aux admins connectés de modifier les avis
CREATE POLICY "Allow admins to update avis" 
  ON public.avis 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- 5. Permettre aux admins connectés de supprimer les avis
CREATE POLICY "Allow admins to delete avis" 
  ON public.avis 
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );
