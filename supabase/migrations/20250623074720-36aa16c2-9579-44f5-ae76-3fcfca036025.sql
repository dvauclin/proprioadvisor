
-- Voir toutes les policies existantes sur la table avis
SELECT policyname FROM pg_policies WHERE tablename = 'avis';

-- Supprimer TOUTES les policies existantes (même celles avec des noms différents)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'avis' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.avis', policy_record.policyname);
    END LOOP;
END $$;

-- Maintenant créer les nouvelles policies proprement
-- 1. Politique pour permettre à TOUT LE MONDE (anonyme ou connecté) d'insérer des avis non validés
CREATE POLICY "Anyone can submit unvalidated avis" 
  ON public.avis 
  FOR INSERT 
  WITH CHECK (valide = false);

-- 2. Politique pour permettre à tout le monde de lire les avis validés uniquement
CREATE POLICY "Anyone can read validated avis" 
  ON public.avis 
  FOR SELECT 
  USING (valide = true);

-- 3. Politique pour permettre aux admins de lire TOUS les avis
CREATE POLICY "Admins can read all avis" 
  ON public.avis 
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- 4. Politique pour permettre aux admins de modifier les avis
CREATE POLICY "Admins can update avis" 
  ON public.avis 
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'admin');

-- 5. Politique pour permettre aux admins de supprimer les avis
CREATE POLICY "Admins can delete avis" 
  ON public.avis 
  FOR DELETE 
  USING (public.get_user_role(auth.uid()) = 'admin');
