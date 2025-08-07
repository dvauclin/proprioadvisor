
-- Ajouter les nouveaux champs à la table articles
ALTER TABLE public.articles 
ADD COLUMN resume text,
ADD COLUMN question_1 text,
ADD COLUMN reponse_1 text,
ADD COLUMN question_2 text,
ADD COLUMN reponse_2 text,
ADD COLUMN question_3 text,
ADD COLUMN reponse_3 text;
