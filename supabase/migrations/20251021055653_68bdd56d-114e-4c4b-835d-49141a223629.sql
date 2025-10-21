-- Create email_subscribers table for collecting customer information
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  alert_preferences JSONB DEFAULT '{"ipo_alerts": true, "market_news": true, "weekly_digest": true}'::jsonb,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_alert_sent TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all subscribers
CREATE POLICY "Admins can view all subscribers"
ON public.email_subscribers
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update subscribers
CREATE POLICY "Admins can update subscribers"
ON public.email_subscribers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Public can insert (for signup form)
CREATE POLICY "Anyone can subscribe"
ON public.email_subscribers
FOR INSERT
WITH CHECK (true);

-- Create market_alerts table for storing alert content
CREATE TABLE public.market_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('ipo', 'market_news', 'pre_ipo', 'earnings')),
  company_name TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  alert_data JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_to_subscribers BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published alerts
CREATE POLICY "Anyone can view alerts"
ON public.market_alerts
FOR SELECT
USING (true);

-- Policy: Admins can manage alerts
CREATE POLICY "Admins can insert alerts"
ON public.market_alerts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update alerts"
ON public.market_alerts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_email_subscribers_updated_at
BEFORE UPDATE ON public.email_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_alerts_updated_at
BEFORE UPDATE ON public.market_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();