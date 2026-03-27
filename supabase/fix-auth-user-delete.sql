-- Force delete a user from Supabase Auth plus related app data.
-- Use this when dashboard delete fails with: "Database error deleting user".
-- Run in Supabase SQL Editor as project owner.

-- 1) Optional helper: inspect all foreign keys that reference profiles.id
SELECT
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
  AND rc.constraint_schema = tc.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.constraint_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND ccu.table_schema = 'public'
  AND ccu.table_name = 'profiles'
  AND ccu.column_name = 'id'
ORDER BY tc.table_schema, tc.table_name;

-- 2) Create a function for hard deletion by user id.
CREATE OR REPLACE FUNCTION public.admin_force_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- App-level references
  DELETE FROM public.queue_entries WHERE customer_id = target_user_id;
  DELETE FROM public.appointments WHERE customer_id = target_user_id;
  DELETE FROM public.notifications WHERE user_id = target_user_id;
  DELETE FROM public.staff WHERE profile_id = target_user_id;

  -- If this user owns businesses, cascade should remove dependent queues/services data.
  DELETE FROM public.businesses WHERE owner_id = target_user_id;

  -- Nullable references
  UPDATE public.app_settings SET updated_by = NULL WHERE updated_by = target_user_id;

  -- Profile row
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- Auth-related references
  IF to_regclass('auth.identities') IS NOT NULL THEN
    DELETE FROM auth.identities WHERE user_id = target_user_id;
  END IF;

  IF to_regclass('auth.sessions') IS NOT NULL THEN
    DELETE FROM auth.sessions WHERE user_id = target_user_id;
  END IF;

  IF to_regclass('auth.refresh_tokens') IS NOT NULL THEN
    DELETE FROM auth.refresh_tokens WHERE user_id = target_user_id;
  END IF;

  IF to_regclass('auth.mfa_factors') IS NOT NULL THEN
    IF to_regclass('auth.mfa_challenges') IS NOT NULL THEN
      DELETE FROM auth.mfa_challenges
      WHERE factor_id IN (
        SELECT id FROM auth.mfa_factors WHERE user_id = target_user_id
      );
    END IF;

    DELETE FROM auth.mfa_factors WHERE user_id = target_user_id;
  END IF;

  IF to_regclass('auth.one_time_tokens') IS NOT NULL THEN
    DELETE FROM auth.one_time_tokens WHERE user_id = target_user_id;
  END IF;

  -- Auth user row (final)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- 3) Convenience wrapper by email.
CREATE OR REPLACE FUNCTION public.admin_force_delete_user_by_email(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE lower(email) = lower(target_email)
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No auth user found for email: %', target_email;
    RETURN;
  END IF;

  PERFORM public.admin_force_delete_user(v_user_id);
END;
$$;

-- 4) Allow authenticated admins to execute if needed from app-side RPC in future.
GRANT EXECUTE ON FUNCTION public.admin_force_delete_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_force_delete_user_by_email(text) TO authenticated;

-- =============================
-- USAGE EXAMPLES
-- =============================
-- By email:
-- SELECT public.admin_force_delete_user_by_email('globalwork300@gmail.com');
--
-- By user id:
-- SELECT public.admin_force_delete_user('00000000-0000-0000-0000-000000000000');
