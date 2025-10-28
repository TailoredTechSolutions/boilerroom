-- Migration: Extend entities table for filter tracking
-- Description: Add columns to track filtering data and status
-- Created: 2025-01-28

-- Add filter tracking fields to entities table
ALTER TABLE entities ADD COLUMN IF NOT EXISTS filter_checked_at TIMESTAMPTZ;

-- Add index for filter_status queries (improves performance for filtering operations)
CREATE INDEX IF NOT EXISTS idx_entities_filter_status ON entities(filter_status);

-- Add index for filter_checked_at (useful for finding stale data)
CREATE INDEX IF NOT EXISTS idx_entities_filter_checked_at ON entities(filter_checked_at);

-- Add constraint to ensure filter_status only contains valid values
ALTER TABLE entities DROP CONSTRAINT IF EXISTS entities_filter_status_check;
ALTER TABLE entities ADD CONSTRAINT entities_filter_status_check
  CHECK (filter_status IN ('pending', 'qualified', 'rejected', 'error'));

-- Add comment documentation
COMMENT ON COLUMN entities.filter_checked_at IS 'Timestamp of last filter check';

-- Update filter_checks table with additional check types and policies
ALTER TABLE filter_checks ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add constraint to ensure check_type contains valid values
ALTER TABLE filter_checks DROP CONSTRAINT IF EXISTS filter_checks_type_check;
ALTER TABLE filter_checks ADD CONSTRAINT filter_checks_type_check
  CHECK (check_type IN (
    'active_status',
    'domain_availability',
    'negative_press',
    'online_presence',
    'linkedin_profile',
    'twitter_profile',
    'facebook_profile',
    'website_active',
    'dns_lookup',
    'web_search'
  ));

-- Additional indexes for filter_checks
CREATE INDEX IF NOT EXISTS idx_filter_checks_type ON filter_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_filter_checks_passed ON filter_checks(passed);
CREATE INDEX IF NOT EXISTS idx_filter_checks_checked_at ON filter_checks(checked_at);

-- Composite index for entity + check type queries (most recent check per type)
CREATE INDEX IF NOT EXISTS idx_filter_checks_entity_type_time
  ON filter_checks(entity_id, check_type, checked_at DESC);

-- Add RLS policies for filter_checks
CREATE POLICY "System can update filter checks"
  ON filter_checks FOR UPDATE
  USING (true);

CREATE POLICY "System can delete old filter checks"
  ON filter_checks FOR DELETE
  USING (checked_at < now() - interval '90 days');

-- Add comments
COMMENT ON COLUMN filter_checks.error_message IS 'Error message if check failed to execute';

-- Create function to get latest check per type for an entity
CREATE OR REPLACE FUNCTION get_latest_filter_checks(p_entity_id UUID)
RETURNS TABLE (
  check_type TEXT,
  passed BOOLEAN,
  details JSONB,
  checked_at TIMESTAMPTZ
) AS $$
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
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_latest_filter_checks IS 'Returns the most recent check result for each check type';