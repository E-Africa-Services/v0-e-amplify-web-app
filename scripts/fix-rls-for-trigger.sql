-- Fix RLS policy to allow trigger to create profiles
-- Run this script in Supabase SQL Editor

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new policy that allows both user insertion and service role insertion
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.jwt() IS NULL  -- Allow service role (used by triggers)
  );

-- Verify the function has the right permissions
-- The handle_new_user function should already be SECURITY DEFINER
-- but let's make sure it can bypass RLS

-- Grant necessary permissions to authenticated users
GRANT INSERT ON public.profiles TO authenticated;
GRANT INSERT ON public.credits TO authenticated;

-- Grant necessary permissions to service role
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.credits TO service_role;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS policies updated to allow trigger to create profiles';
  RAISE NOTICE '✅ Permissions granted to authenticated and service_role';
  RAISE NOTICE '🔄 Try signing up a new user or run create-missing-profiles.sql';
END $$;
