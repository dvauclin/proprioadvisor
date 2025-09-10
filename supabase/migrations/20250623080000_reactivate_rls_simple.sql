
-- Réactiver RLS sur la table avis avec des policies simplifiées
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- Policy simple pour permettre à tout le monde de lire les avis validés
CREATE POLICY "Anyone can read validated avis" 
  ON public.avis 
  FOR SELECT 
  USING (valide = true);

-- Policy pour permettre aux admins de tout voir et modifier
-- (utilisera la fonction get_user_role existante)
CREATE POLICY "Admins can manage all avis" 
  ON public.avis 
  FOR ALL 
  USING (
    auth.uid() IS NOT NULL AND 
    public.get_user_role(auth.uid()) = 'admin'
  );

-- Note: Les insertions se feront uniquement via la fonction Edge 
-- qui utilise la service_role_key et contourne RLS
