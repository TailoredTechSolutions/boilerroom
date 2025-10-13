import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Brain, TrendingUp, Flame } from "lucide-react";

const InvestorIntelligence = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INVESTOR INTELLIGENCE DASHBOARD</h2>
              <p className="text-muted-foreground">Advanced analytics on investor behavior and engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Engagement Tracking
                  </CardTitle>
                  <CardDescription>
                    Track which leads engage with outreach and portal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Engagement metrics coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Interest Prediction
                  </CardTitle>
                  <CardDescription>
                    Predict investor interest based on sentiment and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">AI predictions coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    Warm Lead Lists
                  </CardTitle>
                  <CardDescription>
                    Auto-generated lists of high-engagement prospects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Lead lists coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Behavioral Analytics
                  </CardTitle>
                  <CardDescription>
                    Open rates, reply sentiment, meeting frequency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Behavioral insights coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvestorIntelligence;
