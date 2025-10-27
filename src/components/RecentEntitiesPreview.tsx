import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Entity {
  id: string;
  legal_name: string;
  country: string;
  registry_source: string;
  score: number;
  created_at: string;
}

export const RecentEntitiesPreview = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, []);

  const fetchRecentEntities = async () => {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('id, legal_name, country, registry_source, score, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

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
    <div className="space-y-3">
      {entities.map((entity) => (
        <div
          key={entity.id}
          className="p-3 border border-border rounded-lg hover:border-primary hover:bg-card/80 transition-all cursor-pointer"
          onClick={() => navigate('/lead-generation')}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-foreground truncate">
                  {entity.legal_name}
                </p>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {entity.country}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Score: {entity.score || 0}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {entity.registry_source}
              </p>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => navigate('/lead-generation')}
        className="w-full text-sm text-primary hover:underline py-2"
      >
        View all entities →
      </button>
    </div>
  );
};
