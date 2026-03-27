-- Create a global app settings table for admin settings persistence.
-- Run this in Supabase SQL Editor.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view app settings" ON public.app_settings;
DROP POLICY IF EXISTS "Admins can manage app settings" ON public.app_settings;

CREATE POLICY "Admins can view app settings" ON public.app_settings
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage app settings" ON public.app_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

INSERT INTO public.app_settings (key, settings)
VALUES (
  'global',
  jsonb_build_object(
    'siteName', 'SmartQ',
    'siteDescription', 'Intelligent Queue Management System',
    'supportEmail', 'support@smartq.com',
    'maintenanceMode', false,
    'allowRegistration', true,
    'requireEmailVerification', true,
    'maxBusinessesPerUser', 5,
    'maxQueuesPerBusiness', 20,
    'sessionTimeout', 30,
    'emailNotifications', true,
    'smsNotifications', false,
    'pushNotifications', true
  )
)
ON CONFLICT (key) DO NOTHING;
