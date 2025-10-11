import { useState } from "react";
import { Database, TrendingUp, CheckCircle, RefreshCw, Download, AlertCircle } from "lucide-react";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { DataSourceGrid } from "@/components/DataSourceGrid";
import { FilterPanel, FilterState } from "@/components/FilterPanel";
import { EntitiesTable } from "@/components/EntitiesTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEntities } from "@/hooks/useEntities";
import { useScrapingJobs } from "@/hooks/useScrapingJobs";

const Index = () => {
  const [selectedSource, setSelectedSource] = useState("uk");
  const [activeTab, setActiveTab] = useState("high-score");
  const { entities, filteredEntities, isLoading, applyFilters, triggerScrape, exportEntities } = useEntities();
  const { jobs, activeJobs } = useScrapingJobs();
  
  // Calculate stats from real data
  const totalEntities = entities.length;
  const highScoreCount = entities.filter(e => e.score >= 80).length;
  const newLast24h = entities.filter(e => {
    const createdAt = new Date(e.created_at);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return createdAt > yesterday;
  }).length;

  const tabs = [
    { id: "all", label: "All", count: totalEntities },
    { id: "active", label: "Active Only", count: entities.filter(e => e.status === 'Active').length },
    { id: "high-score", label: "High Score", count: highScoreCount },
    { id: "flagged", label: "Flagged", count: 0 },
  ];

  const handleRunScrape = async () => {
    const sourceMap: Record<string, string> = {
      uk: 'COMPANIES_HOUSE',
      gleif: 'GLEIF',
      sec: 'SEC_EDGAR',
      asic: 'ASIC'
    };
    
    await triggerScrape(sourceMap[selectedSource]);
  };

  const handleFilterChange = (filters: FilterState) => {
    applyFilters(filters);
  };

  const handleDownloadCSV = () => {
    const filters: FilterState = {
      status: 'all',
      scoreRange: [0, 100],
      country: 'all'
    };
    exportEntities(filters, 'CSV');
  };

  return (
    <div className="flex min-h-screen bg-gradient-bg">
      <NavigationSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-8 space-y-8">
          {/* Page Title & Tabs */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Entities Explorer</h1>
            
            <div className="flex gap-2 border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium transition-all relative ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <Badge
                    variant="secondary"
                    className="ml-2 text-xs bg-muted text-muted-foreground"
                  >
                    {tab.count}
                  </Badge>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Entities"
              value={totalEntities}
              subtitle="Across all registries"
              icon={Database}
              variant="default"
            />
            <KPICard
              title="New (24h)"
              value={newLast24h}
              subtitle={newLast24h > 0 ? `+${Math.round((newLast24h / totalEntities) * 100)}% growth` : "No new entities"}
              icon={TrendingUp}
              variant="success"
            />
            <KPICard
              title="High Score Targets"
              value={highScoreCount}
              subtitle="Score > 80"
              icon={CheckCircle}
              variant="purple"
            />
            <KPICard
              title="Active Ingestions"
              value={activeJobs}
              subtitle={activeJobs > 0 ? "Running now" : "All complete"}
              icon={RefreshCw}
              variant="warning"
            />
          </div>

          {/* Control Panel */}
          <div className="rounded-xl bg-card border border-border p-6 space-y-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-foreground">Data Source & Scraping</h2>

            <DataSourceGrid
              selectedSource={selectedSource}
              onSelectSource={setSelectedSource}
            />

            <FilterPanel onFilterChange={handleFilterChange} />

            <Alert className="bg-info/10 border-info/50 text-info-foreground">
              <AlertCircle className="h-4 w-4 text-info" />
              <AlertDescription className="text-info-foreground">
                APIs first. Respect rate limits. Client-funded API keys required.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                onClick={handleRunScrape}
                disabled={isLoading}
                className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Scrape
                  </>
                )}
              </Button>
              <Button
                onClick={handleDownloadCSV}
                disabled={filteredEntities.length === 0}
                variant="outline"
                className="border-border hover:bg-muted"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>

          {/* Results Table */}
          {filteredEntities.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Results ({filteredEntities.length})
                </h2>
              </div>
              <EntitiesTable entities={filteredEntities.map(e => ({
                id: e.id,
                companyName: e.legal_name,
                registrySource: e.registry_source,
                companyNumber: e.registry_id,
                status: e.status as "Active" | "Inactive",
                score: e.score,
                country: e.country,
                countryFlag: e.country === 'GB' ? '🇬🇧' : e.country === 'US' ? '🇺🇸' : e.country === 'DE' ? '🇩🇪' : e.country === 'FR' ? '🇫🇷' : '🌍',
                lastUpdated: new Date(e.updated_at).toISOString().split('T')[0]
              }))} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
