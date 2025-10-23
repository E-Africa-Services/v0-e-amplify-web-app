-- E-Amplify Storage Configuration
-- This file documents the storage buckets and policies needed
-- Execute these commands in Supabase SQL Editor or via CLI

-- ============================================================================
-- CREATE STORAGE BUCKETS
-- ============================================================================

-- Note: In Supabase, buckets are typically created via the UI or CLI
-- This is for reference. Use Supabase CLI:
-- supabase storage create-bucket avatars --public
-- supabase storage create-bucket cover-images --public
-- supabase storage create-bucket post-images --public
-- supabase storage create-bucket documents --public
-- supabase storage create-bucket session-recordings --public

-- ============================================================================
-- STORAGE POLICIES - AVATARS BUCKET
-- ============================================================================

-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - COVER IMAGES BUCKET
-- ============================================================================

-- Allow public read access to cover images
CREATE POLICY "Public read access to cover images" ON storage.objects
  FOR SELECT USING (bucket_id = 'cover-images');

-- Allow authenticated users to upload their own cover images
CREATE POLICY "Users can upload their own cover images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cover-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own cover images
CREATE POLICY "Users can update their own cover images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cover-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own cover images
CREATE POLICY "Users can delete their own cover images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cover-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - POST IMAGES BUCKET
-- ============================================================================

-- Allow public read access to post images
CREATE POLICY "Public read access to post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

-- Allow authenticated users to upload post images
CREATE POLICY "Users can upload post images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'post-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own post images
CREATE POLICY "Users can delete their own post images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'post-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - DOCUMENTS BUCKET
-- ============================================================================

-- Allow authenticated users to read documents they have access to
CREATE POLICY "Users can read their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to upload documents
CREATE POLICY "Users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- STORAGE POLICIES - SESSION RECORDINGS BUCKET
-- ============================================================================

-- Allow session participants to read recordings
CREATE POLICY "Session participants can read recordings" ON storage.objects
  FOR SELECT USING (bucket_id = 'session-recordings');

-- Allow authenticated users to upload session recordings
CREATE POLICY "Users can upload session recordings" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'session-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own session recordings
CREATE POLICY "Users can delete their own recordings" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'session-recordings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
