
-- Temporairement désactiver RLS sur la table contact_messages pour permettre les insertions anonymes
ALTER TABLE public.contact_messages DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies existantes qui causent des conflits
DROP POLICY IF EXISTS "Allow public insert for contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;

-- Note: RLS sera réactivé plus tard avec des policies simplifiées pour les admins seulement
-- Les insertions se feront via Edge Function avec service_role_key
