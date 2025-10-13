import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Search } from "lucide-react";

const Knowledge = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">KNOWLEDGE HUB / WIKI</h2>
              <p className="text-muted-foreground">Internal documentation and team resources</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Process Documentation
                  </CardTitle>
                  <CardDescription>
                    SOPs and workflow documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Documentation editor coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Investor Profiles
                  </CardTitle>
                  <CardDescription>
                    Detailed profiles and relationship notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Profile database coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Knowledge Search
                  </CardTitle>
                  <CardDescription>
                    Full-text search across all documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Search functionality coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Team Resources
                  </CardTitle>
                  <CardDescription>
                    Shared resources and best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Resource library coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Knowledge;
