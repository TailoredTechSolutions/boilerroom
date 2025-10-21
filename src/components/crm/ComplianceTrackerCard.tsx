import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const ComplianceTrackerCard = () => {
  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Regulatory & Compliance Status
        </CardTitle>
        <CardDescription>SEC filings, quiet periods, and requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SEC Filings */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            SEC Filings Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-foreground">5 S-1 forms</span>
              </div>
              <Badge className="bg-warning text-warning-foreground">Under Review</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">2 S-1/A amendments</span>
              </div>
              <Badge className="bg-success text-success-foreground">Filed</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-foreground">1 Form 8-K</span>
              </div>
              <Badge className="bg-destructive text-destructive-foreground">Action Required</Badge>
            </div>
          </div>
        </div>

        {/* Quiet Period Monitoring */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Quiet Period Monitoring</h3>
          <div className="p-4 rounded-lg bg-info/10 border border-info/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">GreenEnergy Corp</span>
                <span className="text-info font-medium">18 days remaining</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">DataCloud Systems</span>
                <span className="text-info font-medium">145 days remaining</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">FinTech Innovations</span>
                <span className="text-info font-medium">7 days remaining</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-info/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Research restrictions</span>
                <Badge variant="outline" className="text-info border-info">Active</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Communication compliance</span>
                <span className="text-success font-medium">100% adherence</span>
              </div>
            </div>
          </div>
        </div>

        {/* FINRA/Exchange Requirements */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">FINRA & Exchange Requirements</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <span className="text-sm text-muted-foreground">Member obligations</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">All current</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <span className="text-sm text-muted-foreground">Blue sky filings</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">18 states pending</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
              <span className="text-sm text-muted-foreground">Listing requirements</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">All qualified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Verification */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Document Verification</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Legal opinions</div>
              <div className="text-sm font-medium text-warning">4 pending</div>
            </div>
            <div className="p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Comfort letters</div>
              <div className="text-sm font-medium text-warning">2 in draft</div>
            </div>
            <div className="p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Lock-up agreements</div>
              <div className="text-sm font-medium text-success">15 executed</div>
            </div>
            <div className="p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Pending signatures</div>
              <div className="text-sm font-medium text-warning">3 remaining</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
