
-- Crée la table pour stocker les messages du formulaire de contact
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_processed BOOLEAN NOT NULL DEFAULT false
);

-- Active la sécurité au niveau des lignes (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Autorise tout le monde à envoyer un message (créer une nouvelle entrée)
CREATE POLICY "Allow public insert for contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Autorise les administrateurs à voir tous les messages
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Autorise les administrateurs à mettre à jour les messages (marquer comme lu/traité)
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Autorise les administrateurs à supprimer les messages
CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages
FOR DELETE
USING (public.is_admin(auth.uid()));
