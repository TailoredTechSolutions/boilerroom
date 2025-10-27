import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY');
const GODADDY_KEY = Deno.env.get('GODADDY_API_KEY');
const GODADDY_SECRET = Deno.env.get('GODADDY_API_SECRET');
const HF_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');
const NEGATIVE_THRESHOLD = parseFloat(Deno.env.get('NEGATIVE_THRESHOLD') || '0.60');

// Normalize company name for domain matching
function normalizeCompany(name: string): string {
  return name.toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '');
}

// Generate candidate domains for checking
function generateCandidateDomains(name: string): string[] {
  const base = normalizeCompany(name);
  const candidates = new Set<string>();
  
  candidates.add(`${base}.com`);
  candidates.add(`${name.replace(/\s+/g, '').toLowerCase()}.com`);
  
  const tokens = name.toLowerCase().split(/\W+/).filter(Boolean);
  if (tokens.length >= 2) {
    candidates.add(`${tokens[0]}${tokens[1]}.com`);
    candidates.add(`${tokens.join('')}.com`);
  }
  
  return Array.from(candidates);
}

// STRICT website existence check with similarity detection
async function checkWebsiteExistsStrict(companyName: string): Promise<{
  canonical: string;
  candidates: string[];
  foundAny: boolean;
  found: string[];
  similarDetected: boolean;
  similarDetectedList: Array<{ url: string; reason: string }>;
}> {
  const candidates = generateCandidateDomains(companyName);
  const found: string[] = [];
  const similarDetected: Array<{ url: string; reason: string }> = [];

  // Direct domain checks
  for (const domain of candidates) {
    try {
      const url = `https://${domain}`;
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        found.push(url);
        console.log(`✓ Found active website: ${url}`);
      }
    } catch {
      // Domain not reachable, continue
    }
  }

  // If nothing found directly, use SerpAPI for similarity detection
  if (found.length === 0 && SERPAPI_KEY) {
    try {
      const query = encodeURIComponent(`${companyName} site:.com "official" OR "home" OR "website"`);
      const searchUrl = `https://serpapi.com/search.json?q=${query}&engine=google&api_key=${SERPAPI_KEY}&num=10`;
      
      const response = await fetch(searchUrl, { signal: AbortSignal.timeout(8000) });
      
      if (response.ok) {
        const data = await response.json();
        const pages = data.organic_results || [];
        const tokens = companyName.toLowerCase().split(/\W+/).filter(Boolean);
        
        for (const page of pages) {
          const url = (page.link || '').toLowerCase();
          const domain = url.replace(/^https?:\/\//, '').split('/')[0];
          const title = (page.title || '').toLowerCase();
          const snippet = (page.snippet || '').toLowerCase();
          
          // Token matching in domain
          let tokenHits = 0;
          for (const token of tokens) {
            if (domain.includes(token)) tokenHits++;
          }
          
          if (tokenHits >= Math.max(1, Math.floor(tokens.length / 2))) {
            similarDetected.push({ url: page.link, reason: 'domain-token-match' });
          } else if (title.includes(tokens[0]) || snippet.includes(tokens[0])) {
            similarDetected.push({ url: page.link, reason: 'title-snippet-match' });
          }
        }
      }
    } catch (error) {
      console.error('SerpAPI similarity check failed:', error);
    }
  }

  const canonical = normalizeCompany(companyName);
  
  return {
    canonical,
    candidates,
    foundAny: found.length > 0,
    found,
    similarDetected: similarDetected.length > 0,
    similarDetectedList: similarDetected,
  };
}

// Check domain availability using GoDaddy API
async function checkDomainAvailability(domain: string): Promise<boolean | null> {
  if (!GODADDY_KEY || !GODADDY_SECRET) {
    console.log('GoDaddy credentials not configured, skipping domain check');
    return null;
  }

  try {
    const url = `https://api.godaddy.com/v1/domains/available?domain=${encodeURIComponent(domain)}`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'Authorization': `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`GoDaddy API error for ${domain}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.available === true;
  } catch (error) {
    console.error(`Error checking domain ${domain}:`, error);
    return null;
  }
}

