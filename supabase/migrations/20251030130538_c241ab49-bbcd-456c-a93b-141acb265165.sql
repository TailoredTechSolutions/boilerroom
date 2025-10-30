-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup job to run every minute
SELECT cron.schedule(
  'cleanup-stale-scraping-jobs',
  '* * * * *', -- every minute
  $$
  SELECT
    net.http_post(
        url:='https://utzxdzkebdgwxgqhieee.supabase.co/functions/v1/cleanup-stale-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0enhkemtlYmRnd3hncWhpZWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjE3NjUsImV4cCI6MjA3NTczNzc2NX0.G8xDUNwmlFOkaqDjZDCibEzLeivUhUZkko9NsusXSOY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);