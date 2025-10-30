-- Fix audit_log INSERT policy
CREATE POLICY "Authenticated users can insert audit logs"
ON audit_log FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ensure audit logs are immutable (prevent updates/deletes)
CREATE POLICY "Audit logs cannot be updated"
ON audit_log FOR UPDATE
USING (false);

CREATE POLICY "Audit logs cannot be deleted"
ON audit_log FOR DELETE
USING (false);

-- Fix function search paths for security
-- Update canonical_name function to set search_path
CREATE OR REPLACE FUNCTION public.canonical_name(name text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public'
AS $$
BEGIN
  RETURN lower(regexp_replace(name, '[^a-z0-9]', '', 'g'));
END;
$$;

-- Update update_updated_at_column to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update auto_assign_first_admin to set search_path
CREATE OR REPLACE FUNCTION public.auto_assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Update handle_new_user to set search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  );
  RETURN new;
END;
$$;

-- Update has_premium_access to set search_path  
CREATE OR REPLACE FUNCTION public.has_premium_access(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND subscription_tier IN ('premium_monthly', 'premium_annual')
      AND subscription_status = 'active'
  )
$$;

-- Update get_latest_filter_checks to set search_path
CREATE OR REPLACE FUNCTION public.get_latest_filter_checks(p_entity_id uuid)
RETURNS TABLE(check_type text, passed boolean, details jsonb, checked_at timestamp with time zone)
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (fc.check_type)
    fc.check_type,
    fc.passed,
    fc.details,
    fc.checked_at
  FROM filter_checks fc
  WHERE fc.entity_id = p_entity_id
  ORDER BY fc.check_type, fc.checked_at DESC;
END;
$$;