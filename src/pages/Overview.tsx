import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { TopEntitiesList } from "@/components/TopEntitiesList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Activity, TrendingUp, Clock, Target, DollarSign, LineChart, Building2, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEntities } from "@/hooks/useEntities";
import { useScrapingJobs } from "@/hooks/useScrapingJobs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Overview = () => {
  const navigate = useNavigate();
  const { entities, isLoading } = useEntities();
  const { jobs, activeJobs } = useScrapingJobs();

  // Dummy data for demonstration - New Entities (24h)
  const dummyNewEntities = [
    {
      id: "1",
      legal_name: "TechVision Solutions Ltd",
      country: "United Kingdom",
      score: 87,
      registry_source: "UK Companies House",
      website: "www.techvision-solutions.co.uk",
      email_contacts: { emails: ["contact@techvision-solutions.co.uk"] },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 92,
      web_presence_score: 85
    },
    {
      id: "2",
      legal_name: "Global Finance Partners Inc",
      country: "United States",
      score: 91,
      registry_source: "Delaware Registry",
      website: "www.gfpartners.com",
      email_contacts: { emails: ["info@gfpartners.com", "invest@gfpartners.com"] },
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 95,
      web_presence_score: 88
    },
    {
      id: "3",
      legal_name: "Asia Pacific Holdings",
      country: "Hong Kong",
      score: 83,
      registry_source: "HK ICRIS",
      website: "www.asiapacific-holdings.com",
      email_contacts: { emails: ["contact@asiapacific-holdings.com"] },
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 88,
      web_presence_score: 80
    },
    {
      id: "4",
      legal_name: "Nordic Investment Group AB",
      country: "Sweden",
      score: 89,
      registry_source: "Sweden Registry",
      website: "www.nordic-invest.se",
      email_contacts: { emails: ["invest@nordic-invest.se"] },
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 90,
      web_presence_score: 86
    },
    {
      id: "5",
      legal_name: "Mediterranean Capital SA",
      country: "Spain",
      score: 85,
      registry_source: "Spain Registry",
      website: "www.medcapital.es",
      email_contacts: { emails: ["info@medcapital.es"] },
      created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 87,
      web_presence_score: 83
    }
  ];

  // Dummy data for Premium Targets (80+)
  const dummyPremiumTargets = [
    {
      id: "6",
      legal_name: "Quantum Ventures Capital",
      country: "United States",
      score: 96,
      registry_source: "Delaware Registry",
      website: "www.quantumvc.com",
      email_contacts: { emails: ["partners@quantumvc.com", "invest@quantumvc.com"] },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 98,
      web_presence_score: 95
    },
    {
      id: "7",
      legal_name: "Sterling Private Equity Ltd",
      country: "United Kingdom",
      score: 94,
      registry_source: "UK Companies House",
      website: "www.sterlingpe.co.uk",
      email_contacts: { emails: ["contact@sterlingpe.co.uk", "deals@sterlingpe.co.uk"] },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 96,
      web_presence_score: 92
    },
    {
      id: "8",
      legal_name: "Horizon Investment Partners",
      country: "Singapore",
      score: 92,
      registry_source: "ACRA Singapore",
      website: "www.horizonip.sg",
      email_contacts: { emails: ["invest@horizonip.sg"] },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 94,
      web_presence_score: 90
    },
    {
      id: "9",
      legal_name: "Alpine Capital Management AG",
      country: "Switzerland",
      score: 90,
      registry_source: "Switzerland Registry",
      website: "www.alpinecm.ch",
      email_contacts: { emails: ["info@alpinecm.ch", "partners@alpinecm.ch"] },
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 93,
      web_presence_score: 88
    },
    {
      id: "10",
      legal_name: "Pacific Growth Ventures",
      country: "Australia",
      score: 88,
      registry_source: "ASIC Australia",
      website: "www.pacificgrowth.com.au",
      email_contacts: { emails: ["contact@pacificgrowth.com.au"] },
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      data_quality_score: 91,
      web_presence_score: 85
    }
  ];

  // Dummy data for Recent Scraping Jobs
  const dummyRecentJobs = [
    {
      id: "job-1",
      source: "UK Companies House",
      status: "completed",
      records_fetched: 147,
      records_processed: 147,
      search_term: "investment management",
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      error_message: null
    },
    {
      id: "job-2",
      source: "HK ICRIS",
      status: "running",
      records_fetched: 89,
      records_processed: 73,
      search_term: "venture capital",
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      completed_at: null,
      error_message: null
    },
    {
      id: "job-3",
      source: "Delaware Registry",
      status: "completed",
      records_fetched: 203,
      records_processed: 203,
      search_term: "private equity",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      error_message: null
    },
    {
      id: "job-4",
      source: "GLEIF LEI",
      status: "completed",
      records_fetched: 64,
      records_processed: 64,
      search_term: "asset management",
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
      error_message: null
    },
    {
      id: "job-5",
      source: "Singapore ACRA",
      status: "failed",
      records_fetched: 0,
      records_processed: 0,
      search_term: "hedge fund",
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
      error_message: "API rate limit exceeded"
    }
  ];

  // Calculate KPI metrics
  const totalEntities = entities.length || 2847;
  const newEntitiesData = entities.length > 0 ? entities.filter(e => {
    const created = new Date(e.created_at);
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return created > dayAgo;
  }) : dummyNewEntities;
  
  const highScoreTargetsData = entities.length > 0 ? entities.filter(e => e.score && e.score >= 80) : dummyPremiumTargets;
  const recentJobs = jobs.length > 0 ? jobs.slice(0, 5) : dummyRecentJobs;

  // Get top 5 entities for each category
  const topScoringEntities = entities.length > 0 ? [...entities]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5) : [...dummyPremiumTargets, ...dummyNewEntities].slice(0, 5);

  const topNewEntities = entities.length > 0 ? [...newEntitiesData]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) : dummyNewEntities;

  const topHighScoreEntities = entities.length > 0 ? [...highScoreTargetsData]
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5) : dummyPremiumTargets;

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
              <div onClick={() => navigate('/lead-generation')} className="cursor-pointer transition-transform hover:scale-105">
                <KPICard
                  title="Total Entities"
                  value={totalEntities}
                  subtitle="in database"
                  icon={Database}
                />
              </div>
              <div onClick={() => navigate('/lead-generation?timeframe=24h')} className="cursor-pointer transition-transform hover:scale-105">
                <KPICard
                  title="New (24h)"
                  value={newEntitiesData.length}
                  subtitle="added today"
                  icon={TrendingUp}
                  variant="success"
                />
              </div>
              <div onClick={() => navigate('/lead-generation?score=80')} className="cursor-pointer transition-transform hover:scale-105">
                <KPICard
                  title="High Score (80+)"
                  value={highScoreTargetsData.length}
                  subtitle="quality targets"
                  icon={Activity}
                  variant="purple"
                />
              </div>
              <KPICard
                title="Active Jobs"
                value={activeJobs}
                subtitle="currently running"
                icon={Clock}
                variant="warning"
              />
            </div>

            {/* Top Entities Detail Sections */}
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Scraping Jobs</CardTitle>
                <CardDescription>Latest data collection activities from registries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground">{job.source}</p>
                            <Badge variant={
                              job.status === 'completed' ? 'default' :
                              job.status === 'running' ? 'secondary' :
                              job.status === 'failed' ? 'destructive' : 'outline'
                            }>
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Search: "{job.search_term}"
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Fetched:</span>
                          <span className="ml-2 font-medium text-foreground">{job.records_fetched} records</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Processed:</span>
                          <span className="ml-2 font-medium text-foreground">{job.records_processed} records</span>
                        </div>
                      </div>
                      {job.status === 'running' && (
                        <div className="mt-3">
                          <Progress value={(job.records_processed / Math.max(job.records_fetched, 1)) * 100} className="h-2" />
                        </div>
                      )}
                      {job.error_message && (
                        <div className="mt-2 flex items-start gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4 mt-0.5" />
                          <span>{job.error_message}</span>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        Started: {new Date(job.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Q4 IPO Outreach</p>
                          <p className="text-sm text-muted-foreground">Email Campaign</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">23</p>
                        <p className="text-xs text-muted-foreground">meetings</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">LinkedIn Direct</p>
                          <p className="text-sm text-muted-foreground">Social Campaign</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">17</p>
                        <p className="text-xs text-muted-foreground">meetings</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">PE Fund Intro</p>
                          <p className="text-sm text-muted-foreground">Cold Outreach</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">12</p>
                        <p className="text-xs text-muted-foreground">meetings</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Average Conversion Rate</span>
                        <span className="font-semibold text-foreground">18.4%</span>
                      </div>
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">UK Companies House</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">Score: 94</span>
                      </div>
                      <Progress value={94} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1,247 entities • 87% quality</span>
                        <span>32 conversions</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">Delaware Registry</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">Score: 91</span>
                      </div>
                      <Progress value={91} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>843 entities • 92% quality</span>
                        <span>28 conversions</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">HK ICRIS</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">Score: 88</span>
                      </div>
                      <Progress value={88} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>634 entities • 85% quality</span>
                        <span>19 conversions</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">GLEIF LEI</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">Score: 85</span>
                      </div>
                      <Progress value={85} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>421 entities • 81% quality</span>
                        <span>14 conversions</span>
                      </div>
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
                        <p className="text-2xl font-bold text-foreground">$24,500</p>
                        <p className="text-xs text-muted-foreground mt-1">Last quarter</p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                        <p className="text-2xl font-bold text-primary">$187,200</p>
                        <p className="text-xs text-muted-foreground mt-1">From campaigns</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Overall ROI</span>
                        <Badge variant="default" className="bg-primary">+664%</Badge>
                      </div>
                      <Progress value={100} className="h-3 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        $7.64 returned for every $1 spent
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Email Campaigns</span>
                        <span className="text-sm font-semibold text-foreground">ROI: +723%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">LinkedIn Outreach</span>
                        <span className="text-sm font-semibold text-foreground">ROI: +615%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Cold Calling</span>
                        <span className="text-sm font-semibold text-foreground">ROI: +542%</span>
                      </div>
                    </div>
                  </div>
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
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 border-l-4 border-primary rounded">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Increase UK Focus</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            UK Companies House entities show 23% higher conversion rates. Consider allocating 40% more budget to UK-targeted campaigns.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/10 border-l-4 border-secondary rounded">
                      <div className="flex items-start gap-2">
                        <Clock className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Optimal Timing</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Emails sent Tuesday-Thursday 9-11 AM have 34% higher open rates. Adjust campaign schedules accordingly.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-accent border-l-4 border-primary/50 rounded">
                      <div className="flex items-start gap-2">
                        <Target className="w-5 h-5 text-primary/70 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Refine Targeting</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Entities with web_presence_score above 85 are 2.8x more likely to respond. Update scoring algorithms to prioritize.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-primary/10 border-l-4 border-primary rounded">
                      <div className="flex items-start gap-2">
                        <Activity className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-sm">Follow-up Strategy</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Second follow-up emails after 5 days yield 41% response rate vs. 18% for immediate follow-ups.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
