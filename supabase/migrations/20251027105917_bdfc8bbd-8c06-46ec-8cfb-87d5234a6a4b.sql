-- Add status and action tracking columns to entities table
ALTER TABLE entities
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS flagged_by TEXT,
ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS dismissed_by TEXT,
ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS exported_at TIMESTAMPTZ;

-- Create index on status for efficient filtering
CREATE INDEX IF NOT EXISTS idx_entities_status ON entities(status);

-- Create suppression list table
CREATE TABLE IF NOT EXISTS suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name TEXT NOT NULL UNIQUE,
  reason TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppression_canonical ON suppression_list(canonical_name);

-- Create company actions audit table
CREATE TABLE IF NOT EXISTS company_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  actor TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_company_actions_entity ON company_actions(entity_id);
CREATE INDEX IF NOT EXISTS idx_company_actions_type ON company_actions(action_type);

-- Enable RLS
ALTER TABLE suppression_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_actions ENABLE ROW LEVEL SECURITY;

-- RLS policies for suppression_list
CREATE POLICY "Authenticated users can view suppression list"
ON suppression_list FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can add to suppression list"
ON suppression_list FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can remove from suppression list"
ON suppression_list FOR DELETE
USING (auth.uid() IS NOT NULL);

-- RLS policies for company_actions
CREATE POLICY "Authenticated users can view company actions"
ON company_actions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert company actions"
ON company_actions FOR INSERT
WITH CHECK (true);

-- Function to normalize company names for suppression matching
CREATE OR REPLACE FUNCTION canonical_name(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(name, '[^a-z0-9]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;