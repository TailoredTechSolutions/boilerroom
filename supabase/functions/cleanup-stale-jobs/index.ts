import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Cleanup stale scraping jobs that have been running for more than 5 minutes
 * This edge function can be called periodically or manually to clean up stuck jobs
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Find jobs that are still running or pending after 5 minutes
    const timeoutThreshold = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: staleJobs, error: fetchError } = await supabaseClient
      .from("scraping_jobs")
      .select("id, started_at, source, search_term")
      .in("status", ["running", "pending"])
      .lt("started_at", timeoutThreshold);

    if (fetchError) {
      throw fetchError;
    }

    if (!staleJobs || staleJobs.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No stale jobs found",
          cleaned: 0 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${staleJobs.length} stale jobs to clean up`);

    // Update all stale jobs to failed status
    const jobIds = staleJobs.map(j => j.id);
    const { error: updateError } = await supabaseClient
      .from("scraping_jobs")
      .update({
        status: "failed",
        error_message: "Job timed out after 5 minutes (auto-cleanup)",
        completed_at: new Date().toISOString(),
      })
      .in("id", jobIds);

    if (updateError) {
      throw updateError;
    }

    console.log(`Cleaned up ${staleJobs.length} stale jobs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Cleaned up ${staleJobs.length} stale jobs`,
        cleaned: staleJobs.length,
        jobs: staleJobs
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in cleanup-stale-jobs:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
