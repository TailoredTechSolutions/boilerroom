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
    const { entity_name, potential_domains = [], entity_id } = await req.json();
    console.log('Checking online presence for:', entity_name);

    // Generate potential domain names
    const baseName = entity_name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domainVariants = [
      `${baseName}.com`,
      `${baseName}.co.uk`,
      `${baseName}.net`,
      ...potential_domains
    ];

    let domain_exists = false;
    let website_active = false;
    let active_domains: string[] = [];
    const social_profiles = {
      linkedin: false,
      twitter: false,
      facebook: false
    };
    let web_search_results = 0;

    // Check each domain variant
    for (const domain of domainVariants) {
      try {
        // Check if domain has DNS records
        const dnsCheck = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
        const dnsData = await dnsCheck.json();
        
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          domain_exists = true;
          
          // Try to access the website
          try {
            const websiteCheck = await fetch(`https://${domain}`, {
              method: 'HEAD',
              redirect: 'follow',
              signal: AbortSignal.timeout(5000)
            });
            
            if (websiteCheck.ok || websiteCheck.status === 301 || websiteCheck.status === 302) {
              website_active = true;
              active_domains.push(domain);
            }
          } catch (websiteError) {
            console.log(`Website check failed for ${domain}:`, websiteError instanceof Error ? websiteError.message : String(websiteError));
          }
        }
      } catch (dnsError) {
        console.log(`DNS check failed for ${domain}:`, dnsError instanceof Error ? dnsError.message : String(dnsError));
      }
    }

    // Check social media presence using simple web searches
    const searchQueries = [
      `site:linkedin.com/company "${entity_name}"`,
      `site:twitter.com "${entity_name}"`,
      `site:facebook.com "${entity_name}"`
    ];

    // Google Custom Search API (if configured)
    const googleApiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY');
    const googleSearchEngineId = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');

    if (googleApiKey && googleSearchEngineId) {
      try {
        // General web search for the company
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleSearchEngineId}&q="${entity_name}"`;
        const searchResponse = await fetch(searchUrl);
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          web_search_results = searchData.searchInformation?.totalResults || 0;
          
          // Check for social media in search results
          const results = searchData.items || [];
          for (const result of results) {
            const url = result.link.toLowerCase();
            if (url.includes('linkedin.com/company')) social_profiles.linkedin = true;
            if (url.includes('twitter.com') || url.includes('x.com')) social_profiles.twitter = true;
            if (url.includes('facebook.com')) social_profiles.facebook = true;
          }
        }
      } catch (searchError) {
        console.error('Google Search API error:', searchError);
      }
    }

    const has_online_presence = domain_exists || website_active || 
                               social_profiles.linkedin || 
                               social_profiles.twitter || 
                               social_profiles.facebook ||
                               web_search_results > 5;

    const details = {
      domain_exists,
      website_active,
      active_domains,
      social_profiles,
      web_search_results,
      checked_domains: domainVariants
    };

    // Store result in filter_checks table if entity_id provided
    if (entity_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('filter_checks').insert([
        {
          entity_id,
          check_type: 'website',
          passed: !website_active,
          details: { website_active, active_domains }
        },
        {
          entity_id,
          check_type: 'social_media',
          passed: !social_profiles.linkedin && !social_profiles.twitter && !social_profiles.facebook,
          details: { social_profiles }
        },
        {
          entity_id,
          check_type: 'web_search',
          passed: web_search_results <= 5,
          details: { web_search_results }
        }
      ]);

      // Update entity with social media presence data
      await supabase.from('entities').update({
        social_media_presence: {
          ...details,
          has_online_presence,
          last_checked: new Date().toISOString()
        }
      }).eq('id', entity_id);
    }

    return new Response(
      JSON.stringify({
        ...details,
        has_online_presence,
        passed: !has_online_presence
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-online-presence:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});