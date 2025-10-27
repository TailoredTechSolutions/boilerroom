import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate entity score based on available data
function calculateEntityScore(entity: any): number {
  let score = 0;
  
  // Data Completeness (40 points)
  const fields = [
    entity.legal_name,
    entity.registry_id,
    entity.country,
    entity.status,
    entity.incorporation_date,
    entity.company_type,
    entity.jurisdiction,
    entity.address,
    entity.website,
    entity.officers,
    entity.psc,
  ];
  const filledFields = fields.filter(f => f && (Array.isArray(f) ? f.length > 0 : true)).length;
  score += (filledFields / fields.length) * 40;
  
  // Company Status (25 points)
  const status = (entity.status || '').toLowerCase();
  if (status === 'active') score += 25;
  else if (status === 'inactive') score += 10;
  else if (status === 'dissolved') score += 0;
  else score += 5; // Unknown status
  
  // Web Presence (20 points)
  if (entity.website) score += 20;
  else if (entity.raw_payload?.api_response?.links) score += 10;
  
  // Company Age (15 points) - newer companies score higher
  if (entity.incorporation_date) {
    const incDate = new Date(entity.incorporation_date);
    const yearsOld = (Date.now() - incDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsOld < 2) score += 15;
    else if (yearsOld < 5) score += 10;
    else if (yearsOld < 10) score += 5;
  }
  
  // Ensure score is between 0 and 100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

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
  errorMessage: z.string().max(2000).optional().nullable()
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
    
    // Normalize and filter entities to satisfy DB constraints
    const allowedSources = ['COMPANIES_HOUSE', 'GLEIF', 'SEC_EDGAR', 'ASIC'];
    const normalizeSource = (src?: string) => {
      if (!src) return undefined;
      if (src === 'CH') return 'COMPANIES_HOUSE';
      if (src === 'SEC') return 'SEC_EDGAR';
      if (src === 'GLEIF') return 'GLEIF';
      if (src === 'ASIC') return 'ASIC';
      return src;
    };
    const normalizeStatus = (s?: string) => {
      if (!s) return undefined;
      const m = s.toLowerCase();
      if (m === 'active') return 'Active';
      if (m === 'inactive') return 'Inactive';
      if (m === 'dissolved') return 'Dissolved';
      if (m === 'unknown') return 'Unknown';
      // Fallback to a safe allowed value
      return 'Unknown';
    };

    const normalizedEntities = (entities || [])
      .map((entity) => {
        const src = normalizeSource((entity as any).registry_source);
        const stat = normalizeStatus((entity as any).status);
        const calculatedScore = calculateEntityScore(entity);
        return {
          ...(entity as any),
          registry_source: src,
          status: stat,
          score: calculatedScore, // Override with calculated score
        };
      })
      // Keep only supported registry sources
      .filter((e) => e.registry_source && allowedSources.includes(e.registry_source as string));

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
        records_processed: normalizedEntities?.length || 0,
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
    if (normalizedEntities && normalizedEntities.length > 0) {
      console.log(`Upserting ${normalizedEntities.length} entities...`)
      
      // Delete old non-saved entities from this source before inserting new ones
      const sourceToDelete = normalizedEntities[0].registry_source;
      if (sourceToDelete) {
        console.log(`Deleting old non-saved entities from ${sourceToDelete}...`);
        const { error: deleteError } = await supabase
          .from('entities')
          .delete()
          .eq('registry_source', sourceToDelete)
          .eq('is_saved', false);
        
        if (deleteError) {
          console.error('Error deleting old entities:', deleteError);
          // Continue anyway - don't block the upsert
        } else {
          console.log('Old non-saved entities deleted successfully');
        }
      }
      
      const { error: entitiesError } = await supabase
        .from('entities')
        .upsert(normalizedEntities, { onConflict: 'registry_id' })

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
