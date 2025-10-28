import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entity_id } = await req.json();
    console.log('Aggregating filter results for entity:', entity_id);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the entity
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('*')
      .eq('id', entity_id)
      .single();

    if (entityError) throw entityError;

    // Get all filter checks for this entity
    const { data: filterChecks, error: checksError } = await supabase
      .from('filter_checks')
      .select('*')
      .eq('entity_id', entity_id)
      .order('created_at', { ascending: false });

    if (checksError) throw checksError;

    // Group checks by type and get latest for each
    const latestChecks: Record<string, any> = {};
    for (const check of filterChecks || []) {
      if (!latestChecks[check.check_type]) {
        latestChecks[check.check_type] = check;
      }
    }

    // Evaluate filter criteria
    const filterResults = {
      active_status: entity.status?.toLowerCase() === 'active',
      negative_press: latestChecks.negative_press?.passed ?? true,
      domain_available: entity.domain_available ?? false,
      no_website: latestChecks.website?.passed ?? true,
      no_social_media: latestChecks.social_media?.passed ?? true,
      low_web_presence: latestChecks.web_search?.passed ?? true
    };

    // Identify failed checks
    const failedChecks = Object.entries(filterResults)
      .filter(([key, passed]) => !passed)
      .map(([key]) => key);

    // Generate filter notes
    const filterNotes: string[] = [];
    if (!filterResults.active_status) filterNotes.push('Failed: Company not active');
    if (!filterResults.negative_press) filterNotes.push('Failed: Negative press detected');
    if (!filterResults.domain_available) filterNotes.push('Failed: Domain not available');
    if (!filterResults.no_website) filterNotes.push('Failed: Active website found');
    if (!filterResults.no_social_media) filterNotes.push('Failed: Social media presence detected');
    if (!filterResults.low_web_presence) filterNotes.push('Failed: Significant web presence found');

    if (failedChecks.length === 0) {
      filterNotes.push('All filters passed - Qualified lead');
    }

    // Determine overall status
    const overallStatus = failedChecks.length === 0 ? 'qualified' : 'rejected';
    const recommendation = failedChecks.length === 0 ? 'qualify' : 'reject';

    // Update entity with aggregated results
    const { error: updateError } = await supabase
      .from('entities')
      .update({
        filter_status: overallStatus,
        filter_notes: filterNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', entity_id);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        overall_status: overallStatus,
        failed_checks: failedChecks,
        filter_notes: filterNotes,
        filter_results: filterResults,
        recommendation,
        checks_performed: Object.keys(latestChecks).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in aggregate-filter-results:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});