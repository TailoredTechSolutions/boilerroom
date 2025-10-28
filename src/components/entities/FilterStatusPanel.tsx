import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface FilterStatusPanelProps {
  entity: {
    filter_status?: string;
    filter_notes?: string[];
    status?: string;
    domain_available?: boolean;
    news_mentions?: any;
    social_media_presence?: any;
  };
}

export const FilterStatusPanel = ({ entity }: FilterStatusPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'qualified': return 'bg-success text-success-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const getStatusIcon = (passed: boolean, pending: boolean = false) => {
    if (pending) return <Clock className="h-3 w-3" />;
    return passed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />;
  };

  const getCheckColor = (passed: boolean, pending: boolean = false) => {
    if (pending) return 'bg-warning/10 text-warning border-warning/20';
    return passed ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20';
  };

  // Determine individual filter states
  const isActive = entity.status?.toLowerCase() === 'active';
  const domainAvailable = entity.domain_available === true;
  const noNegativePress = !entity.news_mentions?.has_negative_press;
  const noWebsite = !entity.social_media_presence?.website_active;
  const noSocialMedia = entity.social_media_presence?.social_profiles 
    ? !Object.values(entity.social_media_presence.social_profiles).some(v => v)
    : true;

  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Overall Status Badge */}
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(entity.filter_status)}>
              {entity.filter_status || 'Pending'}
            </Badge>
            {entity.filter_status === 'qualified' && (
              <span className="text-xs text-muted-foreground">All filters passed</span>
            )}
          </div>

          {/* Filter Check Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getCheckColor(isActive)}>
              {getStatusIcon(isActive)} Active
            </Badge>
            <Badge variant="outline" className={getCheckColor(noNegativePress, !entity.news_mentions)}>
              {getStatusIcon(noNegativePress, !entity.news_mentions)} No Negative Press
            </Badge>
            <Badge variant="outline" className={getCheckColor(domainAvailable, entity.domain_available === undefined)}>
              {getStatusIcon(domainAvailable, entity.domain_available === undefined)} Domain Available
            </Badge>
            <Badge variant="outline" className={getCheckColor(noWebsite, !entity.social_media_presence)}>
              {getStatusIcon(noWebsite, !entity.social_media_presence)} No Website
            </Badge>
            <Badge variant="outline" className={getCheckColor(noSocialMedia, !entity.social_media_presence)}>
              {getStatusIcon(noSocialMedia, !entity.social_media_presence)} No Social Media
            </Badge>
          </div>

          {/* Expandable Details */}
          {entity.filter_notes && entity.filter_notes.length > 0 && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger className="text-xs text-primary hover:underline">
                {isOpen ? 'Hide' : 'Show'} filter details
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {entity.filter_notes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
};