import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Activity, Bell, RefreshCw, BarChart } from "lucide-react";

const SystemHealth = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">SYSTEM HEALTH MONITOR</h2>
              <p className="text-muted-foreground">Operational dashboard for system performance and failures</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Uptime & Performance
                  </CardTitle>
                  <CardDescription>
                    Track uptime, latency, and resource usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Performance monitoring coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Alert System
                  </CardTitle>
                  <CardDescription>
                    Email or Slack alerts for issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Alerting system coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Auto-Restart
                  </CardTitle>
                  <CardDescription>
                    Automatic restart of failed jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Auto-restart config coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Historical Logs
                  </CardTitle>
                  <CardDescription>
                    Debug and optimize with historical data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Log history coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SystemHealth;
