import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, MapPin, Copy, AlertCircle, Edit } from "lucide-react";

const DataNormalization = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">DATA NORMALIZATION & QUALITY DASHBOARD</h2>
              <p className="text-muted-foreground">Quality assurance for consistent data structure and integrity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Field Mapping
                  </CardTitle>
                  <CardDescription>
                    Automated standardization of data fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Field mapping tools coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="w-5 h-5" />
                    Duplicate Detection
                  </CardTitle>
                  <CardDescription>
                    Record merging with approval flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Duplicate management coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Error Reporting
                  </CardTitle>
                  <CardDescription>
                    Anomaly detection with exportable logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Error tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Manual Correction
                  </CardTitle>
                  <CardDescription>
                    Admin panel for fixing mis-parsed data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Correction interface coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataNormalization;
