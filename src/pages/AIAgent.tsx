import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Calendar, Settings, TrendingUp } from "lucide-react";

const AIAgent = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">AI COMMUNICATIONS AGENT PANEL</h2>
              <p className="text-muted-foreground">AI-driven investor relations and communication automation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Interaction Logs
                  </CardTitle>
                  <CardDescription>
                    Chat and voice interaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">AI chat and voice logs coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Meeting Scheduler
                  </CardTitle>
                  <CardDescription>
                    Linked to Google/Outlook calendars
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Meeting scheduling coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Auto-Response Review
                  </CardTitle>
                  <CardDescription>
                    Review and tune AI responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Response tuning interface coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Feedback Metrics
                  </CardTitle>
                  <CardDescription>
                    Conversion rates and satisfaction scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Performance metrics coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAgent;
