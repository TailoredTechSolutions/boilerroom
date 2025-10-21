-- Fix search path for the update function to prevent security issues
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Re-create the triggers
CREATE TRIGGER update_email_subscribers_updated_at
BEFORE UPDATE ON public.email_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_alerts_updated_at
BEFORE UPDATE ON public.market_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();