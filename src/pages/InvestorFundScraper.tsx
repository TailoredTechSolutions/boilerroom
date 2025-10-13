import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  LineChart
} from "lucide-react";

const InvestorFundScraper = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">PitchBook Funds Scraper</h1>
              <p className="text-xl text-muted-foreground">Fund Intelligence Made Easy</p>
              <p className="text-lg text-foreground max-w-4xl">
                Access detailed fund data from 150,000+ funds worldwide with advanced filtering. Ideal for private equity professionals, venture capital investors, fund managers, market researchers, investment analysts, and business development teams.
              </p>
              <div className="flex gap-3 pt-4">
                <Button size="lg">
                  <Database className="w-5 h-5 mr-2" />
                  Start Scraping
                </Button>
                <Button size="lg" variant="outline">
                  View Sample Data
                </Button>
              </div>
            </div>

            {/* Primary Use Cases */}
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

            {/* Investor Contact Info Promo */}
            <Card className="bg-gradient-primary/10 border-primary/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Need Investor Contact Information?
                </CardTitle>
                <CardDescription>
                  Try our PitchBook Investors Scraper for complete investor intelligence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Investor emails, phone numbers, and LinkedIn profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Decision-maker details (partners, principals, associates)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Investment preferences and focus areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Portfolio company connections and deal history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Firm hierarchy and key personnel</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  Perfect for outreach campaigns, fundraising, partnerships, and building your investor network. 
                  Combine both scrapers for complete market intelligence: funds data + contact information.
                </p>
              </CardContent>
            </Card>

            {/* What It Does */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">What Does the PitchBook Funds Scraper Do?</h2>
              <p className="text-lg text-muted-foreground">
                Access a comprehensive fund database for both market analysis and targeted research. Get full details including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Fund name, investor, fund partners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Fund types, categories, preferred investment types</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Industry verticals and sector focus</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Geographic focus (region, country, city)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Headquarters location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Fund status, vintage, size</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Performance metrics: IRR, DPI, RVPI, TVPI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Investment counts and dry powder</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Advanced filtering: 20+ options</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Advanced Filtering */}
            <Card className="bg-card/70 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-6 h-6" />
                  Advanced Filtering Capabilities
                </CardTitle>
                <CardDescription>
                  Combine filters for laser-focused results, such as Early Stage VC funds in TMT sector, in San Francisco
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Geography
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Regions (Africa, Americas, Asia, Europe)</li>
                      <li>• Countries & Cities (3,800+ locations)</li>
                      <li>• Preferred Geography (350+ regions)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Fund Characteristics
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Fund Types (40+ options)</li>
                      <li>• Fund Categories (PE, VC, etc.)</li>
                      <li>• Fund Size Groups ($0–99M to $5B+)</li>
                      <li>• Fund Status (Open, Closed, etc.)</li>
                      <li>• Vintage Years (1916–2024)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Investment Focus
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Preferred Investment Types</li>
                      <li>• Preferred Verticals (TMT, Healthcare)</li>
                      <li>• Preferred Industry (Software, Biotech)</li>
                      <li>• Performance Metrics (IRR, DPI, TVPI)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Output */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Sample Output</h2>
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Kleiner Perkins Caufield & Byers VIII</CardTitle>
                  <CardDescription>Example fund data output</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><span className="font-semibold">Investor:</span> Kleiner Perkins</p>
                      <p><span className="font-semibold">Fund Type:</span> Venture - General</p>
                      <p><span className="font-semibold">Fund Category:</span> Venture Capital</p>
                      <p><span className="font-semibold">Fund Size:</span> $300M</p>
                      <p><span className="font-semibold">Vintage:</span> 1996</p>
                      <p><span className="font-semibold">Location:</span> Menlo Park, CA</p>
                      <p><span className="font-semibold">Status:</span> Liquidated</p>
                    </div>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Investments:</span> 34</p>
                      <p><span className="font-semibold">IRR:</span> 286.6%</p>
                      <p><span className="font-semibold">DPI:</span> 16.5x</p>
                      <p><span className="font-semibold">RVPI:</span> 0.5x</p>
                      <p><span className="font-semibold">TVPI:</span> 17.0x</p>
                      <p><span className="font-semibold">Preferred Verticals:</span> TMT</p>
                      <p><span className="font-semibold">Preferred Industry:</span> Software</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm"><span className="font-semibold">Preferred Investment Types:</span> Angel, Early Stage VC, Later Stage VC, M&A, Seed Round</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Preferred Geography:</span> Canada, United States</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Download Formats */}
            <Card className="bg-card/70 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-6 h-6" />
                  Download Formats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">CSV, Excel, or JSON — ready for use in your favorite analytics tools.</p>
              </CardContent>
            </Card>

            {/* Why Use */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Why Use PitchBook Funds Scraper?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <Database className="w-10 h-10 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Comprehensive Database</h3>
                    <p className="text-sm text-muted-foreground">150,000+ funds with global coverage</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <Filter className="w-10 h-10 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Advanced Filtering</h3>
                    <p className="text-sm text-muted-foreground">20+ filter options for precision targeting</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <LineChart className="w-10 h-10 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Performance Metrics</h3>
                    <p className="text-sm text-muted-foreground">IRR, DPI, RVPI, TVPI for in-depth analysis</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <Clock className="w-10 h-10 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Time Savings</h3>
                    <p className="text-sm text-muted-foreground">20–40 hours/week vs manual research</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Pricing and Usage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Free Tier</CardTitle>
                    <CardDescription>Perfect for getting started</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-3xl font-bold text-foreground">$0</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>Up to 100 items per run</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>All filters available</span>
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
                    <CardDescription>For unlimited access</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-3xl font-bold text-foreground">Custom</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>Unlimited data access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>maxItems optional (defaults to unlimited)</span>
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
            </div>

            {/* How to Use */}
            <Card className="bg-card/70 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
                <CardDescription>Get started in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sign up for Apify</h4>
                      <p className="text-sm text-muted-foreground">Free account in 2 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Find the PitchBook Funds Scraper</h4>
                      <p className="text-sm text-muted-foreground">Locate it in the Apify store</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Set filters in the input form</h4>
                      <p className="text-sm text-muted-foreground">Choose your targeting criteria</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Set maxItems</h4>
                      <p className="text-sm text-muted-foreground">Required for free tier</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">5</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Click Start</h4>
                      <p className="text-sm text-muted-foreground">Let the scraper do its magic</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">6</div>
                    <div>
                      <h4 className="font-semibold text-foreground">Download results</h4>
                      <p className="text-sm text-muted-foreground">CSV, Excel, or JSON format</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Typical setup:</span> 3 minutes • 
                    <span className="font-semibold text-foreground ml-2">Data collection:</span> 2–5 minutes per run • 
                    <span className="font-semibold text-foreground ml-2">Skills required:</span> None
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Business Use Cases */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Business Use Cases</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Private Equity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Sourcing, competitive analysis, trend tracking</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Venture Capital</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Partner/investor discovery, sector/geo targeting</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Market Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Fund distribution, market sizing, reports</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Due diligence, benchmarking, market opportunities</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/70 border-border backdrop-blur-sm col-span-1 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Business Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Partnership targeting, client prospecting, competitive intelligence</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* CTA Section */}
            <Card className="bg-gradient-primary/20 border-primary/30 backdrop-blur-sm">
              <CardContent className="py-12 text-center space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Ready to Supercharge Your Fund Research?</h2>
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
                  Pro Tip: Combine with our PitchBook Investors Scraper for complete investor and fund intelligence.
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
