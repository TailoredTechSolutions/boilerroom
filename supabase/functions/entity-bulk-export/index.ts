import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { entityIds, actor } = await req.json();

    if (!entityIds || !Array.isArray(entityIds) || entityIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "entityIds array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const actorId = actor || "unknown";

    // Fetch entities
    const { data: entities, error } = await supabaseClient
      .from("entities")
      .select("*")
      .in("id", entityIds);

    if (error || !entities || entities.length === 0) {
      return new Response(
        JSON.stringify({ error: "no entities found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create CSV
    const headers = [
      "id",
      "legal_name",
      "country",
      "registry_source",
      "registry_id",
      "status",
      "score",
      "negative_press_flag",
      "website",
      "email_contacts",
      "officers",
      "address",
      "created_at",
    ];

    const csvRows = entities.map((entity) => [
      entity.id,
      entity.legal_name,
      entity.country,
      entity.registry_source,
      entity.registry_id,
      entity.status || "new",
      entity.score || 0,
      entity.negative_press_flag || false,
      entity.website || "",
      JSON.stringify(entity.email_contacts || []),
      JSON.stringify(entity.officers || []),
      JSON.stringify(entity.address || {}),
      entity.created_at,
    ]);

    const csvData = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    // Update entities to exported status
    await supabaseClient
      .from("entities")
      .update({
        status: "exported",
        exported_at: new Date().toISOString(),
      })
      .in("id", entityIds);

    // Log actions for all entities
    const actions = entityIds.map((id) => ({
      entity_id: id,
      action_type: "export",
      actor: actorId,
    }));

    await supabaseClient.from("company_actions").insert(actions);

    return new Response(csvData, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=export-bulk-${Date.now()}.csv`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
