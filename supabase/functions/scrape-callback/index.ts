import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EntitySchema = z.object({
  legal_name: z.string().max(500),
  registry_id: z.string().max(200),
  registry_source: z.string().max(50),
  country: z.string().max(100), // Accept full country names from n8n
  score: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  trading_name: z.string().max(500).optional(),
  company_type: z.string().optional(),
  jurisdiction: z.string().optional(),
  incorporation_date: z.string().optional(),
  website: z.string().optional(),
}).passthrough();

const CallbackSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  entities: z.array(EntitySchema).max(1000).optional(),
  totalCount: z.number().int().min(0).optional(),
  errorMessage: z.string().max(2000).optional()
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input
    const rawBody = await req.json();
    const { jobId, status, entities, totalCount, errorMessage } = CallbackSchema.parse(rawBody);
    
    console.log('Scrape callback received:', { jobId, status, totalCount });
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update job status
    const { error: updateError } = await supabase
      .from('scraping_jobs')
      .update({
        status,
        records_fetched: totalCount || 0,
        records_processed: entities?.length || 0,
        error_message: errorMessage,
        completed_at: status === 'completed' || status === 'failed' 
          ? new Date().toISOString() 
          : null
      })
      .eq('id', jobId)

    if (updateError) {
      console.error('Error updating job:', updateError)
      throw updateError
    }

    // Insert entities if provided
    if (entities && entities.length > 0) {
      console.log(`Upserting ${entities.length} entities...`)
      
      const { error: entitiesError } = await supabase
        .from('entities')
        .upsert(entities, { onConflict: 'registry_id' })

      if (entitiesError) {
        console.error('Error upserting entities:', entitiesError)
        throw entitiesError
      }
      
      console.log('Entities upserted successfully')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in scrape-callback:', error);
    
    // Return generic error message
    const message = error instanceof z.ZodError ? 'Invalid callback data' : 'Unable to process callback';
    
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
