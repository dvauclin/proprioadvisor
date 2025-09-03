-- Add website fields to conciergeries table
-- Migration: 20250120000001-add-website-fields.sql

-- Add site_web boolean field with default value false
ALTER TABLE public.conciergeries ADD COLUMN site_web BOOLEAN DEFAULT FALSE;

-- Add url_site_web text field (nullable)
ALTER TABLE public.conciergeries ADD COLUMN url_site_web TEXT;

-- Add comment to document the new fields
COMMENT ON COLUMN public.conciergeries.site_web IS 'Indicates if the conciergerie has a website';
COMMENT ON COLUMN public.conciergeries.url_site_web IS 'URL of the conciergerie website (optional)';
