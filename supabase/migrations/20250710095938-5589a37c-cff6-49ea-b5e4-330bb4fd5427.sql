-- Add created_at column to villes table
ALTER TABLE public.villes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE;

-- Set default value for future inserts
ALTER TABLE public.villes ALTER COLUMN created_at SET DEFAULT now();

-- Update existing villes with March 20, 2024 date
UPDATE public.villes 
SET created_at = '2024-03-20 00:00:00+00'::timestamp with time zone
WHERE created_at IS NULL;