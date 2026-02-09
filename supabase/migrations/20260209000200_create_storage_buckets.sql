-- Create storage bucket for community assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-assets', 'community-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Should be enabled by default on storage.objects, removing to avoid permission issues)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all files in the bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'community-assets');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'community-assets' AND auth.role() = 'authenticated'
);

-- Allow users to update their own files (if needed, simplified for now)
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE USING (
    bucket_id = 'community-assets' AND auth.uid() = owner
);

-- Allow users to delete their own files
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE USING (
    bucket_id = 'community-assets' AND auth.uid() = owner
);
