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
    const { entity_name, registry_id, entity_id } = await req.json();
    console.log('Checking negative press for:', entity_name);

    const newsApiKey = Deno.env.get('NEWSAPI_KEY');
    
    let has_negative_press = false;
    let articles: any[] = [];
    let sentiment_score = 0;
    let details = {};

    // Only perform API check if NewsAPI key is available
    if (newsApiKey) {
      try {
        // Search for company name in news articles
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q="${entity_name}"&language=en&sortBy=relevancy&pageSize=10`,
          {
            headers: {
              'X-Api-Key': newsApiKey,
            },
          }
        );

        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          articles = newsData.articles || [];

          // Simple negative keyword detection
          const negativeKeywords = [
            'fraud', 'scam', 'lawsuit', 'scandal', 'bankruptcy', 'insolvent',
            'investigation', 'criminal', 'illegal', 'suspended', 'fined',
            'violation', 'breach', 'misconduct', 'controversy', 'accused'
          ];

          // Check articles for negative keywords
          for (const article of articles) {
            const content = `${article.title} ${article.description}`.toLowerCase();
            const negativeCount = negativeKeywords.filter(keyword => 
              content.includes(keyword)
            ).length;

            if (negativeCount > 0) {
              has_negative_press = true;
              sentiment_score += negativeCount;
            }
          }

          // Normalize sentiment score (higher = more negative)
          sentiment_score = articles.length > 0 ? sentiment_score / articles.length : 0;

          details = {
            articles_found: articles.length,
            negative_articles: articles.filter(a => {
              const content = `${a.title} ${a.description}`.toLowerCase();
              return negativeKeywords.some(keyword => content.includes(keyword));
            }).length,
            top_article: articles.length > 0 ? {
              title: articles[0].title,
              url: articles[0].url,
              publishedAt: articles[0].publishedAt
            } : null
          };
        }
      } catch (apiError) {
        console.error('NewsAPI error:', apiError);
        // Don't fail the check, just log and continue with no data
        details = { error: 'NewsAPI request failed', message: String(apiError) };
      }
    } else {
      console.log('NewsAPI key not configured, skipping news check');
      details = { message: 'NewsAPI key not configured' };
    }

    // Store result in filter_checks table if entity_id provided
    if (entity_id) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('filter_checks').insert({
        entity_id,
        check_type: 'negative_press',
        passed: !has_negative_press,
        details: {
          ...details,
          sentiment_score,
          articles_count: articles.length
        }
      });

      // Update entity with news mentions data
      await supabase.from('entities').update({
        news_mentions: {
          has_negative_press,
          sentiment_score,
          articles_found: articles.length,
          last_checked: new Date().toISOString(),
          top_article: articles.length > 0 ? {
            title: articles[0].title,
            url: articles[0].url
          } : null
        }
      }).eq('id', entity_id);
    }

    return new Response(
      JSON.stringify({
        has_negative_press,
        articles,
        sentiment_score,
        passed: !has_negative_press,
        details
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-negative-press:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});