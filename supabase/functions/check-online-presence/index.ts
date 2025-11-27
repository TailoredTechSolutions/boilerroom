import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  entity_name: string;
  potential_domains: string[];
  registry_id: string;
}

interface CheckResult {
  check_type: string;
  passed: boolean;
  details: any;
}

// Check DNS resolution for domain
async function checkDNS(domain: string): Promise<{ exists: boolean; records?: any }> {
  try {
    // Use DNS over HTTPS (DoH) for DNS lookup
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`;
    const response = await fetch(dohUrl, {
      headers: { "Accept": "application/dns-json" },
    });

    if (!response.ok) {
      return { exists: false };
    }

    const data = await response.json();
    return {
      exists: data.Answer && data.Answer.length > 0,
      records: data.Answer,
    };
  } catch (error) {
    console.error(`DNS check failed for ${domain}:`, error);
    return { exists: false };
  }
}

// Check if website is active
async function checkWebsiteActive(domain: string): Promise<{ active: boolean; status?: number }> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    return {
      active: response.ok,
      status: response.status,
    };
  } catch (error) {
    // Try HTTP if HTTPS fails
    try {
      const response = await fetch(`http://${domain}`, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });

      return {
        active: response.ok,
        status: response.status,
      };
    } catch (httpError) {
      return { active: false };
    }
  }
}

// Search Facebook using SerpAPI Google Search with site filter
async function searchFacebook(
  entityName: string,
  apiKey: string
): Promise<{ found: boolean; url?: string; count: number }> {
  try {
    const query = `site:facebook.com "${entityName}"`;
    const searchUrl = new URL("https://serpapi.com/search");
    searchUrl.searchParams.set("api_key", apiKey);
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("num", "3");

    console.log(`Searching Facebook for: ${entityName}`);

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      console.error(`SerpAPI Facebook search error: ${response.status}`);
      return { found: false, count: 0 };
    }

    const data = await response.json();
    const organicResults = data.organic_results || [];
    
    return {
      found: organicResults.length > 0,
      url: organicResults[0]?.link,
      count: organicResults.length,
    };
  } catch (error) {
    console.error("Facebook search failed:", error);
    return { found: false, count: 0 };
  }
}

// Search YouTube using SerpAPI YouTube Search API
async function searchYouTube(
  entityName: string,
  apiKey: string
): Promise<{ found: boolean; url?: string; count: number; channel?: string }> {
  try {
    const searchUrl = new URL("https://serpapi.com/search");
    searchUrl.searchParams.set("engine", "youtube");
    searchUrl.searchParams.set("search_query", entityName);
    searchUrl.searchParams.set("api_key", apiKey);

    console.log(`Searching YouTube for: ${entityName}`);

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      console.error(`SerpAPI YouTube search error: ${response.status}`);
      return { found: false, count: 0 };
    }

    const data = await response.json();
    const videoResults = data.video_results || [];
    const channelResults = data.channel_results || [];
    
    const hasResults = videoResults.length > 0 || channelResults.length > 0;
    
    return {
      found: hasResults,
      url: channelResults[0]?.link || videoResults[0]?.link,
      count: videoResults.length + channelResults.length,
      channel: channelResults[0]?.title,
    };
  } catch (error) {
    console.error("YouTube search failed:", error);
    return { found: false, count: 0 };
  }
}

// General web search using SerpAPI Google Search
async function getWebSearchCount(
  entityName: string,
  apiKey: string
): Promise<{ count: number; topResults: Array<{ title: string; link: string }> }> {
  try {
    const searchUrl = new URL("https://serpapi.com/search");
    searchUrl.searchParams.set("api_key", apiKey);
    searchUrl.searchParams.set("q", `"${entityName}"`);
    searchUrl.searchParams.set("num", "10");

    console.log(`Searching web for: ${entityName}`);

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      console.error(`SerpAPI web search error: ${response.status}`);
      return { count: 0, topResults: [] };
    }

    const data = await response.json();
    const organicResults = data.organic_results || [];
    
    const topResults = organicResults.slice(0, 5).map((result: any) => ({
      title: result.title,
      link: result.link,
    }));

    return {
      count: organicResults.length,
      topResults,
    };
  } catch (error) {
    console.error("Web search failed:", error);
    return { count: 0, topResults: [] };
  }
}

