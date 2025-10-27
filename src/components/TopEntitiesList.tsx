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
    <div className="space-y-3">
      {entities.map((entity) => (
      <div 
          key={entity.id} 
          className="p-4 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                <h4 
                  className="font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onCompanyClick?.(entity)}
                >
                  {entity.legal_name}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {entity.country}
                </span>
                <Badge variant="outline" className="text-xs">
                  {entity.registry_source}
                </Badge>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-2xl font-bold text-primary">{entity.score}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            {entity.data_quality_score !== undefined && entity.data_quality_score !== null && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Data Quality</span>
                  <span className="font-medium text-foreground">{entity.data_quality_score}%</span>
                </div>
                <Progress value={entity.data_quality_score} className="h-1.5" />
              </div>
            )}
            {entity.web_presence_score !== undefined && entity.web_presence_score !== null && (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Web Presence</span>
                  <span className="font-medium text-foreground">{entity.web_presence_score}%</span>
                </div>
                <Progress value={entity.web_presence_score} className="h-1.5" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {entity.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{entity.website}</span>
              </div>
            )}
            {entity.email_contacts && Array.isArray(entity.email_contacts) && entity.email_contacts.length > 0 && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{entity.email_contacts.length} contact{entity.email_contacts.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
