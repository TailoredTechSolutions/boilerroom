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

// Search Google Custom Search for social media profiles
async function searchSocialMedia(
  entityName: string,
  platform: string,
  apiKey: string,
  searchEngineId: string
): Promise<{ found: boolean; url?: string; count: number }> {
  try {
    const siteMap: { [key: string]: string } = {
      linkedin: "linkedin.com/company",
      twitter: "twitter.com",
      facebook: "facebook.com",
    };

    const site = siteMap[platform];
    const query = `site:${site} "${entityName}"`;

    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.set("key", apiKey);
    searchUrl.searchParams.set("cx", searchEngineId);
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("num", "3");

    console.log(`Searching ${platform} for: ${entityName}`);

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      console.error(`Google Custom Search error: ${response.status}`);
      return { found: false, count: 0 };
    }

    const data = await response.json();
    const resultCount = parseInt(data.searchInformation?.totalResults || "0");

    return {
      found: resultCount > 0,
      url: data.items?.[0]?.link,
      count: resultCount,
    };
  } catch (error) {
    console.error(`Social media search failed for ${platform}:`, error);
    return { found: false, count: 0 };
  }
}

// General web search count
async function getWebSearchCount(
  entityName: string,
  apiKey: string,
  searchEngineId: string
): Promise<number> {
  try {
    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.set("key", apiKey);
    searchUrl.searchParams.set("cx", searchEngineId);
    searchUrl.searchParams.set("q", `"${entityName}"`);
    searchUrl.searchParams.set("num", "1");

    const response = await fetch(searchUrl.toString());

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return parseInt(data.searchInformation?.totalResults || "0");
  } catch (error) {
    console.error("Web search count failed:", error);
    return 0;
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

    // Get API keys
    const googleApiKey = Deno.env.get("GOOGLE_CUSTOM_SEARCH_API_KEY");
    const searchEngineId = Deno.env.get("GOOGLE_CUSTOM_SEARCH_ENGINE_ID");

    const results: any = {
      domain_exists: false,
      website_active: false,
      social_profiles: {
        linkedin: false,
        twitter: false,
        facebook: false,
      },
      web_search_results: 0,
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

    // If Google API is configured, check social media
    if (googleApiKey && searchEngineId) {
      // LinkedIn
      const linkedinResult = await searchSocialMedia(
        entity_name,
        "linkedin",
        googleApiKey,
        searchEngineId
      );
      results.social_profiles.linkedin = linkedinResult.found;
      results.details.linkedin = linkedinResult;

      await storeCheck(supabase, registry_id, "linkedin_profile", !linkedinResult.found, {
        found: linkedinResult.found,
        url: linkedinResult.url,
        count: linkedinResult.count,
      });

      // Twitter
      const twitterResult = await searchSocialMedia(
        entity_name,
        "twitter",
        googleApiKey,
        searchEngineId
      );
      results.social_profiles.twitter = twitterResult.found;
      results.details.twitter = twitterResult;

      await storeCheck(supabase, registry_id, "twitter_profile", !twitterResult.found, {
        found: twitterResult.found,
        url: twitterResult.url,
        count: twitterResult.count,
      });

      // Facebook
      const facebookResult = await searchSocialMedia(
        entity_name,
        "facebook",
        googleApiKey,
        searchEngineId
      );
      results.social_profiles.facebook = facebookResult.found;
      results.details.facebook = facebookResult;

      await storeCheck(supabase, registry_id, "facebook_profile", !facebookResult.found, {
        found: facebookResult.found,
        url: facebookResult.url,
        count: facebookResult.count,
      });

      // General web search
      const webSearchCount = await getWebSearchCount(entity_name, googleApiKey, searchEngineId);
      results.web_search_results = webSearchCount;

      await storeCheck(supabase, registry_id, "web_search", webSearchCount < 10, {
        count: webSearchCount,
        entity_name,
      });
    } else {
      console.log("Google Custom Search API not configured - skipping social media checks");
      results.details.note = "Social media checks skipped - API not configured";
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