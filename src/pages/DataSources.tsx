import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DataSourceGrid } from "@/components/DataSourceGrid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Play, ChevronRight } from "lucide-react";
import ukLogo from "@/assets/uk-companies-house-logo.png";
import gleifLogo from "@/assets/gleif-logo.png";

const DataSources = () => {
  const [selectedSource, setSelectedSource] = useState("CH");
  const [searchTerm, setSearchTerm] = useState("venture capital");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRunScrape = async () => {
    if (!searchTerm.trim()) {
      toast({
        variant: "destructive",
        title: "Search term required",
        description: "Please enter a search term to scrape",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering scrape for:", { source: selectedSource, searchTerm });

    try {
      const { data, error } = await supabase.functions.invoke("trigger-scrape", {
        body: {
          source: selectedSource,
          searchTerm: searchTerm,
          filters: {},
        },
      });

      if (error) throw error;

      toast({
        title: "Scraping job started",
        description: `Job ${data.jobId} has been queued for processing`,
      });

      console.log("Scraping job created:", data);
    } catch (error: any) {
      console.error("Error triggering scrape:", error);
      toast({
        variant: "destructive",
        title: "Failed to start scraping",
        description: error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Data Sources</h2>
              <p className="text-muted-foreground">Manage and configure your registry data sources</p>
            </div>

            <DataSourceGrid selectedSource={selectedSource} onSelectSource={setSelectedSource} />

            <Card>
              <CardHeader>
                <CardTitle>Scraping Configuration</CardTitle>
                <CardDescription>Configure and run scraping jobs for the selected data source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="searchTerm">Search Term</Label>
                  <Input
                    id="searchTerm"
                    placeholder="e.g., venture capital, private equity"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter keywords to search for companies in the selected registry
                  </p>
                </div>
                <Button 
                  onClick={handleRunScrape} 
                  disabled={isLoading || !selectedSource}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Running Scrape...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Scrape
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Statistics</CardTitle>
                <CardDescription>Overview of data collection from each source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/lead-generation?source=COMPANIES_HOUSE')}
                    className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary hover:bg-card/80 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={ukLogo} alt="UK Companies House" className="w-8 h-8 object-contain" />
                      <div>
                        <p className="font-medium text-foreground">UK Companies House</p>
                        <p className="text-sm text-muted-foreground">12,456 entities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Active</Badge>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                  <button
                    onClick={() => navigate('/lead-generation?source=GLEIF')}
                    className="w-full flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary hover:bg-card/80 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={gleifLogo} alt="GLEIF Global" className="w-8 h-8 object-contain" />
                      <div>
                        <p className="font-medium text-foreground">GLEIF Global</p>
                        <p className="text-sm text-muted-foreground">8,234 entities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>Active</Badge>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataSources;
