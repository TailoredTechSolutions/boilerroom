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
    const { source, searchTerm, filters } = await req.json()
    
    console.log('Trigger scrape request:', { source, searchTerm, filters })
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        source,
        search_term: searchTerm,
        filters,
        status: 'pending',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (jobError) {
      console.error('Error creating job:', jobError)
      throw jobError
    }

    console.log('Job created:', job.id)

    // Check if N8N webhook is configured
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL')
    
    if (n8nWebhookUrl) {
      console.log('Calling n8n webhook...')
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          source,
          searchTerm,
          filters,
          callbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/scrape-callback`
        })
      })

      if (!response.ok) {
        console.error('N8N webhook failed:', await response.text())
        // Update job status to failed
        await supabase
          .from('scraping_jobs')
          .update({ 
            status: 'failed', 
            error_message: 'N8N webhook failed',
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id)
      } else {
        console.log('N8N webhook called successfully')
        // Update job status to running
        await supabase
          .from('scraping_jobs')
          .update({ status: 'running' })
          .eq('id', job.id)
      }
    } else {
      console.log('N8N_WEBHOOK_URL not configured, marking job as completed')
      // If no webhook configured, mark as completed
      await supabase
        .from('scraping_jobs')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id)
    }

    return new Response(
      JSON.stringify({ success: true, jobId: job.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in trigger-scrape:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
