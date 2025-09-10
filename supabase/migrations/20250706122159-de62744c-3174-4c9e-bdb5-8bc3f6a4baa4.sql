-- Ajouter les champs question_4/reponse_4 et question_5/reponse_5 à la table articles
ALTER TABLE public.articles 
ADD COLUMN question_4 TEXT,
ADD COLUMN reponse_4 TEXT,
ADD COLUMN question_5 TEXT,
ADD COLUMN reponse_5 TEXT;