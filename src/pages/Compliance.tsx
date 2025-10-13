import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, FileCheck, AlertTriangle, Download } from "lucide-react";

const Compliance = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">COMPLIANCE & AUDIT CENTER</h2>
              <p className="text-muted-foreground">Legal and regulatory audit tracking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    API Call Tracking
                  </CardTitle>
                  <CardDescription>
                    Every API call, data update, and user edit logged
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Audit trail coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Compliance Risk Flags
                  </CardTitle>
                  <CardDescription>
                    Auto-flags expired filings and sanctions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Risk monitoring coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Audit Log Export
                  </CardTitle>
                  <CardDescription>
                    Exportable logs for SEC/GDPR reviews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Export functionality coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Regulatory Status
                  </CardTitle>
                  <CardDescription>
                    Real-time compliance status dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Status dashboard coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Compliance;
