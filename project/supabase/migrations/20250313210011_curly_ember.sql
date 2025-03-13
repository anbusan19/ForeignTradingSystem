/*
  # Add system-level profile creation policy

  1. Changes
    - Add INSERT policy for the trigger function to create profiles
    
  2. Security
    - Allow system-level inserts for profile creation through the trigger function
*/

-- Drop existing policy if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'System can create user profiles'
  ) THEN
    DROP POLICY "System can create user profiles" ON profiles;
  END IF;
END $$;

-- Add policy to allow the trigger function to create profiles
CREATE POLICY "System can create user profiles"
  ON profiles FOR INSERT
  TO postgres
  WITH CHECK (true);