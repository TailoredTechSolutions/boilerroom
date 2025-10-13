import { useState } from "react";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DataSourceGrid } from "@/components/DataSourceGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ukLogo from "@/assets/uk-companies-house-logo.png";
import gleifLogo from "@/assets/gleif-logo.png";

const DataSources = () => {
  const [selectedSource, setSelectedSource] = useState("uk");

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Data Sources</h2>
              <p className="text-muted-foreground">Manage and configure your registry data sources</p>
            </div>

            <DataSourceGrid selectedSource={selectedSource} onSelectSource={setSelectedSource} />

            <Card>
              <CardHeader>
                <CardTitle>Source Statistics</CardTitle>
                <CardDescription>Overview of data collection from each source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={ukLogo} alt="UK Companies House" className="w-8 h-8 object-contain" />
                      <div>
                        <p className="font-medium text-foreground">UK Companies House</p>
                        <p className="text-sm text-muted-foreground">12,456 entities</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={gleifLogo} alt="GLEIF Global" className="w-8 h-8 object-contain" />
                      <div>
                        <p className="font-medium text-foreground">GLEIF Global</p>
                        <p className="text-sm text-muted-foreground">8,234 entities</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataSources;
