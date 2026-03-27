-- Fix RLS policies for queues and queue_entries so business owners can create and manage queues.
-- Run this in Supabase SQL Editor.

ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_entries ENABLE ROW LEVEL SECURITY;

-- queues policies
DROP POLICY IF EXISTS "Anyone can view active queues" ON public.queues;
DROP POLICY IF EXISTS "Business owners can view their queues" ON public.queues;
DROP POLICY IF EXISTS "Business owners can manage their queues" ON public.queues;

CREATE POLICY "Anyone can view active queues" ON public.queues
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Business owners can view their queues" ON public.queues
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.businesses
      WHERE businesses.id = queues.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

CREATE POLICY "Business owners can manage their queues" ON public.queues
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.businesses
      WHERE businesses.id = queues.business_id
        AND businesses.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.businesses
      WHERE businesses.id = queues.business_id
        AND businesses.owner_id = auth.uid()
    )
  );

-- queue_entries management policies for business owners
DROP POLICY IF EXISTS "Business owners can manage their queue entries" ON public.queue_entries;

CREATE POLICY "Business owners can manage their queue entries" ON public.queue_entries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.queues
      JOIN public.businesses ON businesses.id = queues.business_id
      WHERE queues.id = queue_entries.queue_id
        AND businesses.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.queues
      JOIN public.businesses ON businesses.id = queues.business_id
      WHERE queues.id = queue_entries.queue_id
        AND businesses.owner_id = auth.uid()
    )
  );
