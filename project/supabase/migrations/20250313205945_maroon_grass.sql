/*
  # Update profile policies

  1. Changes
    - Add INSERT policy for the trigger function
    - Modify existing policies for better security
    
  2. Security
    - Allow system-level inserts for profile creation
    - Maintain user-level access control for other operations
*/

-- Add policy to allow the trigger function to create profiles
CREATE POLICY "System can create user profiles"
  ON profiles FOR INSERT
  TO postgres
  WITH CHECK (true);

-- Ensure existing policies are correctly set
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);