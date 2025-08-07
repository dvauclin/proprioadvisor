-- Permettre aux conciergeries de mettre à jour le champ date_vue de leurs propres leads
CREATE POLICY "Conciergeries can mark their own leads as viewed" 
ON public.leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM formules f
    JOIN conciergeries c ON f.conciergerie_id = c.id
    WHERE f.id = leads.formule_id 
    AND c.mail = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM formules f
    JOIN conciergeries c ON f.conciergerie_id = c.id
    WHERE f.id = leads.formule_id 
    AND c.mail = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);