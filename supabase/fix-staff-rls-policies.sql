-- Fix staff RLS policies so business owners can create, update, and deactivate staff.
-- Run this in Supabase SQL Editor.

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active staff" ON public.staff;
DROP POLICY IF EXISTS "Business owners can view their staff" ON public.staff;
DROP POLICY IF EXISTS "Business owners can manage their staff" ON public.staff;

CREATE POLICY "Anyone can view active staff" ON public.staff
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Business owners can view their staff" ON public.staff
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.businesses
      WHERE businesses.id = staff.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can manage their staff" ON public.staff
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.businesses
      WHERE businesses.id = staff.business_id
        AND businesses.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.businesses
      WHERE businesses.id = staff.business_id
        AND businesses.owner_id = auth.uid()
    )
  );
