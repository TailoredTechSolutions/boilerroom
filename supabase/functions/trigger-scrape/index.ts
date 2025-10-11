import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

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
      console.log('N8N_WEBHOOK_URL not configured, inserting dummy data for testing')
      
      // Generate and insert dummy entities
      const dummyEntities = generateDummyEntities(source, 8)
      
      const { error: entitiesError } = await supabase
        .from('entities')
        .upsert(dummyEntities, { onConflict: 'registry_id' })
      
      if (entitiesError) {
        console.error('Error inserting dummy entities:', entitiesError)
      } else {
        console.log(`Inserted ${dummyEntities.length} dummy entities`)
      }
      
      // Mark job as completed with dummy stats
      await supabase
        .from('scraping_jobs')
        .update({ 
          status: 'completed',
          records_fetched: dummyEntities.length,
          records_processed: dummyEntities.length,
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
