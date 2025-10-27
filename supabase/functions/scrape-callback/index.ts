import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { z } from "https://deno.land/x/zod/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY');
const GODADDY_API_KEY = Deno.env.get('GODADDY_API_KEY');
const GODADDY_API_SECRET = Deno.env.get('GODADDY_API_SECRET');
const COMPANIES_HOUSE_API_KEY = Deno.env.get('COMPANIES_HOUSE_API_KEY');
const HUGGINGFACE_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');

function normalizeCompany(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(ltd|limited|inc|incorporated|llc|corp|corporation|plc|co|company|group|holdings)\b/gi, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateCandidateDomains(name: string): string[] {
  const normalized = normalizeCompany(name);
  const words = normalized.split(' ').filter(w => w.length > 0);
  
  const domains = [];
  
  // Full name variations
  domains.push(words.join(''));
  domains.push(words.join('-'));
  
  // First two words
  if (words.length >= 2) {
    domains.push(words.slice(0, 2).join(''));
    domains.push(words.slice(0, 2).join('-'));
  }
  
  // First word only
  if (words.length > 0) {
    domains.push(words[0]);
  }
  
  return [...new Set(domains)];
}

async function checkWebsiteExistsStrict(companyName: string): Promise<{
  exists: boolean;
  url?: string;
  domain?: string;
  similarityScore?: number;
}> {
  try {
    const candidates = generateCandidateDomains(companyName);
    
    // Try direct HTTP checks first
    for (const candidate of candidates) {
      for (const tld of ['com', 'co.uk', 'io', 'net']) {
        const domain = `${candidate}.${tld}`;
        const url = `https://${domain}`;
        
        try {
          const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(3000),
          });
          
          if (response.ok) {
            console.log(`Found website: ${url}`);
            return {
              exists: true,
              url,
              domain: candidate,
              similarityScore: 1.0,
            };
          }
        } catch {
          // Continue to next candidate
        }
      }
    }
    
    // If no direct match, use SerpAPI to search
    if (!SERPAPI_KEY) {
      return { exists: false };
    }
    
    const searchUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(companyName + ' official website')}&api_key=${SERPAPI_KEY}`;
    
    const searchResponse = await fetch(searchUrl, { signal: AbortSignal.timeout(5000) });
    if (!searchResponse.ok) {
      return { exists: false };
    }
    
    const searchData = await searchResponse.json();
    const organicResults = searchData.organic_results || [];
    
    if (organicResults.length > 0) {
      const topResult = organicResults[0];
      const title = (topResult.title || '').toLowerCase();
      const normalizedName = normalizeCompany(companyName);
      
      // Calculate simple similarity
      const titleWords = title.split(/\s+/);
      const nameWords = normalizedName.split(/\s+/);
      const matchingWords = nameWords.filter(word => 
        titleWords.some((tw: string) => tw.includes(word) || word.includes(tw))
      );
      const similarity = matchingWords.length / nameWords.length;
      
      if (similarity >= 0.6) {
        try {
          const domain = new URL(topResult.link).hostname.replace('www.', '');
          return {
            exists: true,
            url: topResult.link,
            domain: domain.split('.')[0],
            similarityScore: similarity,
          };
        } catch {
          return { exists: false };
        }
      }
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking website:', error);
    return { exists: false };
  }
}

async function checkDomainAvailability(domain: string): Promise<boolean | null> {
  if (!GODADDY_API_KEY || !GODADDY_API_SECRET) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.godaddy.com/v1/domains/available?domain=${domain}`,
      {
        headers: {
          'Authorization': `sso-key ${GODADDY_API_KEY}:${GODADDY_API_SECRET}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.available === true;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return null;
  }
}

async function checkCompanyActive(companyName: string): Promise<{
  active: boolean;
  source: string;
  note?: string;
  matches?: any[];
}> {
  if (!COMPANIES_HOUSE_API_KEY) {
    return { active: true, source: 'unknown', note: 'API key not configured' };
  }
  
  try {
    const searchUrl = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(companyName)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': COMPANIES_HOUSE_API_KEY,
      },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) {
      return { active: true, source: 'companies_house', note: 'API request failed' };
    }
    
    const data = await response.json();
    const companies = data.items || [];
    
    if (companies.length === 0) {
      return { active: true, source: 'companies_house', note: 'No matches found' };
    }
    
    // Check if any match is active
    const normalizedSearch = normalizeCompany(companyName);
    const exactMatch = companies.find((c: any) => 
      normalizeCompany(c.title) === normalizedSearch
    );
    
    if (exactMatch) {
      const isActive = (exactMatch.company_status || '').toLowerCase() === 'active';
      return {
        active: isActive,
        source: 'companies_house',
        matches: [exactMatch],
      };
    }
    
    // If no exact match, check if any similar company is active
    const anyActive = companies.some((c: any) => 
      (c.company_status || '').toLowerCase() === 'active'
    );
    
    return {
      active: anyActive,
      source: 'companies_house',
      note: 'No exact match, found similar companies',
      matches: companies.slice(0, 3),
    };
  } catch (error) {
    console.error('Error checking company status:', error);
    return { active: true, source: 'companies_house', note: 'Error during check' };
  }
}

async function analyzeNewsSentiment(companyName: string): Promise<{
  hasNegativePress: boolean;
  negativeScore: number;
  hits: Array<{
    title: string;
    url: string;
    score: number;
    isNegative: boolean;
  }>;
}> {
  const NEGATIVE_THRESHOLD = parseFloat(Deno.env.get('NEGATIVE_THRESHOLD') || '0.60');
  
  try {
    if (!SERPAPI_KEY) {
      return { hasNegativePress: false, negativeScore: 0, hits: [] };
    }

    const newsUrl = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(companyName)}&api_key=${SERPAPI_KEY}`;
    
    const newsResponse = await fetch(newsUrl, { signal: AbortSignal.timeout(10000) });
    if (!newsResponse.ok) {
      return { hasNegativePress: false, negativeScore: 0, hits: [] };
    }

    const newsData = await newsResponse.json();
    const articles = (newsData.news_results || []).map((item: any) => ({
      title: item.title || '',
      description: item.snippet || '',
      url: item.link || '',
    }));

    if (articles.length === 0) {
      return { hasNegativePress: false, negativeScore: 0, hits: [] };
    }

    const hits = [];
    
    for (const article of articles.slice(0, 10)) {
      try {
        const text = `${article.title}. ${article.description}`;
        
        if (!HUGGINGFACE_API_KEY) {
          continue;
        }

        const hfResponse = await fetch(
          'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: text,
              parameters: {
                candidate_labels: [
                  'scandal',
                  'fraud',
                  'investigation',
                  'lawsuit',
                  'bankruptcy',
                  'corruption',
                  'criminal charges',
                  'controversy'
                ],
              },
            }),
            signal: AbortSignal.timeout(8000),
          }
        );

        if (hfResponse.ok) {
          const sentimentData = await hfResponse.json();
          const maxScore = Math.max(...(sentimentData.scores || [0]));
          
          hits.push({
            title: article.title,
            url: article.url,
            score: maxScore,
            isNegative: maxScore >= NEGATIVE_THRESHOLD,
          });
        }
      } catch (error) {
        console.error('HuggingFace API error for article:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const hasNegativePress = hits.some(hit => hit.isNegative);
    const avgNegativeScore = hits.length > 0
      ? hits.reduce((sum, hit) => sum + hit.score, 0) / hits.length
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

function calculateEntityScore(entity: any): number {
  let score = 0;
  
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
  
  const status = (entity.status || '').toLowerCase();
  if (status === 'active') score += 25;
  else if (status === 'inactive') score += 10;
  else if (status === 'dissolved') score += 0;
  else score += 5;
  
  if (entity.website) score += 20;
  else if (entity.raw_payload?.api_response?.links) score += 10;
  
  if (entity.incorporation_date) {
    const incDate = new Date(entity.incorporation_date);
    const yearsOld = (Date.now() - incDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsOld < 2) score += 15;
    else if (yearsOld < 5) score += 10;
    else if (yearsOld < 10) score += 5;
  }
  
  return Math.min(Math.max(Math.round(score), 0), 100);
}

const EntitySchema = z.object({
  legal_name: z.string().max(500),
  registry_id: z.string().max(200),
  registry_source: z.string().max(50),
  country: z.string().max(100),
  score: z.number().min(0).max(100).optional(),
  status: z.string().optional(),
  trading_name: z.string().max(500).optional(),
  company_type: z.string().optional(),
  jurisdiction: z.string().optional(),
  incorporation_date: z.string().optional(),
  website: z.string().optional(),
}).passthrough();

const CallbackSchema = z.object({
  job_id: z.string().uuid().optional(),
  jobId: z.string().uuid().optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  entities: z.array(EntitySchema).max(1000).optional(),
  total_count: z.number().int().min(0).optional(),
  error_message: z.string().max(2000).optional().nullable()
}).transform((data) => ({
  ...data,
  job_id: data.job_id || data.jobId,
})).refine((data) => !!data.job_id, {
  message: "Either job_id or jobId is required"
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    const validatedData = CallbackSchema.parse(rawBody);
    
    console.log(`=== Starting to process ${validatedData.entities?.length || 0} entities ===`);
    
    // Initialize Supabase client early for audit logging
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Check if job has been running for more than 2 minutes (timeout check)
    const { data: jobData } = await supabaseClient
      .from('scraping_jobs')
      .select('started_at, status')
      .eq('id', validatedData.job_id)
      .single();
    
    if (jobData?.started_at) {
      const startTime = new Date(jobData.started_at).getTime();
      const now = Date.now();
      const elapsedMinutes = (now - startTime) / (1000 * 60);
      
      if (elapsedMinutes > 2) {
        console.log(`⏰ Job timeout: ${elapsedMinutes.toFixed(1)} minutes elapsed`);
        await supabaseClient
          .from('scraping_jobs')
          .update({
            status: 'failed',
            error_message: 'Job timed out after 2 minutes',
            completed_at: new Date().toISOString()
          })
          .eq('id', validatedData.job_id);
        
        return new Response(
          JSON.stringify({ success: false, error: 'Job timeout exceeded 2 minutes' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 408 }
        );
      }
    }
    
    // Load suppression list for duplicate checking
    const { data: suppressionData } = await supabaseClient
      .from('suppression_list')
      .select('canonical_name');
    
    const suppressedNames = new Set(
      (suppressionData || []).map(s => s.canonical_name)
    );
    console.log(`Loaded ${suppressedNames.size} suppressed companies`);
    
    const strictFilteredEntities = [];
    const rejectedEntities = [];

    for (const entity of (validatedData.entities || [])) {
      console.log(`\n--- Checking ${entity.legal_name} ---`);
      
      // Check 0: Suppression list (skip dismissed companies)
      const entityCanonical = normalizeCompany(entity.legal_name);
      if (suppressedNames.has(entityCanonical)) {
        console.log(`  ❌ REJECTED: Company in suppression list - ${entity.legal_name}`);
        rejectedEntities.push({
          entity: entity.legal_name,
          reason: 'suppressed',
          details: { canonical: entityCanonical }
        });
        
        await supabaseClient.from('filtering_audit').insert({
          company_name: entity.legal_name,
          scraping_job_id: validatedData.job_id,
          filter_type: 'suppressed',
          blocked: true,
          decision_details: { canonical: entityCanonical }
        });
        
        continue;
      }
      
      // Check 1: Website existence (STRICT)
      const websiteCheck = await checkWebsiteExistsStrict(entity.legal_name);
      console.log(`  Website check: ${JSON.stringify(websiteCheck)}`);
      
      if (!websiteCheck.exists) {
        console.log(`  ❌ REJECTED: No credible website found for ${entity.legal_name}`);
        rejectedEntities.push({
          entity: entity.legal_name,
          reason: 'no_website',
          details: websiteCheck
        });
        
        await supabaseClient.from('filtering_audit').insert({
          company_name: entity.legal_name,
          scraping_job_id: validatedData.job_id,
          filter_type: 'no_website',
          blocked: true,
          decision_details: websiteCheck
        });
        
        continue;
      }

      // Check 2: Company active status
      const activeCheck = await checkCompanyActive(entity.legal_name);
      console.log(`  Active check: ${JSON.stringify(activeCheck)}`);
      
      if (!activeCheck.active) {
        console.log(`  ❌ REJECTED: Company not active - ${entity.legal_name}`);
        rejectedEntities.push({
          entity: entity.legal_name,
          reason: 'inactive',
          details: activeCheck
        });
        
        await supabaseClient.from('filtering_audit').insert({
          company_name: entity.legal_name,
          scraping_job_id: validatedData.job_id,
          filter_type: 'inactive',
          blocked: true,
          decision_details: activeCheck
        });
        
        continue;
      }

      // Check 3: Domain availability
      if (websiteCheck.domain) {
        const domainCheck = await checkDomainAvailability(websiteCheck.domain);
        console.log(`  Domain availability check for ${websiteCheck.domain}: ${domainCheck}`);
        
        if (domainCheck === true) {
          console.log(`  ❌ REJECTED: Domain ${websiteCheck.domain} is available for purchase`);
          rejectedEntities.push({
            entity: entity.legal_name,
            reason: 'domain_available',
            details: { domain: websiteCheck.domain }
          });
          entity.domain_available = true;
          
          await supabaseClient.from('filtering_audit').insert({
            company_name: entity.legal_name,
            scraping_job_id: validatedData.job_id,
            filter_type: 'domain_unavailable',
            blocked: true,
            decision_details: { domain: websiteCheck.domain }
          });
          
          continue;
        }
        entity.domain_available = false;
      }

      // Check 4: Negative press sentiment analysis
      const sentimentCheck = await analyzeNewsSentiment(entity.legal_name);
      console.log(`  Sentiment check: hasNegativePress=${sentimentCheck.hasNegativePress}, score=${sentimentCheck.negativeScore}`);
      
      if (sentimentCheck.hasNegativePress) {
        console.log(`  ❌ REJECTED: Negative press detected for ${entity.legal_name}`);
        console.log(`  Top negative articles:`, sentimentCheck.hits.slice(0, 3));
        rejectedEntities.push({
          entity: entity.legal_name,
          reason: 'negative_press',
          details: {
            score: sentimentCheck.negativeScore,
            articlesCount: sentimentCheck.hits.length,
            topArticles: sentimentCheck.hits.slice(0, 3)
          }
        });
        entity.negative_press_flag = true;
        
        const topArticle = sentimentCheck.hits[0];
        await supabaseClient.from('filtering_audit').insert({
          company_name: entity.legal_name,
          scraping_job_id: validatedData.job_id,
          filter_type: 'negative_press',
          blocked: true,
          sentiment_score: sentimentCheck.negativeScore,
          articles_found: sentimentCheck.hits.length,
          top_article_title: topArticle?.title,
          top_article_url: topArticle?.url,
          decision_details: {
            topArticles: sentimentCheck.hits.slice(0, 3)
          }
        });
        
        continue;
      }

      // All checks passed
      console.log(`  ✅ PASSED all checks: ${entity.legal_name}`);
      entity.website = websiteCheck.url;
      entity.web_presence_score = websiteCheck.similarityScore;
      
      await supabaseClient.from('filtering_audit').insert({
        company_name: entity.legal_name,
        scraping_job_id: validatedData.job_id,
        filter_type: 'passed',
        blocked: false,
        decision_details: {
          website: websiteCheck.url,
          webPresenceScore: websiteCheck.similarityScore
        }
      });
      
      strictFilteredEntities.push(entity);
    }

    console.log(`=== Strict filtering complete: ${strictFilteredEntities.length}/${validatedData.entities?.length || 0} entities passed ===`);
    console.log('Rejection summary:', rejectedEntities.reduce((acc, r) => {
      acc[r.reason] = (acc[r.reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    // Update job status
    const { error: updateError } = await supabaseClient
      .from('scraping_jobs')
      .update({
        status: validatedData.status,
        records_fetched: validatedData.total_count || 0,
        records_processed: strictFilteredEntities.length,
        error_message: validatedData.error_message,
        completed_at: validatedData.status === 'completed' || validatedData.status === 'failed' 
          ? new Date().toISOString() 
          : null
      })
      .eq('id', validatedData.job_id);

    if (updateError) {
      console.error('Error updating job:', updateError);
      throw updateError;
    }

    // Insert entities if provided
    if (strictFilteredEntities.length > 0) {
      console.log(`Processing ${strictFilteredEntities.length} entities for insertion...`);
      
      // Check for existing duplicates by canonical name
      const { data: existingEntities } = await supabaseClient
        .from('entities')
        .select('id, legal_name, registry_id');
      
      const existingCanonicalSet = new Set(
        (existingEntities || []).map(e => normalizeCompany(e.legal_name))
      );
      
      const existingRegistryIds = new Set(
        (existingEntities || []).map(e => e.registry_id)
      );
      
      // Filter out duplicates based on both canonical name and registry_id
      const uniqueEntities = strictFilteredEntities.filter(e => {
        const canonical = normalizeCompany(e.legal_name);
        if (existingCanonicalSet.has(canonical)) {
          console.log(`  🗑️ Skipping duplicate by name: ${e.legal_name}`);
          return false;
        }
        if (existingRegistryIds.has(e.registry_id)) {
          console.log(`  🗑️ Skipping duplicate by registry ID: ${e.legal_name} (${e.registry_id})`);
          return false;
        }
        return true;
      });
      
      console.log(`Upserting ${uniqueEntities.length} unique entities (${strictFilteredEntities.length - uniqueEntities.length} duplicates skipped)...`);
      
      if (uniqueEntities.length > 0) {
        const { error: entitiesError } = await supabaseClient
          .from('entities')
          .upsert(uniqueEntities.map(e => ({
            ...e,
            score: calculateEntityScore(e)
          })), { onConflict: 'registry_id,registry_source' });

        if (entitiesError) {
          console.error('Error upserting entities:', entitiesError);
          throw entitiesError;
        }
        
        console.log('Entities upserted successfully');
      } else {
        console.log('No new unique entities to insert');
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-callback:', error);
    
    const message = error instanceof z.ZodError ? 'Invalid callback data' : 'Unable to process callback';
    
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
