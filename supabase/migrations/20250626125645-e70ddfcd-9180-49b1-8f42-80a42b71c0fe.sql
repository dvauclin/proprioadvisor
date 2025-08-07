
-- ==========================================
-- SÉCURISATION TABLE CONTACT_MESSAGES
-- ==========================================

-- Nettoyer toutes les policies existantes sur contact_messages
DROP POLICY IF EXISTS "Allow public insert for contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can read all contact messages" ON public.contact_messages;

-- Réactiver RLS sur la table contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Permettre à TOUS (connectés et anonymes) d'insérer des messages de contact
CREATE POLICY "Public can insert contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Policy 2: Seuls les admins peuvent lire tous les messages de contact
CREATE POLICY "Admins can read all contact messages"
ON public.contact_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  public.get_user_role(auth.uid()) = 'admin'
);

-- Policy 3: Seuls les admins peuvent modifier les messages de contact
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND 
  public.get_user_role(auth.uid()) = 'admin'
);

-- Policy 4: Seuls les admins peuvent supprimer les messages de contact
CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND 
  public.get_user_role(auth.uid()) = 'admin'
);

-- ==========================================
-- SÉCURISATION TABLE AVIS
-- ==========================================

-- Nettoyer toutes les policies existantes sur la table avis
DROP POLICY IF EXISTS "Anyone can submit avis for review" ON public.avis;
DROP POLICY IF EXISTS "Anyone can view validated avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can view all avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can update avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can delete avis" ON public.avis;
DROP POLICY IF EXISTS "Public can insert avis" ON public.avis;
DROP POLICY IF EXISTS "Admins can read all avis" ON public.avis;

-- Réactiver RLS sur la table avis
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- Policy 1: Permettre à TOUS (connectés et anonymes) d'insérer des avis
CREATE POLICY "Public can insert avis"
ON public.avis
FOR INSERT
WITH CHECK (true);

-- Policy 2: Permettre à TOUS de lire uniquement les avis validés
CREATE POLICY "Public can read validated avis"
ON public.avis
FOR SELECT
USING (valide = true);

-- Policy 3: Permettre aux admins de lire TOUS les avis (validés et non validés)
CREATE POLICY "Admins can read all avis"
ON public.avis
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND 
  public.get_user_role(auth.uid()) = 'admin'
);

-- Policy 4: Seuls les admins peuvent modifier les avis
CREATE POLICY "Admins can update avis"
ON public.avis
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND 
  public.get_user_role(auth.uid()) = 'admin'
);

-- Policy 5: Seuls les admins peuvent supprimer les avis
CREATE POLICY "Admins can delete avis"
ON public.avis
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND 
  public.get_user_role(auth.uid()) = 'admin'
);

-- ==========================================
-- RÉSUMÉ DES PERMISSIONS APPLIQUÉES
-- ==========================================

-- TABLE CONTACT_MESSAGES :
-- - INSERT : Tout le monde (connecté ou anonyme)
-- - SELECT : Admins uniquement
-- - UPDATE : Admins uniquement  
-- - DELETE : Admins uniquement
--
-- TABLE AVIS :
-- - INSERT : Tout le monde (connecté ou anonyme)
-- - SELECT : Tout le monde pour les avis validés (valide = true)
--           + Admins pour tous les avis (validés et non validés)
-- - UPDATE : Admins uniquement
-- - DELETE : Admins uniquement
--
-- NOTES TECHNIQUES :
-- - Les insertions via Edge Functions avec service_role_key contournent RLS
-- - La fonction get_user_role() évite la récursion RLS
-- - WITH CHECK (true) permet l'insertion sans condition
-- - USING (valide = true) filtre les avis validés pour le public
-- - Les policies SELECT sont cumulatives (OR logic)
