import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  domain: string;
  entity_id?: string;
}

// Check domain via DNS lookup and HTTP check
async function checkDomainAvailability(domain: string): Promise<{
  available: boolean;
  status: string;
  registrar: string | null;
  expiry_date: string | null;
  details: any;
}> {
  const result = {
    available: true,
    status: "available",
    registrar: null as string | null,
    expiry_date: null as string | null,
    details: {} as any,
  };

  try {
    // Step 1: DNS lookup using DNS over HTTPS
    console.log(`Checking DNS for domain: ${domain}`);
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`;
    const dnsResponse = await fetch(dohUrl, {
      headers: { "Accept": "application/dns-json" },
    });

    if (dnsResponse.ok) {
      const dnsData = await dnsResponse.json();

      if (dnsData.Answer && dnsData.Answer.length > 0) {
        // Domain has DNS records - likely registered
        result.available = false;
        result.status = "registered";
        result.details.dns_records = dnsData.Answer;
        result.details.ip_addresses = dnsData.Answer.map((a: any) => a.data);

        console.log(`Domain ${domain} has DNS records - likely registered`);
      } else {
        console.log(`Domain ${domain} has no DNS records`);
        result.details.dns_status = "no_records";
      }
    }

    // Step 2: Try HTTP/HTTPS request
    if (!result.available) {
      console.log(`Checking HTTP/HTTPS for domain: ${domain}`);
      try {
        const httpResponse = await fetch(`https://${domain}`, {
          method: "HEAD",
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });

        result.details.http_status = httpResponse.status;
        result.details.http_active = httpResponse.ok;

        if (httpResponse.ok) {
          result.status = "registered";
          result.details.website_active = true;
        }
      } catch (httpError) {
        // Try HTTP if HTTPS fails
        try {
          const httpResponse = await fetch(`http://${domain}`, {
            method: "HEAD",
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
          });

          result.details.http_status = httpResponse.status;
          result.details.http_active = httpResponse.ok;
        } catch (e) {
          result.details.http_error = "Connection failed";
        }
      }
    }

    // Step 3: Try WHOIS lookup via external API (optional, if configured)
    const whoisApiKey = Deno.env.get("WHOIS_API_KEY");
    if (whoisApiKey && !result.available) {
      console.log(`Performing WHOIS lookup for: ${domain}`);
      try {
        // Using WhoisXML API as an example
        const whoisUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisApiKey}&domainName=${domain}&outputFormat=JSON`;
        const whoisResponse = await fetch(whoisUrl, {
          signal: AbortSignal.timeout(10000),
        });

        if (whoisResponse.ok) {
          const whoisData = await whoisResponse.json();

          if (whoisData.WhoisRecord) {
            result.registrar = whoisData.WhoisRecord.registrarName || null;
            result.expiry_date = whoisData.WhoisRecord.expiresDate || null;
            result.details.whois = {
              created_date: whoisData.WhoisRecord.createdDate,
              updated_date: whoisData.WhoisRecord.updatedDate,
              registrant: whoisData.WhoisRecord.registrant?.organization,
            };
          }
        }
      } catch (whoisError) {
        console.error("WHOIS lookup failed:", whoisError);
        result.details.whois_error = whoisError instanceof Error ? whoisError.message : String(whoisError);
      }
    }

    // Final status determination
    if (result.available) {
      result.status = "available";
    } else if (result.details.website_active) {
      result.status = "registered";
    } else if (result.details.dns_records) {
      result.status = "registered";
    } else {
      result.status = "unknown";
    }

  } catch (error) {
    console.error(`Domain check failed for ${domain}:`, error);
    result.status = "error";
    result.details.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

// Check cache for recent results (7 days)
async function getCachedResult(supabase: any, domain: string) {
  const { data, error } = await supabase
    .from("filter_checks")
    .select("*")
    .eq("check_type", "domain_availability")
    .eq("details->>domain", domain)
    .gte("checked_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("checked_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
}

// Store check result
async function storeCheckResult(
  supabase: any,
  entityId: string | null,
  domain: string,
  result: any
) {
  const { error } = await supabase
    .from("filter_checks")
    .insert({
      entity_id: entityId,
      check_type: "domain_availability",
      passed: result.available, // Pass if domain is available
      details: {
        domain,
        ...result,
        checked_at: new Date().toISOString(),
      },
      checked_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Failed to store check result:", error);
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ============ SECURITY: Internal API Authentication ============
    // Validate internal API key to prevent unauthorized domain scanning
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
      console.warn('Unauthorized request to check-domain-availability - invalid or missing token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing API token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { domain, entity_id }: RequestBody = await req.json();

    if (!domain) {
      return new Response(
        JSON.stringify({ error: "domain is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return new Response(
        JSON.stringify({
          error: "Invalid domain format",
          available: false,
          status: "error",
          registrar: null,
          expiry_date: null,
          details: { error: "Invalid domain format" },
          checked_at: new Date().toISOString(),
        }),
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

    // Check cache first
    const cachedResult = await getCachedResult(supabase, domain);
    if (cachedResult) {
      console.log(`Using cached result for domain: ${domain}`);
      return new Response(
        JSON.stringify({
          ...cachedResult.details,
          cached: true,
          cache_age_days: Math.round(
            (Date.now() - new Date(cachedResult.checked_at).getTime()) / (1000 * 60 * 60 * 24)
          ),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Perform domain availability check
    const result = await checkDomainAvailability(domain);

    // Store result in database
    await storeCheckResult(supabase, entity_id || null, domain, result);

    return new Response(
      JSON.stringify({
        ...result,
        checked_at: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in check-domain-availability:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        available: false,
        status: "error",
        registrar: null,
        expiry_date: null,
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
