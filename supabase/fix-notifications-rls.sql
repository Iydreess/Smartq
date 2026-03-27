-- Allow business owners to create notifications for customers tied to their appointments.
-- Run this in Supabase SQL Editor.

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business owners can notify their appointment customers" ON public.notifications;

CREATE POLICY "Business owners can notify their appointment customers" ON public.notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.appointments
      JOIN public.businesses ON businesses.id = appointments.business_id
      WHERE appointments.customer_id = notifications.user_id
        AND businesses.owner_id = auth.uid()
    )
  );
