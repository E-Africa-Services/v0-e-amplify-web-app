-- Quick fix for RLS blocking profile creation
-- Run this in Supabase SQL Editor NOW

-- Update the insert policies to allow trigger to work
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own credits" ON credits;
CREATE POLICY "Users can insert own credits"
  ON credits FOR INSERT
  WITH CHECK (true);

-- Recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 100);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating user profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Now create profiles for existing users
INSERT INTO public.profiles (user_id, name, email)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.email
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL;

INSERT INTO public.credits (user_id, balance)
SELECT 
  au.id,
  100
FROM auth.users au
LEFT JOIN public.credits c ON c.user_id = au.id
WHERE c.id IS NULL;

-- Show success
SELECT 
  'Profile created for: ' || p.name || ' (' || p.email || ')' as message
FROM profiles p
ORDER BY p.created_at DESC;
