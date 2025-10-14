import { X, Building2, Mail, Phone, Calendar, MapPin, TrendingUp, Globe, Database, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Lead {
  id: string;
  companyName: string;
  status: string;
  contactName: string;
  email: string;
  phone: string;
  score: number;
  lastContact: string;
  website?: string;
  jurisdiction?: string;
  registrySource?: string;
  companyType?: string;
  dataQualityScore?: number;
  webPresenceScore?: number;
  emailContactsCount?: number;
  officersCount?: number;
}

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, isOpen, onClose }: LeadDetailModalProps) => {
  if (!lead) return null;

  const getStatusColor = (status: string) => {
    if (status === "Hot") return "bg-destructive/20 text-destructive border-destructive/50";
    if (status === "Warm") return "bg-warning/20 text-warning border-warning/50";
    return "bg-info/20 text-info border-info/50";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {lead.companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex gap-2">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <Badge variant="outline">Score: {lead.score}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Primary Contact</span>
              </div>
              <p className="text-foreground font-medium">{lead.contactName}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">Email ({lead.emailContactsCount || 0} contacts)</span>
              </div>
              <p className="text-foreground">{lead.email}</p>
            </div>

            {/* Website */}
            {lead.website && lead.website !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-semibold">Website</span>
                </div>
                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {lead.website}
                </a>
              </div>
            )}

            {/* Last Seen */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">Last Seen</span>
              </div>
              <p className="text-foreground">{lead.lastContact}</p>
            </div>

            {/* Registry Source */}
            {lead.registrySource && lead.registrySource !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Database className="w-4 h-4" />
                  <span className="text-sm font-semibold">Registry Source</span>
                </div>
                <p className="text-foreground">{lead.registrySource}</p>
              </div>
            )}

            {/* Jurisdiction */}
            {lead.jurisdiction && lead.jurisdiction !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-semibold">Jurisdiction</span>
                </div>
                <p className="text-foreground">{lead.jurisdiction}</p>
              </div>
            )}

            {/* Company Type */}
            {lead.companyType && lead.companyType !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-semibold">Company Type</span>
                </div>
                <p className="text-foreground">{lead.companyType}</p>
              </div>
            )}

            {/* Officers Count */}
            {lead.officersCount !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold">Officers</span>
                </div>
                <p className="text-foreground">{lead.officersCount} registered</p>
              </div>
            )}

            {/* Lead Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Lead Quality Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{lead.score}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary"
                    style={{ width: `${lead.score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Data Quality Score */}
            {lead.dataQualityScore !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Data Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">{Math.round(lead.dataQualityScore)}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary"
                      style={{ width: `${lead.dataQualityScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Web Presence Score */}
            {lead.webPresenceScore !== undefined && lead.webPresenceScore !== null && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-semibold">Web Presence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">{Math.round(lead.webPresenceScore)}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary"
                      style={{ width: `${lead.webPresenceScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
