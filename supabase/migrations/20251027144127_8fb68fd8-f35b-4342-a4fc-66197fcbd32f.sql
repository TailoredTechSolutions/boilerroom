-- Create callback inbox table for fast ACK pattern
CREATE TABLE IF NOT EXISTS public.callback_inbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.scraping_jobs(id),
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  processing_started_at timestamp with time zone,
  processing_completed_at timestamp with time zone,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add index for faster querying
CREATE INDEX idx_callback_inbox_status ON public.callback_inbox(status);
CREATE INDEX idx_callback_inbox_job_id ON public.callback_inbox(job_id);

-- Enable RLS
ALTER TABLE public.callback_inbox ENABLE ROW LEVEL SECURITY;

-- Allow system to insert and read
CREATE POLICY "System can manage callback inbox"
  ON public.callback_inbox
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_callback_inbox_updated_at
  BEFORE UPDATE ON public.callback_inbox
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();