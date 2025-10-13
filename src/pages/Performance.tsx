import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, AlertCircle, Zap } from "lucide-react";

const Performance = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">PERFORMANCE & MAINTENANCE PANEL</h2>
              <p className="text-muted-foreground">System monitoring and scraper performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    API Status Monitoring
                  </CardTitle>
                  <CardDescription>
                    Real-time API health and response monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Status monitoring coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Error Logs
                  </CardTitle>
                  <CardDescription>
                    System errors, queue stats, and performance insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Error tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Auto-Restart Triggers
                  </CardTitle>
                  <CardDescription>
                    Alerts when scrapers or agents stall
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Auto-restart config coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Data-Sync Health
                  </CardTitle>
                  <CardDescription>
                    Monitor uptime and synchronization status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Sync monitoring coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Performance;
