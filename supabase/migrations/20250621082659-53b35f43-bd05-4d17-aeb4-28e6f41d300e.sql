
-- S'assurer que RLS est activé sur la table avis
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- Vérifier et recréer les politiques pour s'assurer qu'elles sont bien appliquées
DROP POLICY IF EXISTS "Anyone can submit avis for review" ON public.avis;
DROP POLICY IF EXISTS "Anyone can view validated avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can view all avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can update avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can delete avis" ON public.avis;

-- Politique pour permettre à TOUT LE MONDE (y compris les utilisateurs anonymes) de créer des avis
CREATE POLICY "Anyone can submit avis for review" 
  ON public.avis 
  FOR INSERT 
  WITH CHECK (valide = false);

-- Politique pour permettre à tout le monde de lire les avis validés
CREATE POLICY "Anyone can view validated avis" 
  ON public.avis 
  FOR SELECT 
  USING (valide = true);

-- Politique pour permettre aux administrateurs de voir tous les avis
CREATE POLICY "Admins can view all avis" 
  ON public.avis 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Politique pour permettre aux administrateurs de modifier les avis
CREATE POLICY "Admins can update avis" 
  ON public.avis 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Politique pour permettre aux administrateurs de supprimer les avis
CREATE POLICY "Admins can delete avis" 
  ON public.avis 
  FOR DELETE 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );
