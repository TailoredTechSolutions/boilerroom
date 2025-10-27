import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TriggerScrapeSchema = z.object({
  source: z.enum(['COMPANIES_HOUSE', 'CH', 'GLEIF', 'SEC_EDGAR', 'ASIC']),
  searchTerm: z.string().max(500).optional(),
  filters: z.record(z.unknown()).optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    let userId = null;

    // Create Supabase client with the Authorization header from the request
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    // Try to get the user from the JWT
    if (authHeader) {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
      }
      userId = user?.id;
    }

    if (!userId) {
      console.warn('trigger-scrape: missing user auth');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const rawBody = await req.json();
    let { source, searchTerm, filters } = TriggerScrapeSchema.parse(rawBody);
    
    // Keep original source for external workflows, normalize for internal storage
    const originalSource = source;
    const normalizedSource = source === 'CH' ? 'COMPANIES_HOUSE' : source;
    if (!searchTerm && originalSource === 'CH') {
      // Sensible default aligning with Companies House example query
      searchTerm = 'venture capital';
    }
    
    console.log('Creating scraping job', userId ? `for user: ${userId}` : '(no auth)', { originalSource, normalizedSource, searchTerm });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create a job record with optional user tracking
    const { data: job, error: jobError } = await supabaseAdmin
      .from('scraping_jobs')
      .insert({
        source: normalizedSource,
        search_term: searchTerm,
        filters,
        status: 'pending',
        created_by: userId,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (jobError) {
      console.error('Error creating job:', jobError);
      throw jobError;
    }

    console.log('Job created:', job.id);

    // Call N8N webhook
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL') || 'https://n8n-ffai-u38114.vm.elestio.app/webhook/vc-registry-scraper';
    
    console.log('Calling n8n webhook...');
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: job.id,
        source: originalSource, // short code for n8n compatibility (e.g., 'CH')
        registrySource: normalizedSource, // normalized for clarity (e.g., 'COMPANIES_HOUSE')
        searchTerm,
        filters,
        callbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-callback`
      })
    });

    if (!response.ok) {
      console.error('N8N webhook failed:', await response.text());
      await supabaseAdmin
        .from('scraping_jobs')
        .update({ 
          status: 'failed', 
          error_message: 'N8N webhook failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);
    } else {
      console.log('N8N webhook called successfully');
      await supabaseAdmin
        .from('scraping_jobs')
        .update({ status: 'running' })
        .eq('id', job.id);
    }

    return new Response(
      JSON.stringify({ success: true, jobId: job.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in trigger-scrape:', error);
    
    let statusCode = 400;
    let message = 'Invalid request data';
    
    if (error instanceof z.ZodError) {
      message = 'Invalid request data';
    } else if (error instanceof Error && error.message.includes('auth')) {
      statusCode = 401;
      message = 'Authentication required';
    }
    
    return new Response(
      JSON.stringify({ error: message }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
