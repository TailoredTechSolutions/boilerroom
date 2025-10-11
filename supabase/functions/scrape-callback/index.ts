import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, status, entities, totalCount, errorMessage } = await req.json()
    
    console.log('Scrape callback received:', { jobId, status, totalCount })
    
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
    console.error('Error in scrape-callback:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
