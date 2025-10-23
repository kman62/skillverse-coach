
-- Create or ensure the videos bucket exists (PRIVATE for security)
INSERT INTO storage.buckets (id, name, public, owner)
VALUES ('videos', 'videos', false, null)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow authenticated users to upload videos
BEGIN;
  -- First check if the policy exists to avoid errors
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Allow authenticated users to upload videos'
    ) THEN
      CREATE POLICY "Allow authenticated users to upload videos"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
  END $$;
COMMIT;

-- Create a policy to allow authenticated users to select their own videos
BEGIN;
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Allow users to select their own videos'
    ) THEN
      CREATE POLICY "Allow users to select their own videos"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
  END $$;
COMMIT;

-- No public access policy - videos are private
