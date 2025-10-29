-- Script to create profiles for existing auth users who don't have profiles yet
-- This fixes the issue where users signed up before the trigger was in place

-- Insert profiles for auth users that don't have profiles yet
INSERT INTO public.profiles (user_id, name, email)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.email
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL;

-- Insert credits for users that don't have credits yet
INSERT INTO public.credits (user_id, balance)
SELECT 
  au.id,
  100
FROM auth.users au
LEFT JOIN public.credits c ON c.user_id = au.id
WHERE c.id IS NULL;

-- Show the results
SELECT 
  p.name,
  p.email,
  c.balance as credits,
  p.created_at
FROM profiles p
JOIN credits c ON c.user_id = p.user_id
ORDER BY p.created_at DESC;
