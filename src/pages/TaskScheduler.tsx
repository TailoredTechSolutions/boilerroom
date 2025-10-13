import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, CheckSquare, Link as LinkIcon, Users } from "lucide-react";

const TaskScheduler = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">TASK SCHEDULER & CALENDAR SYNC</h2>
              <p className="text-muted-foreground">Personal and team productivity tool integrated with CRM</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Task Management
                  </CardTitle>
                  <CardDescription>
                    Create, assign, and track tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Task interface coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    Calendar Integration
                  </CardTitle>
                  <CardDescription>
                    Two-way sync with Google and Outlook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Calendar sync coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    Daily & Weekly Views
                  </CardTitle>
                  <CardDescription>
                    Digest views for due and overdue tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Calendar views coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Collaboration
                  </CardTitle>
                  <CardDescription>
                    Permission-based visibility and assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Collaboration features coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskScheduler;
