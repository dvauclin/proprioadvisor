-- Supprimer l'ancienne politique qui cause l'erreur
DROP POLICY IF EXISTS "Conciergeries can mark their own leads as viewed" ON public.leads;

-- Créer une nouvelle politique qui utilise la table profiles
CREATE POLICY "Conciergeries can mark their own leads as viewed" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM formules f
    JOIN conciergeries c ON f.conciergerie_id = c.id
    JOIN profiles p ON p.email = c.mail
    WHERE f.id = leads.formule_id 
    AND p.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM formules f
    JOIN conciergeries c ON f.conciergerie_id = c.id
    JOIN profiles p ON p.email = c.mail
    WHERE f.id = leads.formule_id 
    AND p.id = auth.uid()
  )
);