-- Ajouter la colonne date_vue à la table leads pour traquer quand un lead a été marqué comme vu
ALTER TABLE public.leads 
ADD COLUMN date_vue timestamp with time zone NULL;