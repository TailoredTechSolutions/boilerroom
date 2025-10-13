-- Create app_role enum for role-based access control
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table to store user permissions
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Fix scraping_jobs RLS policies
DROP POLICY IF EXISTS "Users can view all jobs" ON public.scraping_jobs;
DROP POLICY IF EXISTS "Users can create jobs" ON public.scraping_jobs;
DROP POLICY IF EXISTS "Users can update jobs" ON public.scraping_jobs;

CREATE POLICY "Users can view own jobs or admins view all" ON public.scraping_jobs
  FOR SELECT USING (
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can create own jobs" ON public.scraping_jobs
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own jobs" ON public.scraping_jobs
  FOR UPDATE USING (created_by = auth.uid());

-- Fix entities RLS policies (organization-wide with admin access)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.entities;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.entities;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.entities;

CREATE POLICY "All authenticated users can view entities" ON public.entities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert entities" ON public.entities
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update entities" ON public.entities
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Fix export_jobs RLS policies
DROP POLICY IF EXISTS "Users can view all exports" ON public.export_jobs;
DROP POLICY IF EXISTS "Users can create exports" ON public.export_jobs;

CREATE POLICY "Users can view own exports" ON public.export_jobs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own exports" ON public.export_jobs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Fix saved_views RLS policies
DROP POLICY IF EXISTS "Users can view all saved views" ON public.saved_views;
DROP POLICY IF EXISTS "Users can manage own views" ON public.saved_views;

CREATE POLICY "Users can view public or own views" ON public.saved_views
  FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own views" ON public.saved_views
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own views" ON public.saved_views
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own views" ON public.saved_views
  FOR DELETE USING (user_id = auth.uid());

-- Fix audit_log RLS policy
DROP POLICY IF EXISTS "Users can view all audit logs" ON public.audit_log;

CREATE POLICY "Admins can view audit logs" ON public.audit_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));