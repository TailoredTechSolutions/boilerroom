-- Fix nullable user reference columns for user-owned data
-- This prevents orphaned records and ensures proper RLS enforcement

-- Set default values for user-owned tables
ALTER TABLE export_jobs 
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE saved_views 
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Make user_id NOT NULL for user-owned tables (export_jobs and saved_views)
-- Note: This will fail if there are existing NULL values. 
-- If needed, clean up first with: UPDATE export_jobs SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;

ALTER TABLE export_jobs 
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE saved_views 
  ALTER COLUMN user_id SET NOT NULL;

-- Keep scraping_jobs.created_by and audit_log.user_id as nullable for system operations
-- These tables intentionally allow NULL to represent system-initiated actions
-- Document this behavior in comments

COMMENT ON COLUMN scraping_jobs.created_by IS 'User who created the job. NULL indicates system-initiated scraping job visible only to admins.';
COMMENT ON COLUMN audit_log.user_id IS 'User who performed the action. NULL indicates system-initiated action.';