// Check company active status via Companies House
async function checkCompanyActive(companyName: string): Promise<{
  active: boolean;
  source: string;
  note?: string;
  matches?: any[];
}> {
  const companiesHouseKey = Deno.env.get('COMPANIES_HOUSE_API_KEY');
  
  if (!companiesHouseKey) {
    return { active: true, source: 'unknown', note: 'assumed active (no registry available)' };
  }

  try {
    const searchUrl = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(companyName)}`;
    const auth = btoa(`${companiesHouseKey}:`);
    
    const response = await fetch(searchUrl, {
      headers: { Authorization: `Basic ${auth}` },
      signal: AbortSignal.timeout(8000),
    });

    if (response.ok) {
      const data = await response.json();
      const items = data.items || [];
      
      if (items.length > 0) {
        const active = items.some((item: any) => item?.company_status === 'active');
        return { active, source: 'companies_house', matches: items.slice(0, 5) };
      }
    }
  } catch (error) {
    console.error('Companies House check failed:', error);
  }

  return { active: true, source: 'unknown', note: 'assumed active (registry check failed)' };
}

// Analyze news articles for negative sentiment using HuggingFace
async function analyzeNewsSentiment(companyName: string): Promise<{
  hasNegativePress: boolean;
  negativeScore: number;
  hits: Array<{
    title: string;
    url: string;
    description: string;
    publishedAt: string;
    negative_score: number;
    isNegative: boolean;
  }>;
}> {
  if (!HF_API_KEY) {
    console.log('HuggingFace API key not configured, skipping news sentiment analysis');
    return { hasNegativePress: false, negativeScore: 0, hits: [] };
  }

  try {
    // Fetch recent news articles (requires NewsAPI)
    const newsApiKey = Deno.env.get('NEWSAPI_KEY');
    if (!newsApiKey) {
      return { hasNegativePress: false, negativeScore: 0, hits: [] };
    }

    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(companyName)}&pageSize=20&sortBy=publishedAt&apiKey=${newsApiKey}`;
    
    const newsResponse = await fetch(newsUrl, { signal: AbortSignal.timeout(10000) });
    if (!newsResponse.ok) {
      return { hasNegativePress: false, negativeScore: 0, hits: [] };
    }

    const newsData = await newsResponse.json();
    const articles = newsData.articles || [];

    if (articles.length === 0) {
      return { hasNegativePress: false, negativeScore: 0, hits: [] };
    }

    const hits = [];

    // Analyze each article with HuggingFace zero-shot classification
    for (const article of articles.slice(0, 10)) {
      const text = `${article.title || ''} ${article.description || ''}`.slice(0, 500);
      
      if (!text.trim()) continue;

      try {
        const hfResponse = await fetch(
          'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: text,
              parameters: {
                candidate_labels: [
                  'lawsuit',
                  'fraud',
                  'bankruptcy',
                  'scandal',
                  'regulatory fine',
                  'data breach',
                  'criminal charges',
                  'product recall',
                  'negative news',
                ],
              },
            }),
          }
        );

        if (hfResponse.ok) {
          const hfData = await hfResponse.json();
          
          // Calculate negative score (max score from negative labels)
          const maxNegativeScore = Math.max(...(hfData.scores || [0]));
          const isNegative = maxNegativeScore >= NEGATIVE_THRESHOLD;

          hits.push({
            title: article.title || '',
            url: article.url || '',
            description: article.description || '',
            publishedAt: article.publishedAt || '',
            negative_score: maxNegativeScore,
            isNegative,
          });
        }
      } catch (error) {
        console.error('HuggingFace API error for article:', error);
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const hasNegativePress = hits.some(hit => hit.isNegative);
    const avgNegativeScore = hits.length > 0
      ? hits.reduce((sum, hit) => sum + hit.negative_score, 0) / hits.length
      : 0;

    console.log(`News sentiment for ${companyName}: ${hasNegativePress ? 'NEGATIVE' : 'CLEAN'} (avg score: ${avgNegativeScore.toFixed(3)})`);

    return {
      hasNegativePress,
      negativeScore: avgNegativeScore,
      hits,
    };
  } catch (error) {
    console.error('News sentiment analysis failed:', error);
    return { hasNegativePress: false, negativeScore: 0, hits: [] };
  }
}

