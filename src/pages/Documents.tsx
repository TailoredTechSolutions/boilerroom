import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderLock, Upload, Shield, Clock } from "lucide-react";

const Documents = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">DOCUMENT VAULT</h2>
              <p className="text-muted-foreground">Secure repository for investor documents and agreements</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Document Upload
                  </CardTitle>
                  <CardDescription>
                    Investor decks, NDAs, agreements, due-diligence files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Upload interface coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Role-Based Access
                  </CardTitle>
                  <CardDescription>
                    Internal vs. investor access controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Access management coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Version Control
                  </CardTitle>
                  <CardDescription>
                    Document versioning and timestamping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Version tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderLock className="w-5 h-5" />
                    CRM Integration
                  </CardTitle>
                  <CardDescription>
                    Link files directly to CRM records
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

export default Documents;
