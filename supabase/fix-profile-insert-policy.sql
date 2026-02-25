-- Fix: Add missing INSERT policy for profiles table
-- This allows users to create their own profile on first login

-- Add INSERT policy for profiles
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Note: This policy allows authenticated users to create a profile
-- only for their own user ID (auth.uid() = id)
