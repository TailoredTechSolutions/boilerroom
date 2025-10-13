import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, Target, DollarSign } from "lucide-react";

const Feedback = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">FEEDBACK & OPTIMIZATION</h2>
              <p className="text-muted-foreground">ROI tracking for marketing and CRM workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Campaign Effectiveness
                  </CardTitle>
                  <CardDescription>
                    Which campaigns turned into meetings?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Campaign analytics coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Registry Performance
                  </CardTitle>
                  <CardDescription>
                    Which registries bring highest-value leads?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Registry comparison coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    ROI Dashboard
                  </CardTitle>
                  <CardDescription>
                    Track marketing and CRM workflow ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">ROI tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Optimization Insights
                  </CardTitle>
                  <CardDescription>
                    Data-driven recommendations for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Insights engine coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Feedback;
