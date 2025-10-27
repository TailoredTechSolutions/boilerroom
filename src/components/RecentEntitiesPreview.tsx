import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CompanyDetailView } from "@/components/CompanyDetailView";
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
  negative_press_flag?: boolean;
  last_seen?: string;
  updated_at?: string;
  raw_payload?: any;
}

export const RecentEntitiesPreview = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentEntities();

    // Subscribe to new entities
    const channel = supabase
      .channel('recent-entities')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'entities'
        },
        () => {
          fetchRecentEntities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showAll]);

  const fetchRecentEntities = async () => {
    try {
      setLoading(true);
      const query = supabase
        .from('entities')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Only limit if not showing all
      if (!showAll) {
        query.limit(5);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntities(data || []);
    } catch (error) {
      console.error("Error fetching recent entities:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (entities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No entities yet</p>
        <p className="text-sm mt-2">Run a scrape to see results</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className="p-2.5 border border-border rounded-lg hover:border-primary hover:bg-card/80 transition-all cursor-pointer"
            onClick={() => setSelectedEntity(entity)}
          >
            <div className="space-y-2">
              <div className="flex items-start gap-1.5">
                <p className="font-medium text-sm text-foreground truncate flex-1">
                  {entity.legal_name}
                </p>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {entity.country}
                </Badge>
                <Badge variant="secondary" className="text-xs py-0 h-5">
                  {entity.score || 0}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {entity.registry_source}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full text-sm text-primary hover:underline py-2 font-medium mt-3"
      >
        {showAll ? '← Show less' : 'View all entities →'}
      </button>

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
