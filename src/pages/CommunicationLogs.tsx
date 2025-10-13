import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesSquare, Smile, Search, Link as LinkIcon } from "lucide-react";

const CommunicationLogs = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INVESTOR COMMUNICATION LOGS</h2>
              <p className="text-muted-foreground">Chronological record of every interaction with investors</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessagesSquare className="w-5 h-5" />
                    Unified Feed
                  </CardTitle>
                  <CardDescription>
                    AI chats, emails, calls, and meeting notes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Communication feed coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="w-5 h-5" />
                    Sentiment Analysis
                  </CardTitle>
                  <CardDescription>
                    Positive / neutral / negative tagging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Sentiment tagging coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Keyword Search
                  </CardTitle>
                  <CardDescription>
                    Search by topic, investor, date, or channel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Search interface coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    CRM Integration
                  </CardTitle>
                  <CardDescription>
                    Direct linkage to records and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">CRM linking coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CommunicationLogs;
