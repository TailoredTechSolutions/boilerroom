import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, RefreshCw, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CompanyDetailView } from "./CompanyDetailView";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Entity {
  id: string;
  legal_name: string;
  country: string;
  registry_source: string;
  registry_id: string;
  status: string;
  score: number;
  created_at: string;
  negative_press_flag?: boolean;
  website?: string;
  email_contacts?: any;
  officers?: any;
  address?: any;
  sic_codes?: string[];
  data_quality_score?: number;
  web_presence_score?: number;
  company_type?: string;
  jurisdiction?: string;
  incorporation_date?: string;
  trading_name?: string;
  psc?: any;
  domain_available?: boolean;
  last_seen?: string;
  updated_at?: string;
  raw_payload?: any;
}

interface LatestScrapedJobsProps {
  limit?: number;
  statusFilter?: string;
}

export const LatestScrapedJobs = ({ limit = 100, statusFilter = "new" }: LatestScrapedJobsProps) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [bulkSelection, setBulkSelection] = useState<Set<string>>(new Set());

  const loadEntities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("entities")
        .select("*")
        .eq("status", statusFilter)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error("Error loading entities:", error);
      toast.error("Failed to load scraped jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();

    // Subscribe to new entities
    const channel = supabase
      .channel("latest-scraped-jobs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "entities",
        },
        () => {
          loadEntities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter, limit]);

  const toggleSelect = (id: string) => {
    const newSelection = new Set(bulkSelection);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setBulkSelection(newSelection);
  };

  const handleAction = async (entityId: string, action: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const actor = user?.id || "unknown";

      if (action === "export") {
        const { data, error } = await supabase.functions.invoke("entity-action", {
          body: { entityId, action, actor },
        });

        if (error) throw error;

        // The function returns CSV data directly
        const blob = new Blob([data], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `export-${entityId}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        toast.success("Entity exported successfully");
      } else {
        const { error } = await supabase.functions.invoke("entity-action", {
          body: { entityId, action, actor },
        });

        if (error) throw error;

        toast.success(
          action === "flag"
            ? "Entity flagged"
            : action === "dismiss"
            ? "Entity dismissed and suppressed"
            : "Action completed"
        );
      }

      await loadEntities();
    } catch (error) {
      console.error("Action error:", error);
      toast.error(`Failed to ${action} entity`);
    }
  };

  const handleBulkExport = async () => {
    if (bulkSelection.size === 0) {
      toast.error("Please select entities to export");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const actor = user?.id || "unknown";

      const { data, error } = await supabase.functions.invoke("entity-bulk-export", {
        body: { entityIds: Array.from(bulkSelection), actor },
      });

      if (error) throw error;

      const blob = new Blob([data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `export-bulk-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${bulkSelection.size} entities`);
      setBulkSelection(new Set());
      await loadEntities();
    } catch (error) {
      console.error("Bulk export error:", error);
      toast.error("Failed to export entities");
    }
  };

  const getStatusColor = (score: number) => {
    if (score > 70) return "destructive";
    if (score > 40) return "secondary";
    return "default";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Latest Scraped Jobs</CardTitle>
            <div className="flex items-center gap-2">
              <Button onClick={loadEntities} variant="outline" size="sm" disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={handleBulkExport}
                variant="secondary"
                size="sm"
                disabled={bulkSelection.size === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Selected ({bulkSelection.size})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && entities.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : entities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No scraped jobs found</p>
              <p className="text-sm mt-2">Run a scrape to see results</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={bulkSelection.has(entity.id)}
                      onCheckedChange={() => toggleSelect(entity.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <button
                            onClick={() => setSelectedEntity(entity)}
                            className="text-sm font-medium hover:text-primary transition-colors text-left"
                          >
                            {entity.legal_name}
                          </button>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {entity.country}
                            </Badge>
                            <Badge variant={getStatusColor(entity.score)} className="text-xs">
                              Score: {entity.score || 0}
                            </Badge>
                            {entity.negative_press_flag && (
                              <Badge variant="destructive" className="text-xs">
                                Negative Press
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {entity.registry_source} • {new Date(entity.created_at).toLocaleString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction(entity.id, "flag")}>
                              Flag
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(entity.id, "export")}>
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(entity.id, "dismiss")}
                              className="text-destructive"
                            >
                              Dismiss
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedEntity} onOpenChange={(open) => !open && setSelectedEntity(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEntity && (
            <CompanyDetailView
              company={selectedEntity}
              onClose={() => setSelectedEntity(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
