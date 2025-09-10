
-- Rename the 'score' column to 'score_manuel'
ALTER TABLE public.conciergeries RENAME COLUMN score TO score_manuel;

-- Make the 'score_manuel' column nullable
ALTER TABLE public.conciergeries ALTER COLUMN score_manuel DROP NOT NULL;

-- Set the default value for 'score_manuel' to NULL
ALTER TABLE public.conciergeries ALTER COLUMN score_manuel SET DEFAULT NULL;
