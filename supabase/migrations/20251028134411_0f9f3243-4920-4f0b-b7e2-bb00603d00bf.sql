-- Extend entities table with filter-related columns
ALTER TABLE entities 
ADD COLUMN IF NOT EXISTS officers_data JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS domain_status JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS social_media_presence JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS news_mentions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS filter_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS filter_notes TEXT[];

-- Create filter_checks audit table
CREATE TABLE IF NOT EXISTS filter_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL CHECK (check_type IN ('active_status', 'negative_press', 'domain', 'website', 'social_media', 'web_search')),
  passed BOOLEAN NOT NULL,
  details JSONB DEFAULT '{}',
  checked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_filter_checks_entity_id ON filter_checks(entity_id);
CREATE INDEX IF NOT EXISTS idx_filter_checks_check_type ON filter_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_entities_filter_status ON entities(filter_status);

-- Enable RLS
ALTER TABLE filter_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for filter_checks
CREATE POLICY "Authenticated users can view filter checks" 
ON filter_checks FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert filter checks" 
ON filter_checks FOR INSERT 
WITH CHECK (true);