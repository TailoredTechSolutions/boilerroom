import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Trello, Percent, DollarSign, TrendingUp } from "lucide-react";

const PipelinePerformance = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">PIPELINE PERFORMANCE DASHBOARD</h2>
              <p className="text-muted-foreground">Analytics view of the sales and investor-acquisition funnel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trello className="w-5 h-5" />
                    Pipeline Visualization
                  </CardTitle>
                  <CardDescription>
                    Kanban and chart views of stages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Pipeline views coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="w-5 h-5" />
                    Conversion Metrics
                  </CardTitle>
                  <CardDescription>
                    Conversion rates and deal velocity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Conversion analytics coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Value Projections
                  </CardTitle>
                  <CardDescription>
                    Revenue forecasts and projections
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Projections coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trend Analysis
                  </CardTitle>
                  <CardDescription>
                    Performance over custom date ranges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Trend charts coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PipelinePerformance;
