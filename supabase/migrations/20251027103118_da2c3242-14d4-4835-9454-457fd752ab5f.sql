-- Create filtering_audit table to track all filtering decisions
CREATE TABLE public.filtering_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  scraping_job_id UUID REFERENCES public.scraping_jobs(id),
  filter_type TEXT NOT NULL CHECK (filter_type IN ('negative_press', 'no_website', 'inactive', 'domain_unavailable', 'passed')),
  blocked BOOLEAN NOT NULL,
  sentiment_score NUMERIC,
  articles_found INTEGER,
  top_article_title TEXT,
  top_article_url TEXT,
  decision_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.filtering_audit ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view filtering audit"
  ON public.filtering_audit
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert filtering audit"
  ON public.filtering_audit
  FOR INSERT
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_filtering_audit_created_at ON public.filtering_audit(created_at DESC);
CREATE INDEX idx_filtering_audit_company_name ON public.filtering_audit(company_name);
CREATE INDEX idx_filtering_audit_job_id ON public.filtering_audit(scraping_job_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.filtering_audit;