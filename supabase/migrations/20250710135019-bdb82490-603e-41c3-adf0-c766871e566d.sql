-- Supprimer TOUTES les politiques sur conciergeries et recommencer proprement
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'conciergeries' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.conciergeries', policy_record.policyname);
    END LOOP;
END $$;

-- Recréer les politiques de base pour un fonctionnement simple
-- 1. INSERT: Tout le monde peut créer une conciergerie
CREATE POLICY "Public can insert conciergeries" 
ON public.conciergeries 
FOR INSERT 
WITH CHECK (true);

-- 2. SELECT: Tout le monde peut voir les conciergeries validées, admins voient tout
CREATE POLICY "Public can read validated conciergeries" 
ON public.conciergeries 
FOR SELECT 
USING (validated = true OR is_admin(auth.uid()));

-- 3. UPDATE: Tout le monde peut modifier (on contrôlera côté app)
CREATE POLICY "Public can update conciergeries" 
ON public.conciergeries 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 4. DELETE: Seuls les admins peuvent supprimer
CREATE POLICY "Only admins can delete conciergeries" 
ON public.conciergeries 
FOR DELETE 
USING (is_admin(auth.uid()));