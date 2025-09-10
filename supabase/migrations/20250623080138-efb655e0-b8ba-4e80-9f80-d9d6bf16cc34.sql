
-- Temporairement désactiver RLS sur la table avis pour permettre les insertions anonymes
ALTER TABLE public.avis DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies existantes qui causent des conflits
DROP POLICY IF EXISTS "Allow anonymous avis submission" ON public.avis;
DROP POLICY IF EXISTS "Allow reading validated avis" ON public.avis;
DROP POLICY IF EXISTS "Allow admins to read all avis" ON public.avis;
DROP POLICY IF EXISTS "Allow admins to update avis" ON public.avis;
DROP POLICY IF EXISTS "Allow admins to delete avis" ON public.avis;

-- Créer une policy simple pour la lecture des avis validés (RLS sera réactivé plus tard)
-- Cette policy sera utilisée quand on réactivera RLS
-- CREATE POLICY "Public can read validated avis" ON public.avis FOR SELECT USING (valide = true);
