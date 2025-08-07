-- Désactiver complètement la RLS sur la table conciergeries
ALTER TABLE public.conciergeries DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
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