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

    const { entityId, action, actor } = await req.json();

    if (!entityId || !action) {
      return new Response(
        JSON.stringify({ error: "entityId and action required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const actorId = actor || "unknown";

    switch (action) {
      case "flag":
        await supabaseClient
          .from("entities")
          .update({
            status: "flagged",
            flagged_by: actorId,
            flagged_at: new Date().toISOString(),
          })
          .eq("id", entityId);

        await supabaseClient.from("company_actions").insert({
          entity_id: entityId,
          action_type: "flag",
          actor: actorId,
        });

        return new Response(
          JSON.stringify({ ok: true, id: entityId }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "dismiss":
        // Fetch entity
        const { data: entity } = await supabaseClient
          .from("entities")
          .select("*")
          .eq("id", entityId)
          .single();

        if (!entity) {
          return new Response(
            JSON.stringify({ error: "entity not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Create canonical name
        const canonicalName = entity.legal_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        // Add to suppression list
        await supabaseClient
          .from("suppression_list")
          .upsert({
            canonical_name: canonicalName,
            reason: `dismissed via UI id:${entityId}`,
            created_by: actorId,
          });

        // Update entity status
        await supabaseClient
          .from("entities")
          .update({
            status: "dismissed",
            dismissed_by: actorId,
            dismissed_at: new Date().toISOString(),
          })
          .eq("id", entityId);

        // Log action
        await supabaseClient.from("company_actions").insert({
          entity_id: entityId,
          action_type: "dismiss",
          actor: actorId,
          metadata: { canonical: canonicalName },
        });

        return new Response(
          JSON.stringify({ ok: true, id: entityId, canonical: canonicalName }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case "export":
        // Fetch entity
        const { data: exportEntity } = await supabaseClient
          .from("entities")
          .select("*")
          .eq("id", entityId)
          .single();

        if (!exportEntity) {
          return new Response(
            JSON.stringify({ error: "entity not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Create CSV
        const csvData = [
          ["id", "legal_name", "country", "registry_source", "status", "score", "negative_press_flag", "website", "created_at"],
          [
            exportEntity.id,
            exportEntity.legal_name,
            exportEntity.country,
            exportEntity.registry_source,
            exportEntity.status || "new",
            exportEntity.score || 0,
            exportEntity.negative_press_flag || false,
            exportEntity.website || "",
            exportEntity.created_at,
          ],
        ]
          .map((row) => row.map((cell) => `"${cell}"`).join(","))
          .join("\n");

        // Update entity
        await supabaseClient
          .from("entities")
          .update({
            status: "exported",
            exported_at: new Date().toISOString(),
          })
          .eq("id", entityId);

        // Log action
        await supabaseClient.from("company_actions").insert({
          entity_id: entityId,
          action_type: "export",
          actor: actorId,
        });

        return new Response(csvData, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename=export-${exportEntity.legal_name.replace(/[^a-z0-9]/gi, "_")}-${entityId}.csv`,
          },
        });

      default:
        return new Response(
          JSON.stringify({ error: "invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
