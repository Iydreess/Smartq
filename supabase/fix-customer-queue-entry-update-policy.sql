-- Allow customers to update only their own queue entries.
-- Required for Step Away / I'm Back flows on customer queue page.

ALTER TABLE public.queue_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can update their own queue entries" ON public.queue_entries;

CREATE POLICY "Customers can update their own queue entries" ON public.queue_entries
  FOR UPDATE
  USING (auth.uid() = customer_id)
  WITH CHECK (
    auth.uid() = customer_id
    AND status IN ('waiting', 'called', 'snoozed', 'cancelled', 'no-show')
  );
