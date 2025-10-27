-- Fix function search_path security warning
DROP FUNCTION IF EXISTS canonical_name(TEXT);

CREATE OR REPLACE FUNCTION canonical_name(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(name, '[^a-z0-9]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;