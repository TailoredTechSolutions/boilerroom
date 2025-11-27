import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ============ SECURITY: Internal API Authentication ============
    // Validate internal API key to prevent unauthorized GoDaddy API usage
    const internalApiKey = Deno.env.get('N8N_WEBHOOK_TOKEN');
    const providedKey = req.headers.get('X-Webhook-Token') || req.headers.get('x-webhook-token');
    
    if (!internalApiKey) {
      console.error('CRITICAL: N8N_WEBHOOK_TOKEN not configured');
      return new Response(
        JSON.stringify({ error: 'Server misconfiguration: API authentication not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!providedKey || providedKey !== internalApiKey) {
      console.warn('Unauthorized request to check-domain - invalid or missing token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing API token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { domain } = await req.json();
    
    if (!domain) {
      throw new Error('Domain name is required');
    }

    console.log('Checking domain availability for:', domain);

    const godaddyApiKey = Deno.env.get('GODADDY_API_KEY');
    const godaddyApiSecret = Deno.env.get('GODADDY_API_SECRET');

    let godaddyResult = null;

    // Check GoDaddy availability if API credentials are available
    if (godaddyApiKey && godaddyApiSecret) {
      try {
        const godaddyResponse = await fetch(
          `https://api.godaddy.com/v1/domains/available?domain=${domain}`,
          {
            headers: {
              'Authorization': `sso-key ${godaddyApiKey}:${godaddyApiSecret}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (godaddyResponse.ok) {
          const data = await godaddyResponse.json();
          godaddyResult = {
            available: data.available,
            price: data.price ? `$${(data.price / 1000000).toFixed(2)}` : 'N/A',
            currency: data.currency || 'USD',
          };
          console.log('GoDaddy result:', godaddyResult);
        } else {
          console.error('GoDaddy API error:', await godaddyResponse.text());
          godaddyResult = { error: 'Failed to check availability' };
        }
      } catch (error) {
        console.error('GoDaddy check failed:', error);
        godaddyResult = { error: 'API request failed' };
      }
    } else {
      godaddyResult = { error: 'Need API key' };
    }

    return new Response(
      JSON.stringify({
        domain,
        godaddy: godaddyResult,
        namecheap: { error: 'Need API key' },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
