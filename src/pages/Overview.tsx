import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { TopEntitiesList } from "@/components/TopEntitiesList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Activity, TrendingUp, Clock, Target, DollarSign, LineChart } from "lucide-react";
import { useEntities } from "@/hooks/useEntities";
import { useScrapingJobs } from "@/hooks/useScrapingJobs";

const Overview = () => {
  const { entities, isLoading } = useEntities();
  const { jobs, activeJobs } = useScrapingJobs();

  // Calculate KPI metrics
  const totalEntities = entities.length;
  const newEntitiesData = entities.filter(e => {
    const created = new Date(e.created_at);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return created > dayAgo;
  });
  const highScoreTargetsData = entities.filter(e => e.score && e.score >= 80);
  const recentJobs = jobs.slice(0, 5);

  // Get top 5 entities for each category
  const topScoringEntities = [...entities]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  const topNewEntities = [...newEntitiesData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const topHighScoreEntities = [...highScoreTargetsData]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Overview Dashboard</h2>
              <p className="text-muted-foreground">Monitor your entity data and scraping activities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Entities"
                value={totalEntities}
                subtitle="in database"
                icon={Database}
              />
              <KPICard
                title="New (24h)"
                value={newEntitiesData.length}
                subtitle="added today"
                icon={TrendingUp}
                variant="success"
              />
              <KPICard
                title="High Score (80+)"
                value={highScoreTargetsData.length}
                subtitle="quality targets"
                icon={Activity}
                variant="purple"
              />
              <KPICard
                title="Active Jobs"
                value={activeJobs}
                subtitle="currently running"
                icon={Clock}
                variant="warning"
              />
            </div>

            {/* Top Entities Detail Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top Scoring Entities
                  </CardTitle>
                  <CardDescription>
                    Highest quality targets based on all criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopEntitiesList 
                    entities={topScoringEntities}
                    title="Top Scoring"
                    emptyMessage="No entities found"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Newest Entities (24h)
                  </CardTitle>
                  <CardDescription>
                    Recently added companies from scrapers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopEntitiesList 
                    entities={topNewEntities}
                    title="New Entities"
                    emptyMessage="No new entities in the last 24 hours"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Premium Targets (80+)
                  </CardTitle>
                  <CardDescription>
                    High-score entities ready for outreach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopEntitiesList 
                    entities={topHighScoreEntities}
                    title="High Score"
                    emptyMessage="No high-score entities yet"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Scraping Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{job.source}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.records_fetched} records
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                    {recentJobs.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No jobs yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Quality Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Complete Profiles</span>
                        <span className="text-sm font-medium text-foreground">78%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Verified Websites</span>
                        <span className="text-sm font-medium text-foreground">65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Contact Info</span>
                        <span className="text-sm font-medium text-foreground">42%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Feedback & Optimization</h3>
              <p className="text-muted-foreground mb-6">ROI tracking for marketing and CRM workflows</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Campaign Effectiveness
                  </CardTitle>
                  <CardDescription>
                    Which campaigns turned into meetings?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Campaign analytics coming soon...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Registry Performance
                  </CardTitle>
                  <CardDescription>
                    Which registries bring highest-value leads?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Registry comparison coming soon...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    ROI Dashboard
                  </CardTitle>
                  <CardDescription>
                    Track marketing and CRM workflow ROI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">ROI tracking coming soon...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Optimization Insights
                  </CardTitle>
                  <CardDescription>
                    Data-driven recommendations for improvement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Insights engine coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Overview;
