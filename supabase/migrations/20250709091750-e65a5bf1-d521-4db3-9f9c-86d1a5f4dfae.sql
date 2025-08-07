-- Renommer la colonne date_publication en date_modification dans la table articles
ALTER TABLE public.articles 
RENAME COLUMN date_publication TO date_modification;