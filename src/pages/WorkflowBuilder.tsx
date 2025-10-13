import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge, Zap, Clock, FileCode, Bug } from "lucide-react";

const WorkflowBuilder = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">WORKFLOW AUTOMATION BUILDER</h2>
              <p className="text-muted-foreground">Visual drag-and-drop builder for process automation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Automation Triggers
                  </CardTitle>
                  <CardDescription>
                    Lead creation, AI interaction, campaign events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Trigger builder coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitMerge className="w-5 h-5" />
                    Conditional Logic
                  </CardTitle>
                  <CardDescription>
                    If/then rules and branching workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Logic builder coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Schedule & Delays
                  </CardTitle>
                  <CardDescription>
                    Follow-ups and email sequences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Scheduler coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Template Library
                  </CardTitle>
                  <CardDescription>
                    Prebuilt automation templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Templates coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5" />
                    Debug & Logs
                  </CardTitle>
                  <CardDescription>
                    Real-time run logs and error debugging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Debug tools coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
