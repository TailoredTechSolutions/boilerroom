rt { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  CheckCircle,
  Target,
  BarChart3,
  Users,
  Globe,
  Building2,
  LineChart,
  Mail,
  Phone,
  Loader2
} from "lucide-react";
import { useTriggerScrape } from "@/hooks/useTriggerScrape";

const InvestorFundScraper = () => {
  const { triggerScrape, isLoading } = useTriggerScrape();

  const handleStartFundsScrape = async () => {
    await triggerScrape({
      source: 'CH',
      searchTerm: 'venture capital',
      filters: {}
    });
  };

  const handleStartInvestorsScrape = async () => {
    await triggerScrape({
      source: 'CH',
      searchTerm: 'investors',
      filters: {}
    });
  };

  const handleStartCompanyAnalysis = async () => {
    await triggerScrape({
      source: 'CH',
      searchTerm: 'company analysis',
      filters: {}
    });
  };
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Andrews Extras Scraper Suite</h1>
              <p className="text-xl text-muted-foreground">Complete Investor & Fund Intelligence</p>
              <p className="text-lg text-foreground max-w-4xl">
                Access detailed data from 150,000+ funds and 727,000+ investors worldwide with advanced filtering. 
                Complete intelligence for private equity professionals, venture capital investors, fund managers, and analysts.
              </p>
            </div>

            {/* Tabs for Funds vs Investors vs Company Analysis */}
            <Tabs defaultValue="funds" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                <TabsTrigger value="funds">
                  <Database className="w-4 h-4 mr-2" />
                  Funds Scraper
                </TabsTrigger>
                <TabsTrigger value="investors">
                  <Users className="w-4 h-4 mr-2" />
                  Investors Scraper
                </TabsTrigger>
                <TabsTrigger value="company-analysis">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Company Analysis
                </TabsTrigger>
              </TabsList>

              {/* FUNDS SCRAPER TAB */}
              <TabsContent value="funds" className="space-y-12 mt-8">
                {/* Fund Scraper Hero */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">Funds Scraper â Fund Intelligence Made Easy</h2>
                  <div className="flex gap-3">
                    <Button size="lg" onClick={handleStartFundsScrape} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting Scrape...
                        </>
                      ) : (
                        <>
                          <Database className="w-5 h-5 mr-2" />
                          Start Scraping Funds
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline">
                      View Sample Data
                    </Button>
                  </div>
                </div>

                {/* Primary Use Cases - Funds */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Primary Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Fund Research</Badge>
                      <Badge variant="secondary">Competitive Analysis</Badge>
                      <Badge variant="secondary">Market Intelligence</Badge>
                      <Badge variant="secondary">Investment Due Diligence</Badge>
                      <Badge variant="secondary">Portfolio Analysis</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* What It Does - Funds */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">What Does the Funds Scraper Do?</h3>
                  <p className="text-muted-foreground">
                    Access a comprehensive fund database. Get full details including fund name, investor, partners, types, categories, 
                    geographic focus, performance metrics (IRR, DPI, RVPI, TVPI), and 20+ advanced filtering options.
                  </p>
                </div>

                {/* Sample Output - Funds */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Sample Fund Output</CardTitle>
                    <CardDescription>Kleiner Perkins Caufield & Byers VIII</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><span className="font-semibold">Investor:</span> Kleiner Perkins</p>
                        <p><span className="font-semibold">Fund Size:</span> $300M</p>
                        <p><span className="font-semibold">Vintage:</span> 1996</p>
                        <p><span className="font-semibold">Status:</span> Liquidated</p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-semibold">IRR:</span> 286.6%</p>
                        <p><span className="font-semibold">DPI:</span> 16.5x</p>
                        <p><span className="font-semibold">Investments:</span> 34</p>
                        <p><span className="font-semibold">Location:</span> Menlo Park, CA</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing - Funds */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Free Tier</CardTitle>
                      <CardDescription>Up to 100 items per run</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">Get Started Free</Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-primary/10 border-primary backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Paid Tier</CardTitle>
                      <CardDescription>Unlimited data access</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Upgrade Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* INVESTORS SCRAPER TAB */}
              <TabsContent value="investors" className="space-y-12 mt-8">
                {/* Investor Scraper Hero */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">Investors Scraper â Investor Intelligence Without the Manual Work</h2>
                  <p className="text-lg text-muted-foreground">
                    Access detailed investor data from 727,000+ investors worldwide. Get comprehensive details including AUM,
                    investment focus, geographic preferences, contact information, and performance metrics.
                  </p>
                  <div className="flex gap-3">
                    <Button size="lg" onClick={handleStartInvestorsScrape} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting Scrape...
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5 mr-2" />
                          Start Scraping Investors
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline">
                      View Sample Data
                    </Button>
                  </div>
                </div>

                {/* Primary Use Cases - Investors */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Primary Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Investor Research</Badge>
                      <Badge variant="secondary">Competitive Analysis</Badge>
                      <Badge variant="secondary">Market Intelligence</Badge>
                      <Badge variant="secondary">Fundraising</Badge>
                      <Badge variant="secondary">Portfolio Analysis</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* What It Does - Investors */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">What Does the Investors Scraper Do?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Company names and AUM data</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Headquarters location</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Primary and other investor types</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Preferred investment types</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Industry verticals and geography</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Regional distribution</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Contact details: titles, emails, phone</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>Performance metrics</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <span>15+ advanced filtering options</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Advanced Filtering - Investors */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-6 h-6" />
                      Advanced Filtering Capabilities
                    </CardTitle>
                    <CardDescription>
                      Pro Tip: Start with one or two filters, then add more. Example: "United States" + "Venture Capital"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Geography</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>â¢ Regions (Africa, Americas, Asia, etc.)</li>
                          <li>â¢ Countries (targeted analysis)</li>
                          <li>â¢ Cities (local analysis)</li>
                          <li>â¢ Preferred Geography</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Investor Characteristics</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>â¢ Investor Types (30+ options)</li>
                          <li>â¢ Other Investor Types</li>
                          <li>â¢ Investor Status</li>
                          <li>â¢ AUM Ranges (min/max)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Performance Metrics</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>â¢ Total Investments</li>
                          <li>â¢ Active Portfolio</li>
                          <li>â¢ Total Exits</li>
                          <li>â¢ Investment Professionals Count</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Output - Investors */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Sample Investor Output</CardTitle>
                    <CardDescription>Sequoia Capital</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p><span className="font-semibold">AUM:</span> $87,605.48M</p>
                        <p><span className="font-semibold">HQ:</span> Menlo Park, United States</p>
                        <p><span className="font-semibold">Primary Type:</span> Venture Capital</p>
                        <p><span className="font-semibold">Website:</span> sequoiacap.com</p>
                        <p><span className="font-semibold">Status:</span> Actively Seeking New Investments</p>
                      </div>
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>klemchuk@sequoiacap.com</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>+1 (650) 854-3927</span>
                        </p>
                        <p><span className="font-semibold">Total Investments:</span> 2,851</p>
                        <p><span className="font-semibold">Active Portfolio:</span> 879</p>
                        <p><span className="font-semibold">Total Exits:</span> 921</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm"><span className="font-semibold">Preferred Investment Types:</span> Early Stage VC, Later Stage VC, PE Growth/Expansion, Seed Round</p>
                      <p className="text-sm mt-2"><span className="font-semibold">Preferred Geography:</span> China, Europe, India, Israel, South America, United States</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Use - Investors */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Why Use PitchBook Investors Scraper?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <Database className="w-10 h-10 text-primary mb-3" />
                        <h4 className="font-semibold text-foreground mb-2">Comprehensive Database</h4>
                        <p className="text-sm text-muted-foreground">727,000+ investors globally</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <Mail className="w-10 h-10 text-primary mb-3" />
                        <h4 className="font-semibold text-foreground mb-2">Contact Information</h4>
                        <p className="text-sm text-muted-foreground">Emails, phone numbers, titles</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <LineChart className="w-10 h-10 text-primary mb-3" />
                        <h4 className="font-semibold text-foreground mb-2">Performance Metrics</h4>
                        <p className="text-sm text-muted-foreground">AUM, investments, exits data</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <Clock className="w-10 h-10 text-primary mb-3" />
                        <h4 className="font-semibold text-foreground mb-2">Time Savings</h4>
                        <p className="text-sm text-muted-foreground">20â40 hours/week saved</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Pricing - Investors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Free Tier</CardTitle>
                      <CardDescription>100 items per run</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-3xl font-bold text-foreground">$0</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>All filtering options included</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Specify maxItems (required)</span>
                        </li>
                      </ul>
                      <Button className="w-full" variant="outline">Get Started Free</Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-primary/10 border-primary backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Paid Tier</CardTitle>
                      <CardDescription>Unlimited access</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-3xl font-bold text-foreground">Custom</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Unlimited processing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>Premium performance</span>
                        </li>
                      </ul>
                      <Button className="w-full">Upgrade Now</Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Business Use Cases - Investors */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Business Use Cases</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Private Equity Professionals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Identify acquisition targets, conduct competitive analysis, track market trends</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Venture Capital Investors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Find co-investment opportunities, analyze performance by sector and geography</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Business Development Teams</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Build prospect lists for fundraising, identify partnership opportunities</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Investment Analysts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Due diligence on managers, analyze performance and track records</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* COMPANY ANALYSIS AGENT TAB */}
              <TabsContent value="company-analysis" className="space-y-12 mt-8">
                {/* Company Analysis Hero */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">Company Analysis Agent</h2>
                  <p className="text-lg text-muted-foreground">
                    Comprehensive company research and analysis by aggregating data from LinkedIn, PitchBook, and Crunchbase
                  </p>
                  <div className="flex gap-3">
                    <Button size="lg" onClick={handleStartCompanyAnalysis} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Starting Analysis...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-5 h-5 mr-2" />
                          Start Analysis
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline">
                      View Sample Report
                    </Button>
                  </div>
                </div>

                {/* Overview */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The Company Analysis Agent performs comprehensive company research by aggregating data from multiple authoritative sources. 
                      It collects detailed information about company profiles, financials, key personnel, market presence, investments, competitors, 
                      and recent developments. The consolidated data provides valuable insights for business intelligence, market research, 
                      competitive analysis, and investment decision-making.
                    </p>
                  </CardContent>
                </Card>

                {/* Key Features */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6 space-y-2">
                        <Building2 className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-foreground">Company Profiles</h4>
                        <p className="text-sm text-muted-foreground">
                          Detailed information on operations, products, and services
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6 space-y-2">
                        <DollarSign className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-foreground">Financial Metrics</h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time stock data, revenue, and funding history
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6 space-y-2">
                        <Target className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-foreground">Competitive Intelligence</h4>
                        <p className="text-sm text-muted-foreground">
                          Competitors, market positioning, and industry analysis
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6 space-y-2">
                        <Globe className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-foreground">Social Media Presence</h4>
                        <p className="text-sm text-muted-foreground">
                          Engagement metrics across major platforms
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6 space-y-2">
                        <TrendingUp className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-foreground">Recent News</h4>
                        <p className="text-sm text-muted-foreground">
                          Developments and news affecting the company
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card/70 border-border backdrop-blur-sm">
                      <CardContent className="pt-6 space-y-2">
                        <LineChart className="w-8 h-8 text-primary mb-2" />
                        <h4 className="font-semibold text-foreground">Summary Reports</h4>
                        <p className="text-sm text-muted-foreground">
                          Generated reports with key insights and analysis
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Usage Scenarios */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Usage Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>Due diligence research for mergers, acquisitions, and investments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>Competitive analysis and market intelligence gathering</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>Lead generation and business development prospecting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>Investment research and analysis for financial institutions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>Industry and market trend analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span>Recruitment and talent acquisition research</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Output Fields */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Output Fields</h3>
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p><span className="font-semibold">domain:</span> Company domain name</p>
                          <p><span className="font-semibold">recent_news:</span> Latest news articles</p>
                          <p><span className="font-semibold">linkedin_data:</span> LinkedIn profile data</p>
                          <p><span className="font-semibold">pitchbook_data:</span> Investment data</p>
                          <p><span className="font-semibold">funding_analysis:</span> Funding trends</p>
                        </div>
                        <div className="space-y-2">
                          <p><span className="font-semibold">generated_report:</span> Markdown report</p>
                          <p><span className="font-semibold">data_collection_date:</span> Timestamp</p>
                          <p><span className="font-semibold">linkedin_url:</span> LinkedIn profile URL</p>
                          <p><span className="font-semibold">pitchbook_url:</span> PitchBook profile URL</p>
                          <p><span className="font-semibold">crunchbase_url:</span> Crunchbase URL</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Architecture */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>System Architecture</CardTitle>
                    <CardDescription>The system uses CrewAI to coordinate three specialized agents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">Research Specialist</h4>
                        <p className="text-sm text-muted-foreground">Gathers company information using custom tools</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">Data Analyst</h4>
                        <p className="text-sm text-muted-foreground">Processes and analyzes the collected data</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">Report Writer</h4>
                        <p className="text-sm text-muted-foreground">Compiles findings into structured reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Prerequisites */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Python 3.8 or later</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Apify account and API token</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Google API key for Gemini model</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Sample Output */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">Sample Output</h3>
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Apify Company Report - Sample</CardTitle>
                      <CardDescription>Example of comprehensive company analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">1. Overview and Core Business</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>â¢ Description and mission statement</li>
                          <li>â¢ Founded date and headquarters location</li>
                          <li>â¢ Industry and core business operations</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">2. Products and Services</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>â¢ Platform details and key offerings</li>
                          <li>â¢ Pre-built solutions and tools</li>
                          <li>â¢ Technology stack and infrastructure</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">3. Market Presence and Performance</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>â¢ Target audience and market positioning</li>
                          <li>â¢ Website traffic and growth metrics</li>
                          <li>â¢ Competitor landscape analysis</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">4. Key Personnel and Organization</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>â¢ Employee count and company type</li>
                          <li>â¢ Leadership team and key personnel</li>
                          <li>â¢ Organizational structure</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">5. Financial Metrics and Funding</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                          <li>â¢ Total funding raised and funding rounds</li>
                          <li>â¢ Investor information</li>
                          <li>â¢ Patents and trademarks</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* How to Use */}
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>How to Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">In Python:</h4>
                        <div className="bg-muted/50 p-4 rounded-lg text-sm font-mono">
                          <p>from apify_client import ApifyClient</p>
                          <p>client = ApifyClient(&quot;YOUR_API_TOKEN&quot;)</p>
                          <p>result = research_crew.crew().kickoff(</p>
                          <p className="ml-4">inputs=&#123;&quot;domain&quot;: &quot;apple.com&quot;&#125;</p>
                          <p>)</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Via Web Interface:</h4>
                        <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                          <li>1. Visit Apify</li>
                          <li>2. Click "Try for Free"</li>
                          <li>3. Enter a company domain</li>
                          <li>4. Click "Start"</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Output Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Comprehensive Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Company overview</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Products and services</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Market presence</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Financial metrics</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Structured Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>LinkedIn profile data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>PitchBook investment data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Crunchbase company data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>Recent news articles</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Combined CTA Section */}
            <Card className="bg-gradient-primary/20 border-primary/30 backdrop-blur-sm">
              <CardContent className="py-12 text-center space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Ready to Supercharge Your Research?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Start your next search in seconds and unlock deeper market intelligence â all with zero manual work.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={handleStartFundsScrape} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Database className="w-5 h-5 mr-2" />
                        Get Started Now
                      </>
                    )}
                  </Button>
                  <Button size="lg" variant="outline">
                    View Documentation
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground italic pt-4">
                  Pro Tip: Combine both scrapers for complete investor and fund intelligence.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvestorFundScraper;
