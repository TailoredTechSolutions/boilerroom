import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_COLUMNS = [
  'id', 'legal_name', 'trading_name', 'registry_source', 'registry_id',
  'status', 'company_type', 'country', 'jurisdiction', 'incorporation_date',
  'website', 'score', 'data_quality_score', 'domain_available',
  'negative_press_flag', 'last_seen'
] as const;

const ExportSchema = z.object({
  filters: z.object({
    source: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
    country: z.string().optional(),
    minScore: z.number().min(0).max(100).optional(),
    maxScore: z.number().min(0).max(100).optional()
  }).optional(),
  columns: z.array(z.enum(ALLOWED_COLUMNS)).min(1).max(20),
  format: z.enum(['CSV', 'JSON'])
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const rawBody = await req.json();
    const { filters, columns, format } = ExportSchema.parse(rawBody);
    
    console.log('Export entities request for user:', user.id, { filters, columns, format });

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

    // Convert to CSV with proper formatting
    if (format === 'CSV') {
      // Create human-readable headers
      const headerMap: Record<string, string> = {
        'legal_name': 'Company Name',
        'trading_name': 'Trading Name',
        'registry_source': 'Registry',
        'registry_id': 'Registry ID',
        'status': 'Active Status',
        'company_type': 'Company Type',
        'country': 'Country',
        'jurisdiction': 'Jurisdiction',
        'incorporation_date': 'Incorporation Date',
        'website': 'Website',
        'score': 'Score',
        'data_quality_score': 'Data Quality Score',
        'domain_available': 'Domain Available',
        'negative_press_flag': 'Negative Press Flag',
        'last_seen': 'Last Seen'
      }
      
      const headers = columns.map((c: string) => headerMap[c] || c)
      
      const csv = [
        headers.join(','),
        ...entities.map((e: any) => 
          columns.map((c: string) => {
            const value = e[c]
            // Handle different data types
            if (value === null || value === undefined) return ''
            if (typeof value === 'boolean') return value ? 'Yes' : 'No'
            if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`
            }
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
    console.error('Error in export-entities:', error);
    
    // Return generic error message
    let statusCode = 400;
    let message = 'Unable to process export';
    
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
