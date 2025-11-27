import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsDataArticle {
  article_id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source_id: string;
  source_url?: string;
  source_icon?: string;
  keywords?: string[];
  creator?: string[];
  image_url?: string;
  content?: string;
  country?: string[];
  category?: string[];
  language?: string;
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

interface RequestBody {
  entity_name: string;
  registry_id: string;
  country?: string;
}

// Negative keywords for sentiment analysis
const NEGATIVE_KEYWORDS = [
  "fraud", "lawsuit", "bankruptcy", "scandal", "investigation",
  "allegations", "accused", "charged", "convicted", "penalty",
  "fine", "violation", "misconduct", "illegal", "criminal",
  "embezzlement", "corruption", "bribery", "laundering", "scam",
  "ponzi", "scheme", "collapse", "insolvent", "liquidation"
];

// Calculate sentiment score based on keyword matching
function calculateSentimentScore(text: string): number {
  const lowerText = text.toLowerCase();
  let negativeCount = 0;

  for (const keyword of NEGATIVE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      negativeCount++;
    }
  }

  // Return score from 0 (no negative) to 1 (highly negative)
  // More than 3 negative keywords = 1.0 score
  return Math.min(negativeCount / 3, 1);
}

// Check cache for recent results
async function getCachedResult(supabase: any, entityName: string) {
  const { data, error } = await supabase
    .from("filter_checks")
    .select("*")
    .eq("check_type", "negative_press")
    .ilike("details->>entity_name", entityName)
    .gte("checked_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order("checked_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  return data[0];
}

// Store check result in database
async function storeCheckResult(
  supabase: any,
  entityId: string | null,
  passed: boolean,
  details: any,
  errorMessage: string | null = null
) {
  const { error } = await supabase
    .from("filter_checks")
    .insert({
      entity_id: entityId,
      check_type: "negative_press",
      passed,
      details,
      error_message: errorMessage,
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
    // Validate internal API key to prevent unauthorized access to paid APIs (NewsData.io)
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
      console.warn('Unauthorized request to check-negative-press - invalid or missing token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing API token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { entity_name, registry_id, country }: RequestBody = await req.json();

    if (!entity_name) {
      return new Response(
        JSON.stringify({ error: "entity_name is required" }),
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
    const cachedResult = await getCachedResult(supabase, entity_name);
    if (cachedResult) {
      console.log(`Using cached result for ${entity_name}`);
      return new Response(
        JSON.stringify({
          ...cachedResult.details,
          cached: true,
          cache_age_hours: Math.round(
            (Date.now() - new Date(cachedResult.checked_at).getTime()) / (1000 * 60 * 60)
          ),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Get NewsData.io API key from environment
    const newsDataApiKey = Deno.env.get("NEWSDATA_API_KEY");
    if (!newsDataApiKey) {
      console.error("NEWSDATA_API_KEY not configured");
      await storeCheckResult(supabase, registry_id, false, {
        entity_name,
        error: "NewsData.io API not configured"
      }, "NEWSDATA_API_KEY not configured");

      return new Response(
        JSON.stringify({
          error: "News API not configured",
          has_negative_press: false,
          articles: [],
          sentiment_score: 0,
          checked_at: new Date().toISOString(),
          note: "Unable to verify - skipping check"
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Build search query with negative keywords for NewsData.io
    const searchKeywords = NEGATIVE_KEYWORDS.slice(0, 5).join(" OR ");
    const searchQuery = `"${entity_name}" AND (${searchKeywords})`;

    // Call NewsData.io API
    const newsDataUrl = new URL("https://newsdata.io/api/1/latest");
    newsDataUrl.searchParams.set("apikey", newsDataApiKey);
    newsDataUrl.searchParams.set("q", searchQuery);
    newsDataUrl.searchParams.set("language", "en");
    newsDataUrl.searchParams.set("size", "10");

    console.log(`Searching NewsData.io for: ${entity_name}`);

    const newsResponse = await fetch(newsDataUrl.toString());

    if (!newsResponse.ok) {
      const errorText = await newsResponse.text();
      console.error(`NewsData.io API error: ${newsResponse.status} - ${errorText}`);

      await storeCheckResult(supabase, registry_id, false, {
        entity_name,
        error: `NewsData.io API error: ${newsResponse.status}`
      }, errorText);

      return new Response(
        JSON.stringify({
          error: `NewsData.io API error: ${newsResponse.status}`,
          has_negative_press: false,
          articles: [],
          sentiment_score: 0,
          checked_at: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const newsData: NewsDataResponse = await newsResponse.json();

    // Check if there was an error in the response
    if (newsData.status === "error") {
      console.error(`NewsData.io API error:`, newsData);
      
      await storeCheckResult(supabase, registry_id, false, {
        entity_name,
        error: "NewsData.io API error"
      }, JSON.stringify(newsData));

      return new Response(
        JSON.stringify({
          error: "NewsData.io API error",
          has_negative_press: false,
          articles: [],
          sentiment_score: 0,
          checked_at: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Analyze articles for sentiment
    const articles = (newsData.results || []).map((article) => {
      const combinedText = `${article.title} ${article.description || ""}`;
      const sentimentScore = calculateSentimentScore(combinedText);

      return {
        title: article.title,
        description: article.description,
        url: article.link,
        published_at: article.pubDate,
        source: article.source_id,
        sentiment_score: sentimentScore,
        negative_keywords_found: NEGATIVE_KEYWORDS.filter(kw =>
          combinedText.toLowerCase().includes(kw)
        ),
      };
    });

    // Calculate overall sentiment
    const avgSentiment = articles.length > 0
      ? articles.reduce((sum, a) => sum + a.sentiment_score, 0) / articles.length
      : 0;

    const hasNegativePress = avgSentiment > 0.3 || articles.some(a => a.sentiment_score > 0.5);

    const result = {
      has_negative_press: hasNegativePress,
      articles,
      sentiment_score: avgSentiment,
      total_articles: newsData.totalResults,
      checked_at: new Date().toISOString(),
      entity_name,
      registry_id,
      country,
    };

    // Store result in database
    await storeCheckResult(supabase, registry_id, !hasNegativePress, result);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in check-negative-press:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        has_negative_press: false,
        articles: [],
        sentiment_score: 0,
        checked_at: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
