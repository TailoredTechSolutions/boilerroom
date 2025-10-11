import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Table2, FileJson } from "lucide-react";

const Exports = () => {
  const exportHistory = [
    { id: 1, name: "High Score Entities", format: "CSV", rows: 1234, date: "2024-01-10 14:30", status: "completed" },
    { id: 2, name: "UK Companies", format: "XLSX", rows: 567, date: "2024-01-09 11:20", status: "completed" },
    { id: 3, name: "Full Database", format: "JSON", rows: 5432, date: "2024-01-08 09:15", status: "completed" },
    { id: 4, name: "Active Entities", format: "CSV", rows: 890, date: "2024-01-07 16:45", status: "failed" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Exports</h2>
              <p className="text-muted-foreground">Download and manage your data exports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>CSV Export</CardTitle>
                  <CardDescription>Export as comma-separated values</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Table2 className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Excel Export</CardTitle>
                  <CardDescription>Export as Excel spreadsheet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export XLSX
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <FileJson className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>JSON Export</CardTitle>
                  <CardDescription>Export as JSON format</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Export History</CardTitle>
                <CardDescription>View and download previous exports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {exportHistory.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Download className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{exp.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exp.format} • {exp.rows.toLocaleString()} rows • {exp.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={exp.status === 'completed' ? 'default' : 'destructive'}>
                          {exp.status}
                        </Badge>
                        {exp.status === 'completed' && (
                          <Button size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exports;
