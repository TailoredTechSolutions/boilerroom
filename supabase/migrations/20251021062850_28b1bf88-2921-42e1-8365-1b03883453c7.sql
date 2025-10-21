-- Add survey fields to email_subscribers table
ALTER TABLE public.email_subscribers
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS timeframe TEXT,
ADD COLUMN IF NOT EXISTS portfolio_size TEXT,
ADD COLUMN IF NOT EXISTS annual_income TEXT,
ADD COLUMN IF NOT EXISTS capital_available TEXT,
ADD COLUMN IF NOT EXISTS has_advisor BOOLEAN,
ADD COLUMN IF NOT EXISTS alternative_investments TEXT,
ADD COLUMN IF NOT EXISTS liquidity_comfort TEXT,
ADD COLUMN IF NOT EXISTS interested_sectors TEXT[],
ADD COLUMN IF NOT EXISTS curated_deals BOOLEAN,
ADD COLUMN IF NOT EXISTS kyc_ready TEXT,
ADD COLUMN IF NOT EXISTS decision_maker BOOLEAN,
ADD COLUMN IF NOT EXISTS best_time_to_reach TEXT,
ADD COLUMN IF NOT EXISTS survey_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS survey_completed_at TIMESTAMP WITH TIME ZONE;

-- Add index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_phone ON public.email_subscribers(phone);