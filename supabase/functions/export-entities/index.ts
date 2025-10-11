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
    const { filters, columns, format } = await req.json()
    
    console.log('Export entities request:', { filters, columns, format })
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Build query based on filters
    let query = supabase.from('entities').select(columns.join(','))
    
    if (filters?.source && filters.source.length > 0) {
      query = query.in('registry_source', filters.source)
    }
    if (filters?.status && filters.status.length > 0) {
      query = query.in('status', filters.status)
    }
    if (filters?.country && filters.country !== 'all') {
      query = query.eq('country', filters.country)
    }
    if (filters?.minScore !== undefined) {
      query = query.gte('score', filters.minScore)
    }
    if (filters?.maxScore !== undefined) {
      query = query.lte('score', filters.maxScore)
    }
    
    const { data: entities, error } = await query.order('score', { ascending: false })
    
    if (error) {
      console.error('Error fetching entities:', error)
      throw error
    }

    console.log(`Exporting ${entities.length} entities as ${format}`)

    // Convert to CSV (basic implementation)
    if (format === 'CSV') {
      const csv = [
        columns.join(','),
        ...entities.map((e: any) => 
          columns.map((c: string) => {
            const value = e[c]
            // Handle different data types
            if (value === null || value === undefined) return ''
            if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""')
            if (typeof value === 'string' && value.includes(',')) return `"${value}"`
            return value
          }).join(',')
        )
      ].join('\n')

      return new Response(csv, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename=entities_export_${new Date().toISOString().split('T')[0]}.csv`
        }
      })
    }

    // Return JSON by default
    return new Response(
      JSON.stringify(entities),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename=entities_export_${new Date().toISOString().split('T')[0]}.json`
        } 
      }
    )
  } catch (error) {
    console.error('Error in export-entities:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
