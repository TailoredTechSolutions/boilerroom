import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Score a single article for negative sentiment
async function scoreArticle(companyName: string, articleUrl: string, text?: string): Promise<{
  companyName: string;
  articleUrl: string;
  negative_score: number;
  error?: string;
}> {
  const hfApiKey = Deno.env.get("HUGGINGFACE_API_KEY");
  
  if (!hfApiKey) {
    return {
      companyName,
      articleUrl,
      negative_score: 0,
      error: "HuggingFace API key not configured",
    };
  }

  try {
    // If text not provided, fetch the article (basic scraping)
    let articleText = text;
    
    if (!articleText) {
      try {
        const response = await fetch(articleUrl);
        if (response.ok) {
          const html = await response.text();
          // Extract text from HTML (very basic, just get first 1000 chars)
          articleText = html
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 1000);
        }
      } catch (fetchError) {
        console.error("Failed to fetch article:", fetchError);
      }
    }

    if (!articleText || articleText.length < 50) {
      return {
        companyName,
        articleUrl,
        negative_score: 0,
        error: "Insufficient article text",
      };
    }

    // Call HuggingFace zero-shot classification
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: articleText.slice(0, 500),
          parameters: {
            candidate_labels: [
              "lawsuit",
              "fraud",
              "bankruptcy",
              "scandal",
              "regulatory fine",
              "data breach",
              "criminal charges",
              "product recall",
              "negative news",
            ],
          },
        }),
      }
    );

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return {
        companyName,
        articleUrl,
        negative_score: 0,
        error: `HuggingFace API error: ${errorText}`,
      };
    }

    const hfData = await hfResponse.json();
    const maxNegativeScore = Math.max(...(hfData.scores || [0]));

    return {
      companyName,
      articleUrl,
      negative_score: maxNegativeScore,
    };
  } catch (error) {
    console.error("Article scoring error:", error);
    return {
      companyName,
      articleUrl,
      negative_score: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyName, articleUrl, articleText } = await req.json();

    if (!companyName || !articleUrl) {
      return new Response(
        JSON.stringify({ error: "companyName and articleUrl are required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Scoring article for ${companyName}: ${articleUrl}`);

    const result = await scoreArticle(companyName, articleUrl, articleText);

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in score-article function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
