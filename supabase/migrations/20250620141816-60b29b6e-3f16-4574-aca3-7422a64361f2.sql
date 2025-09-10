
-- Supprimer les politiques existantes et les recréer
DROP POLICY IF EXISTS "Admins can update avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can view all avis" ON public.avis;
DROP POLICY IF EXISTS "Anyone can view validated avis" ON public.avis;
DROP POLICY IF EXISTS "Anyone can submit avis for review" ON public.avis;
DROP POLICY IF EXISTS "Admins can delete avis" ON public.avis;

-- Activer RLS sur la table avis (si pas déjà fait)
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tout le monde de créer des avis
-- (les avis soumis par l'application ne sont pas validés par défaut)
CREATE POLICY "Anyone can submit avis for review" 
  ON public.avis 
  FOR INSERT 
  WITH CHECK (valide = false);

-- Politique pour permettre de lire les avis validés
CREATE POLICY "Anyone can view validated avis" 
  ON public.avis 
  FOR SELECT 
  USING (valide = true);

-- Politique pour permettre aux administrateurs de voir tous les avis
CREATE POLICY "Admins can view all avis" 
  ON public.avis 
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Politique pour permettre aux administrateurs de modifier les avis (validation/invalidation)
CREATE POLICY "Admins can update avis" 
  ON public.avis 
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- Politique pour permettre aux administrateurs de supprimer les avis
CREATE POLICY "Admins can delete avis" 
  ON public.avis 
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) = 'admin');
