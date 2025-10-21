import { X, Users, Mail, Phone, Calendar, DollarSign, TrendingUp, Briefcase, Target, CheckCircle2 } from "lucide-react";
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
  portfolioSize?: string;
  experience?: string;
  interestedSectors?: string[];
  annualIncome?: string;
  capitalAvailable?: string;
  surveyCompleted?: boolean;
  phoneVerified?: boolean;
  subscriptionStatus?: string;
  bestTimeToReach?: string;
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
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            {lead.companyName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex gap-2 flex-wrap">
            <Badge className={getStatusColor(lead.status)}>
              {lead.status}
            </Badge>
            <Badge variant="outline">Score: {lead.score}</Badge>
            {lead.surveyCompleted && (
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Survey Complete
              </Badge>
            )}
            {lead.phoneVerified && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Phone Verified
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Investor Name</span>
              </div>
              <p className="text-foreground font-medium">{lead.contactName}</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">Email</span>
              </div>
              <p className="text-foreground">{lead.email}</p>
            </div>

            {/* Phone */}
            {lead.phone && lead.phone !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-semibold">Phone</span>
                </div>
                <p className="text-foreground">{lead.phone}</p>
              </div>
            )}

            {/* Best Time to Reach */}
            {lead.bestTimeToReach && lead.bestTimeToReach !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Best Time to Reach</span>
                </div>
                <p className="text-foreground">{lead.bestTimeToReach}</p>
              </div>
            )}

            {/* Portfolio Size */}
            {lead.portfolioSize && lead.portfolioSize !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-semibold">Portfolio Size</span>
                </div>
                <p className="text-foreground">{lead.portfolioSize}</p>
              </div>
            )}

            {/* Annual Income */}
            {lead.annualIncome && lead.annualIncome !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-semibold">Annual Income</span>
                </div>
                <p className="text-foreground">{lead.annualIncome}</p>
              </div>
            )}

            {/* Capital Available */}
            {lead.capitalAvailable && lead.capitalAvailable !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-semibold">Capital Available</span>
                </div>
                <p className="text-foreground">{lead.capitalAvailable}</p>
              </div>
            )}

            {/* Experience */}
            {lead.experience && lead.experience !== 'N/A' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-semibold">Investment Experience</span>
                </div>
                <p className="text-foreground">{lead.experience}</p>
              </div>
            )}

            {/* Subscribed Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">Subscribed Date</span>
              </div>
              <p className="text-foreground">{lead.lastContact}</p>
            </div>

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
          </div>

          {/* Interested Sectors */}
          {lead.interestedSectors && lead.interestedSectors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-4 h-4" />
                <span className="text-sm font-semibold">Interested Sectors</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lead.interestedSectors.map((sector, index) => (
                  <Badge key={index} variant="secondary">
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
