
-- 1. Create and/or configure the 'conciergerie-logos' bucket to be public.
-- This is the key step to ensure that Supabase Storage returns permanent, public URLs
-- instead of temporary, signed URLs that expire.
-- We also add a file size limit (5MB) and allowed MIME types for security.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('conciergerie-logos', 'conciergerie-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 2. Drop existing RLS policies for the bucket to ensure a clean state.
-- This prevents conflicts if policies with the same names already exist.
DROP POLICY IF EXISTS "Public read access for conciergerie logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload conciergerie logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to conciergerie-logos" ON storage.objects;


-- 3. RLS Policy for SELECT: Allow public read access to all files in the bucket.
-- This is necessary for the public URLs to work and for anyone to view the logos.
CREATE POLICY "Public read access for conciergerie logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'conciergerie-logos' );

-- 4. RLS Policy for INSERT: Allow any authenticated user to upload files into the bucket.
-- The 'owner' of the file is automatically set to the authenticated user's ID by Supabase.
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'conciergerie-logos' );

-- 5. RLS Policy for UPDATE: Allow users to update their own logos.
-- The check `auth.uid() = owner` ensures users can only modify files they have uploaded.
CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner AND bucket_id = 'conciergerie-logos' );

-- 6. RLS Policy for DELETE: Allow users to delete their own logos.
-- The check `auth.uid() = owner` ensures users can only delete files they have uploaded.
CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner AND bucket_id = 'conciergerie-logos' );
