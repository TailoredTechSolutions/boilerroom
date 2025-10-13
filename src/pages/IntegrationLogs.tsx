import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Clock, Database, ArrowRightLeft } from "lucide-react";

const IntegrationLogs = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INTEGRATION LOGS</h2>
              <p className="text-muted-foreground">Data flow tracking and debugging</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Activity Timeline
                  </CardTitle>
                  <CardDescription>
                    Timestamped activity logs for debugging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Activity logs coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    Data Movement
                  </CardTitle>
                  <CardDescription>
                    Track data between CRM, scraper, and AI agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Data flow tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    API Integration Status
                  </CardTitle>
                  <CardDescription>
                    Monitor all external API connections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">API monitoring coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Workflow Verification
                  </CardTitle>
                  <CardDescription>
                    Verify leads aren't vanishing into API purgatory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Verification tools coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IntegrationLogs;
