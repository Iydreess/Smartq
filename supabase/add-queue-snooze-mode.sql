-- Queue Snooze / Step-Away Mode migration
-- Run this in Supabase SQL editor after base schema is applied.

ALTER TABLE public.queue_entries
  ADD COLUMN IF NOT EXISTS snoozed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS snooze_until TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS snooze_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS original_position INTEGER;

DO $$
BEGIN
  ALTER TABLE public.queue_entries DROP CONSTRAINT IF EXISTS queue_entries_status_check;

  ALTER TABLE public.queue_entries
    ADD CONSTRAINT queue_entries_status_check
    CHECK (status IN ('waiting', 'called', 'serving', 'completed', 'cancelled', 'no-show', 'snoozed'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_queue_entries_snooze_until ON public.queue_entries(snooze_until);
