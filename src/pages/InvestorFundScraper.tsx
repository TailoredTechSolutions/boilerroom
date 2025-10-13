import { NavigationSidebar } from "@/components/NavigationSidebar";
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
  Phone
} from "lucide-react";

const InvestorFundScraper = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">PitchBook Scraper Suite</h1>
              <p className="text-xl text-muted-foreground">Complete Investor & Fund Intelligence</p>
              <p className="text-lg text-foreground max-w-4xl">
                Access detailed data from 150,000+ funds and 727,000+ investors worldwide with advanced filtering. 
                Complete intelligence for private equity professionals, venture capital investors, fund managers, and analysts.
              </p>
            </div>

            {/* Tabs for Funds vs Investors */}
            <Tabs defaultValue="funds" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="funds">
                  <Database className="w-4 h-4 mr-2" />
                  Funds Scraper
                </TabsTrigger>
                <TabsTrigger value="investors">
                  <Users className="w-4 h-4 mr-2" />
                  Investors Scraper
                </TabsTrigger>
              </TabsList>

              {/* FUNDS SCRAPER TAB */}
              <TabsContent value="funds" className="space-y-12 mt-8">
                {/* Fund Scraper Hero */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">Funds Scraper — Fund Intelligence Made Easy</h2>
                  <div className="flex gap-3">
                    <Button size="lg">
                      <Database className="w-5 h-5 mr-2" />
                      Start Scraping Funds
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
                  <h2 className="text-3xl font-bold text-foreground">Investors Scraper — Investor Intelligence Without the Manual Work</h2>
                  <p className="text-lg text-muted-foreground">
                    Access detailed investor data from 727,000+ investors worldwide. Get comprehensive details including AUM, 
                    investment focus, geographic preferences, contact information, and performance metrics.
                  </p>
                  <div className="flex gap-3">
                    <Button size="lg">
                      <Users className="w-5 h-5 mr-2" />
                      Start Scraping Investors
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
                          <li>• Regions (Africa, Americas, Asia, etc.)</li>
                          <li>• Countries (targeted analysis)</li>
                          <li>• Cities (local analysis)</li>
                          <li>• Preferred Geography</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Investor Characteristics</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Investor Types (30+ options)</li>
                          <li>• Other Investor Types</li>
                          <li>• Investor Status</li>
                          <li>• AUM Ranges (min/max)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Performance Metrics</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Total Investments</li>
                          <li>• Active Portfolio</li>
                          <li>• Total Exits</li>
                          <li>• Investment Professionals Count</li>
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
                        <p className="text-sm text-muted-foreground">20–40 hours/week saved</p>
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
            </Tabs>

            {/* Combined CTA Section */}
            <Card className="bg-gradient-primary/20 border-primary/30 backdrop-blur-sm">
              <CardContent className="py-12 text-center space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Ready to Supercharge Your Research?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Start your next search in seconds and unlock deeper market intelligence — all with zero manual work.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg">
                    <Database className="w-5 h-5 mr-2" />
                    Get Started Now
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
