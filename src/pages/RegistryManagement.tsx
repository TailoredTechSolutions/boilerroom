import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog, Key, Calendar, Activity, Globe } from "lucide-react";

const RegistryManagement = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">REGISTRY MANAGEMENT CONSOLE</h2>
              <p className="text-muted-foreground">Centralized control hub for external data registry integrations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Registry Credentials
                  </CardTitle>
                  <CardDescription>
                    Configure API keys and access tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Credential management coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Scraping Schedules
                  </CardTitle>
                  <CardDescription>
                    Set daily, weekly, or on-demand scraping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Schedule configuration coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Success/Failure Monitoring
                  </CardTitle>
                  <CardDescription>
                    Live logs and data pull metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Monitoring dashboard coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Registry Endpoints
                  </CardTitle>
                  <CardDescription>
                    Add new endpoints without code deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Endpoint management coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistryManagement;
