import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Dummy data generator for testing
function generateDummyEntities(source: string, count: number) {
  const companies = [
    'Acme Ventures Ltd', 'TechGrowth Capital', 'Innovation Partners LLC', 'Digital Horizons Group',
    'NextGen Investments', 'Pioneer Capital Partners', 'Velocity Ventures', 'Catalyst Growth Fund',
    'Horizon Technology Partners', 'Apex Innovation Capital', 'Momentum Ventures', 'Eclipse Capital Group',
    'Zenith Investment Partners', 'Quantum Leap Ventures', 'Frontier Growth Capital'
  ]
  
  const countries = source === 'COMPANIES_HOUSE' ? ['GB'] : source === 'GLEIF' ? ['US', 'GB', 'DE', 'FR'] : ['US']
  const statuses = ['Active', 'Active', 'Active', 'Inactive']
  
  return Array.from({ length: count }, (_, i) => {
    const company = companies[Math.floor(Math.random() * companies.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const score = Math.floor(Math.random() * 40) + 60 // 60-100
    
    return {
      legal_name: company,
      registry_id: `${source}-${Date.now()}-${i}`,
      registry_source: source,
      country,
      status,
      score,
      website: `https://www.${company.toLowerCase().replace(/\s+/g, '')}.com`,
      data_quality_score: (Math.random() * 0.3 + 0.7).toFixed(2),
      web_presence_score: (Math.random() * 0.4 + 0.6).toFixed(2),
      incorporation_date: new Date(Date.now() - Math.random() * 365 * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      company_type: 'Private Limited Company',
      sic_codes: ['62012', '62020'],
      address: {
        line1: `${Math.floor(Math.random() * 200)} Main Street`,
        city: country === 'GB' ? 'London' : country === 'US' ? 'New York' : 'Berlin',
        postcode: country === 'GB' ? 'SW1A 1AA' : '10001'
      }
    }
  })
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
    // Get user from auth header (optional for now)
    const authHeader = req.headers.get('Authorization');
    let userId = null;

    if (authHeader) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
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

    // Check if N8N webhook is configured
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL') || 'https://n8n-ffai-u38114.vm.elestio.app/webhook-test/vc-registry-scraper';
    
    if (n8nWebhookUrl) {
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
    } else {
      console.log('N8N_WEBHOOK_URL not configured, inserting dummy data for testing');
      
      const dummyEntities = generateDummyEntities(normalizedSource, 8);
      
      const { error: entitiesError } = await supabaseAdmin
        .from('entities')
        .upsert(dummyEntities, { onConflict: 'registry_id' });
      
      if (entitiesError) {
        console.error('Error inserting dummy entities:', entitiesError);
      } else {
        console.log(`Inserted ${dummyEntities.length} dummy entities`);
      }
      
      await supabaseAdmin
        .from('scraping_jobs')
        .update({ 
          status: 'completed',
          records_fetched: dummyEntities.length,
          records_processed: dummyEntities.length,
          completed_at: new Date().toISOString()
        })
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
