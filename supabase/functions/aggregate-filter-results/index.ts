import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  entity_id: string;
}

interface FilterCheck {
  check_type: string;
  passed: boolean;
  details: any;
  checked_at: string;
  error_message?: string;
}

interface AggregatedResult {
  entity_id: string;
  overall_status: "qualified" | "rejected" | "pending" | "error";
  passed_checks: string[];
  failed_checks: string[];
  filter_notes: string[];
  last_checked: string;
  check_details: { [key: string]: FilterCheck };
  score: number;
}

// Define filter check rules
const FILTER_RULES = {
  active_status: {
    required: true,
    description: "Entity must have active status",
    weight: 10,
  },
  domain_availability: {
    required: true,
    description: "Primary domain must be available",
    weight: 8,
  },
  negative_press: {
    required: true,
    description: "No significant negative press coverage",
    weight: 9,
  },
  online_presence: {
    required: true,
    description: "Minimal online presence (no website/social media)",
    weight: 7,
  },
  website_active: {
    required: false,
    description: "No active website",
    weight: 6,
  },
  linkedin_profile: {
    required: false,
    description: "No LinkedIn company profile",
    weight: 5,
  },
  twitter_profile: {
    required: false,
    description: "No Twitter/X profile",
    weight: 4,
  },
  facebook_profile: {
    required: false,
    description: "No Facebook page",
    weight: 3,
  },
};

// Get latest check results for an entity
async function getLatestChecks(supabase: any, entityId: string): Promise<FilterCheck[]> {
  const { data, error } = await supabase
    .from("filter_checks")
    .select("*")
    .eq("entity_id", entityId)
    .order("checked_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch filter checks:", error);
    return [];
  }

  // Group by check_type and keep only the latest
  const latestChecks = new Map<string, FilterCheck>();

  for (const check of data) {
    if (!latestChecks.has(check.check_type)) {
      latestChecks.set(check.check_type, check);
    }
  }

  return Array.from(latestChecks.values());
}

// Calculate filter score (0-100)
function calculateFilterScore(checks: FilterCheck[]): number {
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const check of checks) {
    const rule = FILTER_RULES[check.check_type as keyof typeof FILTER_RULES];
    if (rule) {
      totalWeight += rule.weight;
      if (check.passed) {
        earnedWeight += rule.weight;
      }
    }
  }

  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

// Determine overall status based on checks
function determineOverallStatus(checks: FilterCheck[]): {
  status: "qualified" | "rejected" | "pending" | "error";
  notes: string[];
} {
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];
  const missingChecks: string[] = [];
  const errorChecks: string[] = [];
  const notes: string[] = [];

  // Check which required checks exist
  const existingCheckTypes = new Set(checks.map((c) => c.check_type));

  for (const [checkType, rule] of Object.entries(FILTER_RULES)) {
    if (rule.required && !existingCheckTypes.has(checkType)) {
      missingChecks.push(checkType);
    }
  }

  // Analyze existing checks
  for (const check of checks) {
    const rule = FILTER_RULES[check.check_type as keyof typeof FILTER_RULES];

    if (check.error_message) {
      errorChecks.push(check.check_type);
      notes.push(`⚠️ ${check.check_type}: Error - ${check.error_message}`);
      continue;
    }

    if (check.passed) {
      passedChecks.push(check.check_type);
      if (rule) {
        notes.push(`✅ ${check.check_type}: ${rule.description}`);
      }
    } else {
      failedChecks.push(check.check_type);
      if (rule) {
        if (rule.required) {
          notes.push(`❌ ${check.check_type}: FAILED - ${rule.description}`);
        } else {
          notes.push(`⚠️ ${check.check_type}: Failed (optional) - ${rule.description}`);
        }
      }
    }
  }

  // Add notes for missing required checks
  for (const missing of missingChecks) {
    const rule = FILTER_RULES[missing as keyof typeof FILTER_RULES];
    notes.push(`❓ ${missing}: MISSING - ${rule.description}`);
  }

  // Determine status
  if (missingChecks.length > 0) {
    return { status: "pending", notes };
  }

  if (errorChecks.length > 0) {
    return { status: "error", notes };
  }

  // Check required filters
  const requiredCheckTypes = Object.entries(FILTER_RULES)
    .filter(([_, rule]) => rule.required)
    .map(([type]) => type);

  const allRequiredPassed = requiredCheckTypes.every((type) =>
    checks.find((c) => c.check_type === type && c.passed)
  );

  if (allRequiredPassed) {
    return { status: "qualified", notes };
  } else {
    return { status: "rejected", notes };
  }
}

// Update entity table with aggregated results
async function updateEntityStatus(
  supabase: any,
  entityId: string,
  result: AggregatedResult
) {
  const { error } = await supabase
    .from("entities")
    .update({
      filter_status: result.overall_status,
      filter_notes: result.filter_notes,
      filter_checked_at: result.last_checked,
    })
    .eq("id", entityId);

  if (error) {
    console.error("Failed to update entity:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ============ SECURITY: Internal API Authentication ============
    // Validate internal API key to prevent unauthorized filter manipulation
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
      console.warn('Unauthorized request to aggregate-filter-results - invalid or missing token');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or missing API token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { entity_id }: RequestBody = await req.json();

    if (!entity_id) {
      return new Response(
        JSON.stringify({ error: "entity_id is required" }),
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

    // Get latest filter checks
    console.log(`Aggregating filter results for entity: ${entity_id}`);
    const checks = await getLatestChecks(supabase, entity_id);

    if (checks.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No filter checks found for this entity",
          entity_id,
          overall_status: "pending",
          passed_checks: [],
          failed_checks: [],
          filter_notes: ["No filter checks have been performed yet"],
          last_checked: null,
          check_details: {},
          score: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Determine overall status
    const { status, notes } = determineOverallStatus(checks);

    // Calculate filter score
    const score = calculateFilterScore(checks);

    // Build check details object
    const checkDetails: { [key: string]: FilterCheck } = {};
    for (const check of checks) {
      checkDetails[check.check_type] = check;
    }

    // Get passed and failed check lists
    const passedChecks = checks
      .filter((c) => c.passed && !c.error_message)
      .map((c) => c.check_type);

    const failedChecks = checks
      .filter((c) => !c.passed || c.error_message)
      .map((c) => c.check_type);

    // Get most recent check timestamp
    const lastChecked = checks.reduce((latest, check) => {
      return new Date(check.checked_at) > new Date(latest)
        ? check.checked_at
        : latest;
    }, checks[0].checked_at);

    // Build result
    const result: AggregatedResult = {
      entity_id,
      overall_status: status,
      passed_checks: passedChecks,
      failed_checks: failedChecks,
      filter_notes: notes,
      last_checked: lastChecked,
      check_details: checkDetails,
      score,
    };

    // Update entity table
    await updateEntityStatus(supabase, entity_id, result);

    console.log(`Entity ${entity_id} status: ${status} (score: ${score})`);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in aggregate-filter-results:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        entity_id: null,
        overall_status: "error",
        passed_checks: [],
        failed_checks: [],
        filter_notes: [`Error: ${errorMessage}`],
        last_checked: new Date().toISOString(),
        check_details: {},
        score: 0,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});