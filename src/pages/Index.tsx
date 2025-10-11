import { useState } from "react";
import { Database, TrendingUp, CheckCircle, RefreshCw, Download, AlertCircle } from "lucide-react";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { DataSourceGrid } from "@/components/DataSourceGrid";
import { FilterPanel, FilterState } from "@/components/FilterPanel";
import { EntitiesTable, Entity } from "@/components/EntitiesTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const mockEntities: Entity[] = [
  {
    id: "1",
    companyName: "Acme Ventures Ltd",
    registrySource: "Companies House",
    companyNumber: "CH-12345678",
    status: "Active",
    score: 87,
    country: "GB",
    countryFlag: "🇬🇧",
    lastUpdated: "2025-10-10",
  },
  {
    id: "2",
    companyName: "TechGrowth Capital",
    registrySource: "Companies House",
    companyNumber: "CH-87654321",
    status: "Active",
    score: 92,
    country: "GB",
    countryFlag: "🇬🇧",
    lastUpdated: "2025-10-09",
  },
  {
    id: "3",
    companyName: "Innovation Partners LLC",
    registrySource: "GLEIF",
    companyNumber: "LEI-123456789012",
    status: "Active",
    score: 78,
    country: "US",
    countryFlag: "🇺🇸",
    lastUpdated: "2025-10-11",
  },
  {
    id: "4",
    companyName: "Global Equity Fund",
    registrySource: "GLEIF",
    companyNumber: "LEI-987654321098",
    status: "Active",
    score: 85,
    country: "DE",
    countryFlag: "🇩🇪",
    lastUpdated: "2025-10-08",
  },
  {
    id: "5",
    companyName: "Future Ventures Group",
    registrySource: "Companies House",
    companyNumber: "CH-11223344",
    status: "Inactive",
    score: 45,
    country: "GB",
    countryFlag: "🇬🇧",
    lastUpdated: "2025-10-05",
  },
  {
    id: "6",
    companyName: "Digital Capital Partners",
    registrySource: "GLEIF",
    companyNumber: "LEI-555666777888",
    status: "Active",
    score: 89,
    country: "FR",
    countryFlag: "🇫🇷",
    lastUpdated: "2025-10-10",
  },
  {
    id: "7",
    companyName: "NextGen Investment Co",
    registrySource: "Companies House",
    companyNumber: "CH-99887766",
    status: "Active",
    score: 81,
    country: "GB",
    countryFlag: "🇬🇧",
    lastUpdated: "2025-10-09",
  },
  {
    id: "8",
    companyName: "Momentum Capital",
    registrySource: "GLEIF",
    companyNumber: "LEI-444333222111",
    status: "Active",
    score: 94,
    country: "US",
    countryFlag: "🇺🇸",
    lastUpdated: "2025-10-11",
  },
  {
    id: "9",
    companyName: "Strategic Ventures Ltd",
    registrySource: "Companies House",
    companyNumber: "CH-55443322",
    status: "Active",
    score: 76,
    country: "GB",
    countryFlag: "🇬🇧",
    lastUpdated: "2025-10-07",
  },
  {
    id: "10",
    companyName: "Frontier Growth Partners",
    registrySource: "GLEIF",
    companyNumber: "LEI-111222333444",
    status: "Active",
    score: 88,
    country: "DE",
    countryFlag: "🇩🇪",
    lastUpdated: "2025-10-10",
  },
];

const Index = () => {
  const [selectedSource, setSelectedSource] = useState("uk");
  const [activeTab, setActiveTab] = useState("high-score");
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);

  const tabs = [
    { id: "all", label: "All", count: 147 },
    { id: "active", label: "Active Only", count: 132 },
    { id: "high-score", label: "High Score", count: 45 },
    { id: "flagged", label: "Flagged", count: 8 },
  ];

  const handleRunScrape = async () => {
    setIsLoading(true);
    toast.loading("Initiating scrape...");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setEntities(mockEntities);
    setFilteredEntities(mockEntities.filter(e => e.score >= 80));
    setIsLoading(false);
    toast.success("Scrape completed successfully!");
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = entities;

    if (filters.status !== "all") {
      filtered = filtered.filter(
        (e) => e.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.country !== "all") {
      filtered = filtered.filter((e) => e.country === filters.country);
    }

    filtered = filtered.filter(
      (e) => e.score >= filters.scoreRange[0] && e.score <= filters.scoreRange[1]
    );

    setFilteredEntities(filtered);
  };

  const handleDownloadCSV = () => {
    if (filteredEntities.length === 0) {
      toast.error("No data to export");
      return;
    }

    const csv = [
      "Company Name,Registry Source,Company Number,Status,Score,Country,Last Updated",
      ...filteredEntities.map((e) =>
        `"${e.companyName}","${e.registrySource}","${e.companyNumber}","${e.status}",${e.score},"${e.country}","${e.lastUpdated}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entities_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV downloaded successfully!");
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
              value={147}
              subtitle="Across all registries"
              icon={Database}
              variant="default"
            />
            <KPICard
              title="New (24h)"
              value={23}
              subtitle="+12% from yesterday"
              icon={TrendingUp}
              variant="success"
            />
            <KPICard
              title="High Score Targets"
              value={45}
              subtitle="Score > 80"
              icon={CheckCircle}
              variant="purple"
            />
            <KPICard
              title="Active Ingestions"
              value={3}
              subtitle="Running now"
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
              <EntitiesTable entities={filteredEntities} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
