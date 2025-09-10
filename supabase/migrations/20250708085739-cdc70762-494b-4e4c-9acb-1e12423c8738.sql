-- Supprimer la policy qui permet l'accès en lecture à tous les utilisateurs
DROP POLICY IF EXISTS "Enable read access for all users" ON public.leads;

-- Supprimer les autres policies conflictuelles qui ne sont pas nécessaires
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.leads;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.leads;

-- S'assurer que seules les bonnes policies restent :
-- 1. Public peut créer des leads (pour les formulaires de devis)
-- 2. Les conciergeries ne voient que leurs propres leads
-- 3. Les admins peuvent tout voir/modifier/supprimer

-- La policy pour créer des leads existe déjà : "Allow public to create leads" et "Anyone can insert leads"
-- La policy pour les conciergeries existe déjà : "Conciergeries can only view their own leads"
-- Les policies pour les admins existent déjà : "Only admins can delete leads", "Only admins can update leads", "Only admins can view leads"