// Calculate entity score based on available data
function calculateEntityScore(entity: any): number {
  let score = 0;
  
  // Data Completeness (40 points)
  const fields = [
    entity.legal_name,
    entity.registry_id,
    entity.country,
    entity.status,
    entity.incorporation_date,
    entity.company_type,
    entity.jurisdiction,
    entity.address,
    entity.website,
    entity.officers,
    entity.psc,
  ];
  const filledFields = fields.filter(f => f && (Array.isArray(f) ? f.length > 0 : true)).length;
  score += (filledFields / fields.length) * 40;
  
  // Company Status (25 points)
  const status = (entity.status || '').toLowerCase();
  if (status === 'active') score += 25;
  else if (status === 'inactive') score += 10;
  else if (status === 'dissolved') score += 0;
  else score += 5; // Unknown status
  
  // Web Presence (20 points)
  if (entity.website) score += 20;
  else if (entity.raw_payload?.api_response?.links) score += 10;
  
  // Company Age (15 points) - newer companies score higher
  if (entity.incorporation_date) {
    const incDate = new Date(entity.incorporation_date);
    const yearsOld = (Date.now() - incDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsOld < 2) score += 15;
    else if (yearsOld < 5) score += 10;
    else if (yearsOld < 10) score += 5;
  }
  
  // Ensure score is between 0 and 100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

const EntitySchema = z.object({
  legal_name: z.string().max(500),
  registry_id: z.string().max(200),
  registry_source: z.string().max(50),
  country: z.string().max(100), // Accept full country names from n8n
  score: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  trading_name: z.string().max(500).optional(),
  company_type: z.string().optional(),
  jurisdiction: z.string().optional(),
  incorporation_date: z.string().optional(),
  website: z.string().optional(),
}).passthrough();

const CallbackSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  entities: z.array(EntitySchema).max(1000).optional(),
  totalCount: z.number().int().min(0).optional(),
  errorMessage: z.string().max(2000).optional().nullable()
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate input
    const rawBody = await req.json();
    const { jobId, status, entities, totalCount, errorMessage } = CallbackSchema.parse(rawBody);
    
    console.log('Scrape callback received:', { jobId, status, totalCount });
    
    // Normalize and filter entities to satisfy DB constraints
    const allowedSources = ['COMPANIES_HOUSE', 'GLEIF', 'SEC_EDGAR', 'ASIC'];
    const normalizeSource = (src?: string) => {
      if (!src) return undefined;
      if (src === 'CH') return 'COMPANIES_HOUSE';
      if (src === 'SEC') return 'SEC_EDGAR';
      if (src === 'GLEIF') return 'GLEIF';
      if (src === 'ASIC') return 'ASIC';
      return src;
    };
    const normalizeStatus = (s?: string) => {
      if (!s) return undefined;
      const m = s.toLowerCase();
      if (m === 'active') return 'Active';
      if (m === 'inactive') return 'Inactive';
      if (m === 'dissolved') return 'Dissolved';
      if (m === 'unknown') return 'Unknown';
      // Fallback to a safe allowed value
      return 'Unknown';
    };

    // Process and filter entities
    console.log(`Processing ${entities?.length || 0} entities with filtering...`);
    const normalizedEntities = [];
    
    for (const entity of (entities || [])) {
      const companyName = (entity as any).legal_name || (entity as any).company_name || (entity as any).title;
      if (!companyName) continue;
      
      const src = normalizeSource((entity as any).registry_source);
      if (!src || !allowedSources.includes(src)) continue;
      
      // STRICT FILTERING: Check website existence with similarity detection
      const websiteCheck = await checkWebsiteExistsStrict(companyName);
      
      // Block if ANY website or similar match found
      if (websiteCheck.foundAny || websiteCheck.similarDetected) {
        console.log(`❌ Filtered out ${companyName}: website or similar detected`, {
          foundAny: websiteCheck.foundAny,
          found: websiteCheck.found,
          similarDetected: websiteCheck.similarDetected,
        });
        continue;
      }

      // Check company active status
      const companyStatus = await checkCompanyActive(companyName);
      
      if (!companyStatus.active) {
        console.log(`❌ Filtered out ${companyName}: company not active`);
        continue;
      }

      // STRICT DOMAIN CHECK: .com must be available (only .com matters)
      const canonical = websiteCheck.canonical;
      const comDomain = `${canonical}.com`;
      const comAvailable = await checkDomainAvailability(comDomain);
      
      // If .com is taken or unknown, reject
      if (comAvailable === false) {
        console.log(`❌ Filtered out ${companyName}: .com domain not available`);
        continue;
      }
      
      if (comAvailable === null) {
        console.log(`❌ Filtered out ${companyName}: .com availability unknown (conservative block)`);
        continue;
      }

      // NEGATIVE PRESS CHECK: Analyze news sentiment
      const newsSentiment = await analyzeNewsSentiment(companyName);
      
      if (newsSentiment.hasNegativePress) {
        console.log(`❌ Filtered out ${companyName}: negative press detected`, {
          negativeScore: newsSentiment.negativeScore,
          hitCount: newsSentiment.hits.filter(h => h.isNegative).length,
        });
        continue;
      }
      
      const stat = normalizeStatus((entity as any).status);
      const calculatedScore = calculateEntityScore(entity);
      
      normalizedEntities.push({
        ...(entity as any),
        registry_source: src,
        status: stat,
        score: calculatedScore,
        domain_available: comAvailable,
      });
    }
    
    console.log(`Filtered to ${normalizedEntities.length} entities after checks`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update job status
    const { error: updateError } = await supabase
      .from('scraping_jobs')
      .update({
        status,
        records_fetched: totalCount || 0,
        records_processed: normalizedEntities?.length || 0,
        error_message: errorMessage,
        completed_at: status === 'completed' || status === 'failed' 
          ? new Date().toISOString() 
          : null
      })
      .eq('id', jobId)

    if (updateError) {
      console.error('Error updating job:', updateError)
      throw updateError
    }

    // Insert entities if provided
    if (normalizedEntities.length > 0) {
      console.log(`Upserting ${normalizedEntities.length} entities...`)
      
      // Delete old non-saved entities from this source before inserting new ones
      const sourceToDelete = normalizedEntities[0].registry_source;
      if (sourceToDelete) {
        console.log(`Deleting old non-saved entities from ${sourceToDelete}...`);
        const { error: deleteError } = await supabase
          .from('entities')
          .delete()
          .eq('registry_source', sourceToDelete)
          .eq('is_saved', false);
        
        if (deleteError) {
          console.error('Error deleting old entities:', deleteError);
          // Continue anyway - don't block the upsert
        } else {
          console.log('Old non-saved entities deleted successfully');
        }
      }
      
      const { error: entitiesError } = await supabase
        .from('entities')
        .upsert(normalizedEntities, { onConflict: 'registry_id' })

      if (entitiesError) {
        console.error('Error upserting entities:', entitiesError)
        throw entitiesError
      }
      
      console.log('Entities upserted successfully')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in scrape-callback:', error);
    
    // Return generic error message
    const message = error instanceof z.ZodError ? 'Invalid callback data' : 'Unable to process callback';
    
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
