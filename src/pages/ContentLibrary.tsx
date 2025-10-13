import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, FileText, Tag, TrendingUp, GitCompare } from "lucide-react";

const ContentLibrary = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">MARKETING CONTENT LIBRARY</h2>
              <p className="text-muted-foreground">Structured repository for marketing and investor-relations materials</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Asset Storage
                  </CardTitle>
                  <CardDescription>
                    Documents, images, and campaign materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Asset management coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Content Categorization
                  </CardTitle>
                  <CardDescription>
                    Tag by audience, stage, and region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Tagging system coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Engagement Metrics
                  </CardTitle>
                  <CardDescription>
                    Track usage and performance of assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Metrics tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="w-5 h-5" />
                    Version Management
                  </CardTitle>
                  <CardDescription>
                    Track versions and approval workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Version control coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContentLibrary;
