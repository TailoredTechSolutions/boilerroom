import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Globe, Mail } from "lucide-react";

interface Entity {
  id: string;
  legal_name: string;
  country: string;
  score: number;
  registry_source: string;
  website?: string;
  email_contacts?: any;
  created_at: string;
  data_quality_score?: number;
  web_presence_score?: number;
}

interface TopEntitiesListProps {
  entities: Entity[];
  title: string;
  emptyMessage?: string;
  onCompanyClick?: (entity: Entity) => void;
}

export const TopEntitiesList = ({ entities, title, emptyMessage = "No entities to display", onCompanyClick }: TopEntitiesListProps) => {
  if (entities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {entities.map((entity) => (
        <div 
          key={entity.id} 
          className="p-3 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onCompanyClick?.(entity)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {entity.legal_name}
                </h4>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs py-0 h-5">
                  {entity.country}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {entity.registry_source}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center py-2 mb-2 border-y border-border/50">
            <div className="text-xl font-bold text-primary">{entity.score}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>

          {(entity.data_quality_score !== undefined && entity.data_quality_score !== null) || 
           (entity.web_presence_score !== undefined && entity.web_presence_score !== null) ? (
            <div className="space-y-2 mb-2">
              {entity.data_quality_score !== undefined && entity.data_quality_score !== null && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Quality</span>
                    <span className="font-medium text-foreground">{entity.data_quality_score}%</span>
                  </div>
                  <Progress value={entity.data_quality_score} className="h-1" />
                </div>
              )}
              {entity.web_presence_score !== undefined && entity.web_presence_score !== null && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Presence</span>
                    <span className="font-medium text-foreground">{entity.web_presence_score}%</span>
                  </div>
                  <Progress value={entity.web_presence_score} className="h-1" />
                </div>
              )}
            </div>
          ) : null}

          <div className="space-y-1 text-xs text-muted-foreground">
            {entity.website && (
              <div className="flex items-center gap-1 truncate">
                <Globe className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{entity.website}</span>
              </div>
            )}
            {entity.email_contacts && Array.isArray(entity.email_contacts) && entity.email_contacts.length > 0 && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span>{entity.email_contacts.length} contact{entity.email_contacts.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
