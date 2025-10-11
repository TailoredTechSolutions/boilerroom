-- Create entities table
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  registry_id TEXT UNIQUE NOT NULL,
  registry_source TEXT NOT NULL CHECK (registry_source IN ('COMPANIES_HOUSE', 'GLEIF', 'SEC_EDGAR', 'ASIC')),
  country TEXT NOT NULL,
  jurisdiction TEXT,
  status TEXT CHECK (status IN ('Active', 'Inactive', 'Dissolved', 'Unknown')),
  incorporation_date DATE,
  website TEXT,
  email_contacts JSONB DEFAULT '[]'::jsonb,
  officers JSONB DEFAULT '[]'::jsonb,
  filings JSONB DEFAULT '[]'::jsonb,
  psc JSONB DEFAULT '[]'::jsonb,
  address JSONB,
  sic_codes TEXT[],
  company_type TEXT,
  score NUMERIC(5,2) DEFAULT 0,
  data_quality_score NUMERIC(3,2) DEFAULT 0,
  negative_press_flag BOOLEAN DEFAULT false,
  web_presence_score NUMERIC(3,2),
  domain_available BOOLEAN,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  merged_from JSONB DEFAULT '[]'::jsonb,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_entities_registry_source ON entities(registry_source);
CREATE INDEX idx_entities_status ON entities(status);
CREATE INDEX idx_entities_score ON entities(score DESC);
CREATE INDEX idx_entities_country ON entities(country);
CREATE INDEX idx_entities_created_at ON entities(created_at DESC);
CREATE INDEX idx_entities_legal_name ON entities USING gin(to_tsvector('english', legal_name));

-- RLS Policies for entities
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON entities
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON entities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON entities
  FOR UPDATE USING (true);

-- Create scraping_jobs table
CREATE TABLE scraping_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  search_term TEXT,
  filters JSONB,
  records_fetched INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON scraping_jobs(status);
CREATE INDEX idx_jobs_created_at ON scraping_jobs(created_at DESC);

ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all jobs" ON scraping_jobs
  FOR SELECT USING (true);

CREATE POLICY "Users can create jobs" ON scraping_jobs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update jobs" ON scraping_jobs
  FOR UPDATE USING (true);

-- Create export_jobs table
CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  filter_json JSONB,
  columns TEXT[],
  format TEXT CHECK (format IN ('CSV', 'XLSX', 'JSON')) DEFAULT 'CSV',
  status TEXT CHECK (status IN ('queued', 'processing', 'completed', 'failed')) DEFAULT 'queued',
  row_count INTEGER,
  download_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_export_jobs_user ON export_jobs(user_id);
CREATE INDEX idx_export_jobs_status ON export_jobs(status);

ALTER TABLE export_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all exports" ON export_jobs
  FOR SELECT USING (true);

CREATE POLICY "Users can create exports" ON export_jobs
  FOR INSERT WITH CHECK (true);

-- Create saved_views table
CREATE TABLE saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  columns TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_saved_views_user ON saved_views(user_id);

ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all saved views" ON saved_views
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own views" ON saved_views
  FOR ALL USING (true);

-- Create audit_log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all audit logs" ON audit_log
  FOR SELECT USING (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE entities;
ALTER PUBLICATION supabase_realtime ADD TABLE scraping_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE export_jobs;