// Store individual check result
async function storeCheck(
  supabase: any,
  entityId: string,
  checkType: string,
  passed: boolean,
  details: any
) {
  const { error } = await supabase
    .from("filter_checks")
    .insert({
      entity_id: entityId,
      check_type: checkType,
      passed,
      details,
      checked_at: new Date().toISOString(),
    });

  if (error) {
    console.error(`Failed to store ${checkType} check:`, error);
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ============ SECURITY: Internal API Authentication ============
    // Validate internal API key to prevent unauthorized access to paid APIs (SerpAPI)
    const internalApiKey = Deno.env.get('N8N_WEBHOOK_TOKEN');
    const providedKey = req.headers.get('X-Webhook-Token') || req.headers.get('x-webhook-token');
    
    if (!internalApiKey) {
      console.error('CRITICAL: N8N_WEBHOOK_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration: API authentication not configured' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!providedKey || providedKey !== internalApiKey) {
      console.warn('Unauthorized request to check-online-presence - invalid or missing token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing API token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { entity_name, potential_domains, registry_id }: RequestBody = await req.json();

    if (!entity_name || !potential_domains || potential_domains.length === 0) {
      return new Response(
        JSON.stringify({ error: "entity_name and potential_domains are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get SerpAPI key
    const serpApiKey = Deno.env.get("SERPAPI_API_KEY");

    const results: any = {
      domain_exists: false,
      website_active: false,
      social_profiles: {
        facebook: false,
        youtube: false,
      },
      web_search_results: 0,
      top_web_results: [],
      details: {},
      checked_at: new Date().toISOString(),
      entity_name,
      registry_id,
    };

    // Check DNS and website for each potential domain
    for (const domain of potential_domains) {
      console.log(`Checking domain: ${domain}`);

      const dnsResult = await checkDNS(domain);
      if (dnsResult.exists) {
        results.domain_exists = true;
        results.details[domain] = { dns: dnsResult };

        // Store DNS check
        await storeCheck(supabase, registry_id, "dns_lookup", false, {
          domain,
          exists: true,
          records: dnsResult.records,
        });

        // Check if website is active
        const websiteResult = await checkWebsiteActive(domain);
        if (websiteResult.active) {
          results.website_active = true;
          results.details[domain].website = websiteResult;

          // Store website check
          await storeCheck(supabase, registry_id, "website_active", false, {
            domain,
            active: true,
            status: websiteResult.status,
          });
        }
      }
    }

    // If SerpAPI is configured, perform web presence checks
    if (serpApiKey) {
      console.log("Running SerpAPI web presence checks...");

      // Facebook search
      const facebookResult = await searchFacebook(entity_name, serpApiKey);
      results.social_profiles.facebook = facebookResult.found;
      results.details.facebook = facebookResult;

      await storeCheck(supabase, registry_id, "facebook_profile", !facebookResult.found, {
        found: facebookResult.found,
        url: facebookResult.url,
        count: facebookResult.count,
      });

      // YouTube search
      const youtubeResult = await searchYouTube(entity_name, serpApiKey);
      results.social_profiles.youtube = youtubeResult.found;
      results.details.youtube = youtubeResult;

      await storeCheck(supabase, registry_id, "youtube_presence", !youtubeResult.found, {
        found: youtubeResult.found,
        url: youtubeResult.url,
        channel: youtubeResult.channel,
        count: youtubeResult.count,
      });

      // General web search
      const webSearchResult = await getWebSearchCount(entity_name, serpApiKey);
      results.web_search_results = webSearchResult.count;
      results.top_web_results = webSearchResult.topResults;

      await storeCheck(supabase, registry_id, "web_search", webSearchResult.count < 10, {
        count: webSearchResult.count,
        top_results: webSearchResult.topResults,
        entity_name,
      });

      console.log(`Web presence check complete: Facebook=${facebookResult.found}, YouTube=${youtubeResult.found}, Web Results=${webSearchResult.count}`);
    } else {
      console.log("SERPAPI_API_KEY not configured - skipping web presence checks");
      results.details.note = "Web presence checks skipped - SerpAPI not configured";
    }

    // Store overall online presence check
    const hasOnlinePresence =
      results.domain_exists ||
      results.website_active ||
      Object.values(results.social_profiles).some((v) => v === true);

    await storeCheck(supabase, registry_id, "online_presence", !hasOnlinePresence, results);

    return new Response(
      JSON.stringify(results),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in check-online-presence:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        domain_exists: false,
        website_active: false,
        social_profiles: {},
        web_search_results: 0,
        details: {},
        checked_at: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});