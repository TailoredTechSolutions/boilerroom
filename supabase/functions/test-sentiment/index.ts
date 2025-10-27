import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SERPAPI_KEY = Deno.env.get('SERPAPI_API_KEY');
const HUGGINGFACE_API_KEY = Deno.env.get('HUGGINGFACE_API_KEY');

interface SentimentResult {
  companyName: string;
  hasNegativePress: boolean;
  negativeScore: number;
  articles: Array<{
    title: string;
    url: string;
    score: number;
    snippet: string;
  }>;
  threshold: number;
  wouldBlock: boolean;
}

async function analyzeNewsSentiment(companyName: string): Promise<SentimentResult> {
  const threshold = parseFloat(Deno.env.get('NEGATIVE_THRESHOLD') || '0.60');
  
  try {
    if (!SERPAPI_KEY) {
      return {
        companyName,
        hasNegativePress: false,
        negativeScore: 0,
        articles: [],
        threshold,
        wouldBlock: false,
      };
    }

    const newsUrl = `https://serpapi.com/search.json?engine=google_news&q=${encodeURIComponent(companyName)}&api_key=${SERPAPI_KEY}`;
    
    const newsResponse = await fetch(newsUrl, { signal: AbortSignal.timeout(10000) });
    if (!newsResponse.ok) {
      throw new Error(`SerpAPI request failed: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    const articles = (newsData.news_results || []).map((item: any) => ({
      title: item.title || '',
      description: item.snippet || '',
      url: item.link || '',
    }));

    if (articles.length === 0) {
      return {
        companyName,
        hasNegativePress: false,
        negativeScore: 0,
        articles: [],
        threshold,
        wouldBlock: false,
      };
    }

    // Analyze sentiment for each article
    const scoredArticles = [];
    
    for (const article of articles.slice(0, 10)) {
      try {
        const text = `${article.title}. ${article.description}`;
        
        if (!HUGGINGFACE_API_KEY) {
          scoredArticles.push({
            title: article.title,
            url: article.url,
            score: 0,
            snippet: article.description,
          });
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
          
          scoredArticles.push({
            title: article.title,
            url: article.url,
            score: maxScore,
            snippet: article.description,
          });
        }
      } catch (error) {
        console.error('Error scoring article:', error);
      }
    }

    // Find highest negative score
    const maxNegativeScore = scoredArticles.length > 0
      ? Math.max(...scoredArticles.map(a => a.score))
      : 0;

    const hasNegativePress = maxNegativeScore >= threshold;

    return {
      companyName,
      hasNegativePress,
      negativeScore: maxNegativeScore,
      articles: scoredArticles.sort((a, b) => b.score - a.score),
      threshold,
      wouldBlock: hasNegativePress,
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      companyName,
      hasNegativePress: false,
      negativeScore: 0,
      articles: [],
      threshold,
      wouldBlock: false,
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: 'companyName is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Testing sentiment for:', companyName);
    const result = await analyzeNewsSentiment(companyName);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in test-sentiment function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});