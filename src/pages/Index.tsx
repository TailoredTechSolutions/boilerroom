import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Play, Shield, Clock, Users, BarChart3, AlertTriangle, TrendingUp, Info, Search, Filter, FileText, Video, BookOpen, Star, Lock, Award, LayoutDashboard, ChevronRight } from "lucide-react";
import { InvestorSignupWizard } from "@/components/landing/InvestorSignupWizard";
import { IPODetailModal } from "@/components/landing/IPODetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import investorStreamLogo from "@/assets/investorstream-logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// IPO Data
const ipoData = {
  techcorp: {
    id: "techcorp",
    company: "TechCorp Inc.",
    ticker: "TECH",
    sector: "AI-Powered SaaS",
    date: "2 min ago",
    expectedPrice: "$18-22/share",
    valuation: "$2B",
    description: "TechCorp is a leading AI-powered SaaS platform serving enterprise customers across multiple industries. The company has demonstrated strong product-market fit with over 500 enterprise clients and a net revenue retention rate of 135%. Their proprietary AI technology provides significant competitive advantages in automation and predictive analytics.",
    highlights: [
      "Strong enterprise customer base with Fortune 500 clients including major tech companies and financial institutions",
      "Net revenue retention rate of 135% indicating strong upsell momentum and customer satisfaction",
      "Proprietary AI algorithms with significant technological moats and patent portfolio",
      "Experienced management team with previous exits and deep industry expertise",
      "Multiple revenue streams including licensing, subscription, and professional services"
    ],
    risks: [
      "Intense competition from established players like Salesforce, Microsoft, and Oracle",
      "High customer concentration with top 10 customers representing 45% of revenue",
      "Current lack of profitability with path to positive cash flow expected in 18-24 months",
      "Regulatory uncertainty around AI technologies and data privacy compliance",
      "Dependence on cloud infrastructure providers for service delivery"
    ],
    financials: {
      revenue: "$450M",
      growth: "+125%",
      margins: "72%"
    },
    marketOpportunity: "The enterprise AI and automation market is projected to reach $500B by 2027, growing at a CAGR of 35%. TechCorp is well-positioned to capture significant market share in this rapidly expanding sector, with their unique approach to vertical-specific AI solutions providing a differentiated offering.",
    competitivePosition: "TechCorp differentiates through its vertical-specific AI models that outperform general-purpose solutions by 40% in accuracy. The company has built strong partnerships with major cloud providers and system integrators, creating a network effect that strengthens their market position.",
    investmentThesis: "TechCorp represents a compelling opportunity in the high-growth AI/SaaS sector. Strong unit economics, impressive customer retention metrics, and significant total addressable market provide a foundation for sustained growth. The roadshow begins next week with strong early institutional interest."
  },
  rivian: {
    id: "rivian",
    company: "USDT Markets",
    ticker: "USDT",
    sector: "Digital Assets & Crypto",
    date: "Oct 2025",
    expectedPrice: "$25-30/share",
    valuation: "$12B",
    description: "USDT Markets is a leading digital asset exchange platform specializing in stablecoin trading and crypto market analytics. The platform has demonstrated exceptional growth tracking top crypto gainers including SynFutures (F) +49.0%, Paparazzi Token +38.0%, and Bitlight +28.6%. With advanced real-time market data integration from CoinGecko and CoinMarketCap, the platform serves institutional and retail traders seeking high-volume opportunities.",
    highlights: [
      "Real-time tracking of 24-hour crypto gainers with volume filters exceeding $50k",
      "Strategic partnerships with CoinGecko and CoinMarketCap for live market data",
      "Advanced filtering systems for Top 100 market cap cryptocurrencies to reduce volatility risk",
      "Proprietary analytics for identifying pump-and-dump patterns and microcap vulnerabilities",
      "Growing institutional client base seeking exposure to high-growth digital assets",
      "Comprehensive stablecoin infrastructure supporting USDT, USDC, and other major tokens"
    ],
    risks: [
      "Extreme volatility in crypto markets with many top gainers being illiquid or newly listed",
      "Regulatory uncertainty around digital asset trading and stablecoin classification",
      "Microcap tokens prone to pump-and-dump schemes despite volume filters",
      "Competition from established exchanges like Coinbase, Binance, and Kraken",
      "Limited track record with profitable operations in crypto winter conditions",
      "Dependence on third-party market data providers and blockchain infrastructure"
    ],
    financials: {
      revenue: "$180M",
      growth: "+285%",
      margins: "42%"
    },
    marketOpportunity: "The global crypto trading market is projected to exceed $1.5T by 2027, with stablecoin trading volume representing over 60% of daily transactions. USDT Markets is positioned to capture significant market share in the institutional trading segment, offering advanced tools for identifying high-growth opportunities while filtering out excessive risk.",
    competitivePosition: "USDT Markets differentiates through its focus on volume-filtered gainers analysis and real-time market intelligence. The platform's proprietary risk scoring system helps traders avoid microcap landmines while accessing legitimate high-growth opportunities. Integration with multiple data sources provides redundancy and accuracy advantages over single-provider platforms.",
    investmentThesis: "USDT Markets represents a unique opportunity in the rapidly evolving crypto infrastructure space. Strong revenue growth, institutional adoption, and differentiated analytics capabilities provide a foundation for sustained expansion. Current market conditions showing top 24h gainers like SynFutures (+49%), Paparazzi Token (+38%), and Bitlight (+28.6%) demonstrate the platform's ability to identify and track high-momentum opportunities. The company's focus on risk management and volume filtering addresses key concerns around crypto market manipulation."
  },
  apple: {
    id: "apple",
    company: "Apple Inc.",
    ticker: "AAPL",
    sector: "Technology",
    date: "Dec 1980",
    expectedPrice: "$22/share",
    valuation: "$1.8B",
    description: "Apple Computer Company goes public on December 12, 1980, offering shares at $22 per share. The stock opened at $22 and closed around $29 on its first day, creating instant returns for IPO buyers. Founded by Steve Jobs, Steve Wozniak, and Ronald Wayne in 1976, Apple has revolutionized personal computing with products like the Apple II and is poised for further innovation.",
    highlights: [
      "First-day pop: Opening at $22, closing near $29 - a roughly 32% gain for IPO participants",
      "Founded by visionary entrepreneurs with proven track record in personal computing",
      "Apple II computer showing strong market adoption in education and business sectors",
      "Current price around $262 per share represents approximately 12× return from IPO price",
      "Multiple stock splits over the years have multiplied shareholder value significantly",
      "Strong brand recognition and loyal customer base in emerging personal computer market"
    ],
    risks: [
      "Intense competition from IBM and other established technology companies",
      "Heavy dependence on Apple II product line for majority of revenue",
      "Management team lacks experience running a public company",
      "Rapid technological change could make current products obsolete quickly",
      "Economic recession could dampen consumer spending on discretionary tech products",
      "Questions about long-term sustainability of personal computer market growth"
    ],
    financials: {
      revenue: "$117M (1980)",
      growth: "+143%",
      margins: "23%"
    },
    marketOpportunity: "The personal computer market is in its infancy with massive growth potential as computers become more accessible to consumers and businesses. Apple is well-positioned to capture significant market share in education, creative professionals, and home computing segments.",
    competitivePosition: "Apple has established strong differentiation through user-friendly design and integrated hardware-software approach. The company's focus on the complete user experience sets it apart from competitors who primarily focus on technical specifications. Brand loyalty and ecosystem advantages provide defensible competitive moats.",
    investmentThesis: "Apple's IPO on December 12, 1980 at $22 per share marked the beginning of one of the most successful tech investments in history. The first-day close around $29 signaled strong market demand. Current trading price of approximately $262 per share (accounting for splits, the actual return is much higher) demonstrates the company's long-term value creation. While past performance doesn't guarantee future results, Apple's innovative culture, strong management, and leadership position in personal computing suggest significant upside potential for patient investors."
  },
  commodities: {
    id: "commodities",
    company: "Global Commodity Futures Platform",
    ticker: "GCFP",
    sector: "Commodities & Agriculture",
    date: "Mar 2022",
    expectedPrice: "$35-42/share",
    valuation: "$8.5B",
    description: "Leading commodity futures platform specializing in geopolitically-sensitive agricultural markets. The platform integrates geostrategic and macro-economic signals into its investment framework, anchoring decisions in real-world events rather than historical averages. Following the Russian invasion of Ukraine in February 2022, the system tracked wheat export disruptions (Ukraine and Russia account for ~29% of world wheat exports) and responded to the resulting 40% price surge. Similarly, cocoa supply deficits tied to adverse weather in West Africa drove prices to more than double since August 2023.",
    highlights: [
      "Wheat futures surged 40% by May 2022 following Ukraine war disruption of major export routes",
      "Cocoa prices more than doubled since August 2023 due to West African supply deficits",
      "Real-time integration of export-volume shifts, futures-market responses, and crop-yield forecasts",
      "Proprietary geopolitical risk indicators adjusting exposure dynamically based on global events",
      "Platform tracked 50% wheat futures price increase in Paris markets, even higher in Chicago",
      "Advanced risk-scenario modeling treating commodities as linked to global events, not static assets"
    ],
    risks: [
      "Commodity price spikes often reverse when alternative supply routes normalize",
      "High volatility in agricultural markets driven by weather, politics, and speculation",
      "Limited control over geopolitical events that drive price movements",
      "Cocoa price increases tied more to weather than war - indirect war correlation",
      "Past disruptions don't guarantee future price movements in same commodities",
      "Regulatory changes in futures markets could impact trading strategies"
    ],
    financials: {
      revenue: "$145M",
      growth: "+215%",
      margins: "38%"
    },
    marketOpportunity: "The global commodity futures market exceeds $20T in notional value, with agricultural commodities representing a significant and growing segment. Geopolitical instability, climate change impacts on yields, and supply chain vulnerabilities create persistent opportunities for platforms that can integrate real-world event data into trading signals. The war in Ukraine demonstrated the scale of disruption possible in grain markets, while cocoa market dynamics show ongoing structural supply challenges.",
    competitivePosition: "The platform differentiates through its focus on geopolitical risk integration and real-time event monitoring. Unlike traditional commodity platforms that rely primarily on historical price patterns, this system ingests export data, political risk assessments, weather forecasts, and logistics disruptions to adjust exposure dynamically. The Ukraine wheat disruption response (identifying the 40% price spike opportunity) and cocoa supply deficit tracking demonstrate the platform's ability to capitalize on macro-driven commodity moves.",
    investmentThesis: "Global Commodity Futures Platform represents a unique opportunity in the intersection of agriculture, geopolitics, and financial technology. The Ukrainian invasion's impact on wheat prices (40% surge in early 2022) and ongoing cocoa supply challenges (prices more than doubling since August 2023) validate the platform's event-driven approach. By anchoring investment decisions in real-world disruptions rather than static models, the platform can identify and capitalize on commodity price dislocations that traditional approaches miss. Strong revenue growth and proven track record in recent geopolitical events position the company well for continued expansion."
  },
  airbnb: {
    id: "airbnb",
    company: "Airbnb",
    ticker: "ABNB",
    sector: "Travel Tech",
    date: "Dec 2020",
    expectedPrice: "$56-60/share",
    valuation: "$47B",
    description: "Airbnb is the world's leading online marketplace for short-term vacation rentals and experiences, connecting hosts with guests across 220+ countries. Despite pandemic challenges, the company has demonstrated remarkable resilience with strong booking recovery and a shift toward long-term stays and local travel patterns.",
    highlights: [
      "Global network of 4+ million hosts offering 7+ million accommodations worldwide",
      "Strong brand recognition with over 90% aided awareness in major markets",
      "Asset-light business model with high incremental margins and strong unit economics",
      "Rapid recovery in bookings showing resilience despite pandemic headwinds",
      "Growing long-term stay segment (28+ days) representing 24% of gross booking value",
      "Experienced leadership team that successfully navigated the company through crisis"
    ],
    risks: [
      "Regulatory challenges in major cities including short-term rental restrictions",
      "Intense competition from Booking.com, Vrbo, and emerging regional players",
      "Dependence on discretionary consumer spending and travel demand recovery",
      "Host and guest safety concerns requiring ongoing investment in trust and safety",
      "Foreign exchange exposure given global operations",
      "Potential for increased regulation around gig economy classification"
    ],
    financials: {
      revenue: "$3.4B (2019)",
      growth: "-30% (2020, pandemic impact)",
      margins: "15-20% (normalized)"
    },
    marketOpportunity: "The global short-term rental market is estimated at $170B+ with significant room for growth as alternative accommodations gain mainstream acceptance. Post-pandemic travel trends favor private, socially-distanced accommodations, positioning Airbnb well for sustained growth.",
    competitivePosition: "Airbnb's two-sided marketplace benefits from strong network effects, with the largest selection of unique accommodations globally. The platform's focus on experiences and community differentiation from traditional hotel booking sites. Strong brand and user trust provide defensible competitive advantages.",
    investmentThesis: "Airbnb's blockbuster debut comes during uncertain times, but the company has proven its resilience and adaptability. The platform showed remarkable recovery despite pandemic challenges, with strong recovery indicators pointing to normalized demand returning faster than expected. The shift to remote work and flexible travel arrangements plays to Airbnb's strengths in longer-term stays."
  },
  snowflake: {
    id: "snowflake",
    company: "Snowflake",
    ticker: "SNOW",
    sector: "Cloud Data",
    date: "Sep 2020",
    expectedPrice: "$75-85/share",
    valuation: "$23.5B",
    description: "Snowflake is a cloud-based data warehousing company that enables organizations to mobilize their data with a unique platform-as-a-service model. The company's architecture separates storage and compute, allowing customers to scale independently and pay only for what they use. Snowflake has attracted high-profile investors including Salesforce and Berkshire Hathaway.",
    highlights: [
      "Triple-digit revenue growth with strong customer retention metrics (158% net revenue retention)",
      "Strategic investments from Salesforce Ventures and Berkshire Hathaway adding credibility",
      "Unique cloud-native architecture with significant competitive advantages",
      "Over 3,100 customers including 241 of the Fortune 500 companies",
      "Cloud-agnostic platform running on AWS, Azure, and Google Cloud",
      "Strong land-and-expand model with growing customer spend over time"
    ],
    risks: [
      "Intense competition from AWS Redshift, Google BigQuery, and Microsoft Azure",
      "Current lack of profitability with significant sales and marketing spend required",
      "High customer acquisition costs requiring scale for sustainable unit economics",
      "Dependence on underlying cloud providers (AWS, Azure, GCP) for infrastructure",
      "Rapid market evolution requiring continuous innovation and R&D investment",
      "Potential for increased competition as hyperscalers invest in data warehouse offerings"
    ],
    financials: {
      revenue: "$592M (TTM)",
      growth: "+133%",
      margins: "56% (gross)"
    },
    marketOpportunity: "The cloud data warehouse market is expected to grow to $22B by 2025 as organizations accelerate digital transformation and migrate legacy data infrastructure to the cloud. Snowflake is well-positioned as a platform-agnostic solution in this rapidly expanding market.",
    competitivePosition: "Snowflake's unique architecture and cloud-agnostic approach differentiates it from cloud provider native solutions. The company's consumption-based pricing model aligns well with customer needs and creates a capital-efficient business model. Strong partnerships with system integrators accelerate customer adoption.",
    investmentThesis: "Snowflake's explosive growth during its roadshow phase attracted backing from tech giants Salesforce and Warren Buffett's Berkshire Hathaway. The cloud data platform demonstrates exceptional product-market fit with net revenue retention of 158%, indicating strong customer satisfaction and expanding use cases. Despite current losses, the company's unit economics and market position suggest significant long-term potential."
  }
};

const Index = () => {
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<typeof ipoData[keyof typeof ipoData] | null>(null);
  const [showIPODetail, setShowIPODetail] = useState(false);
  const [showValuationDialog, setShowValuationDialog] = useState(false);
  const [showRiskDialog, setShowRiskDialog] = useState(false);
  const [showGrowthDialog, setShowGrowthDialog] = useState(false);

  const handleViewAnalysis = (ipoId: keyof typeof ipoData) => {
    setSelectedIPO(ipoData[ipoId]);
    setShowIPODetail(true);
  };

  const scrollToSampleAlerts = () => {
    const sampleAlertsSection = document.getElementById('sample-alerts');
    if (sampleAlertsSection) {
      sampleAlertsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src={investorStreamLogo} 
              alt="InvestorStream Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-contain"
            />
            <div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900">InvestorStream</h1>
              <p className="text-[10px] sm:text-xs text-slate-600 hidden xs:block">Intelligent Investments</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/overview')}
            className="gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
            size="sm"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Dash</span>
          </Button>
        </div>
      </header>

      <main className="pt-14 sm:pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00478F] via-[#0066CC] to-[#0080E5] text-white py-12 sm:py-20 px-3 sm:px-4">
          {/* Particle Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="particle absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <BarChart3 className="w-4 h-4 mr-2" />
                IPO Intelligence Platform
              </Badge>

              <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">
                Never Miss the Next <span className="text-blue-100">Big IPO Opportunity</span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-blue-50 max-w-2xl mx-auto">
                Get free, instant alerts on the hottest upcoming IPOs before they hit the market. Stay ahead with independent research, curated watchlists, and exclusive insights.
              </p>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => setShowSignupModal(true)}
                  className="bg-white text-black hover:bg-gray-100 text-base sm:text-xl font-semibold h-14 sm:h-20 px-6 sm:px-16"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Get Free Alerts Now
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 sm:pt-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
                  <span>Independent Research</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
                  <span>Real-time Alerts</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
                  <span>10,000+ Investors</span>
                </div>
              </div>
            </div>

            {/* Live IPO Alert Card */}
            <div className="mt-8 sm:mt-12 bg-white text-foreground rounded-xl p-4 sm:p-6 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-sm sm:text-base">Live IPO Alert</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">2 min ago</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2">TechCorp Inc. (TECH)</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                AI-powered SaaS company files for $2B IPO. Expected pricing: $18-22/share. Roadshow begins next week.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">High Growth</Badge>
                <Button 
                  onClick={() => handleViewAnalysis('techcorp')}
                  className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                >
                  Read Full Analysis
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Most Actively Traded Asset Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  UK's Most Actively Traded Asset
                </h2>
                <p className="text-xl text-muted-foreground">
                  Current Market Overview (April 2025)
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-6 rounded-xl border shadow-sm">
                  <div className="text-4xl font-bold text-primary mb-2">EUR/USD</div>
                  <div className="text-sm text-muted-foreground mb-4">Forex Currency Pair</div>
                  <div className="text-2xl font-semibold mb-1">$4.7T</div>
                  <div className="text-sm text-muted-foreground">Daily UK FX Trading Volume</div>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm">
                  <div className="text-4xl font-bold text-primary mb-2">38%</div>
                  <div className="text-sm text-muted-foreground mb-4">Global Market Share</div>
                  <div className="text-2xl font-semibold mb-1">London</div>
                  <div className="text-sm text-muted-foreground">World's Leading FX Hub</div>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm">
                  <div className="text-4xl font-bold text-primary mb-2">22-24%</div>
                  <div className="text-sm text-muted-foreground mb-4">of Global FX Volume</div>
                  <div className="text-2xl font-semibold mb-1">$1.7T+</div>
                  <div className="text-sm text-muted-foreground">EUR/USD Daily Trading</div>
                </div>
              </div>

              <div className="bg-card p-8 rounded-xl border shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Why EUR/USD Dominates</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Euro/US Dollar currency pair is the single most actively traded asset by volume in the UK, 
                    with trading volumes that dwarf all other asset classes combined. As of April 2025, average daily 
                    turnover in the UK's FX market reached <span className="font-semibold text-foreground">$4.745 trillion per day</span>.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 my-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Volume Comparison</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• <span className="font-medium">EUR/USD Forex:</span> $1.7T+ daily</li>
                        <li>• <span className="font-medium">UK Gilts (Bonds):</span> ~$50B daily</li>
                        <li>• <span className="font-medium">Top LSE Stock:</span> ~$100M daily</li>
                        <li>• <span className="font-medium">Gold Trading:</span> ~$24B daily</li>
                        <li>• <span className="font-medium">All Crypto Markets:</span> ~$150B daily</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Recent Surge Factors</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• US trade policy announcements & tariff threats</li>
                        <li>• Central bank interest rate decisions</li>
                        <li>• Geopolitical tensions & macro surprises</li>
                        <li>• 28% volume increase above 2022 levels</li>
                        <li>• Heightened volatility driving trading activity</li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    London's status as the world's leading FX trading center cements EUR/USD's top spot. 
                    The massive liquidity and constant demand for exchanging the world's two biggest currencies 
                    creates unmatched trading volume that no stock, commodity, bond, or crypto asset can approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Intelligence Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <FileText className="w-4 h-4 mr-2" />
                Independent Analysis
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Trusted, Independent <span className="text-primary">Market Intelligence</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Investor Stream provides in-depth analysis on private companies preparing to go public. We cut through the noise to deliver concise, fact-based research that helps you understand valuation trends, growth potential, and risk factors—without the hype.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <button 
                onClick={() => setShowValuationDialog(true)}
                className="bg-card p-8 rounded-xl border-2 border-border hover:border-primary shadow-sm hover:shadow-lg transition-all cursor-pointer text-left group hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Valuation Analysis</h3>
                <p className="text-muted-foreground">
                  Deep-dive into company financials, revenue models, and market positioning to assess fair value and growth potential.
                </p>
                <div className="mt-4 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to learn more →
                </div>
              </button>

              <button 
                onClick={() => setShowRiskDialog(true)}
                className="bg-card p-8 rounded-xl border-2 border-border hover:border-blue-600 shadow-sm hover:shadow-lg transition-all cursor-pointer text-left group hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <AlertTriangle className="w-7 h-7 text-blue-600" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Comprehensive risk analysis covering market conditions, competitive landscape, and regulatory challenges.
                </p>
                <div className="mt-4 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to learn more →
                </div>
              </button>

              <button 
                onClick={() => setShowGrowthDialog(true)}
                className="bg-card p-8 rounded-xl border-2 border-border hover:border-blue-500 shadow-sm hover:shadow-lg transition-all cursor-pointer text-left group md:col-span-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <TrendingUp className="w-7 h-7 text-blue-500" />
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-500 transition-colors">Growth Potential</h3>
                <p className="text-muted-foreground">
                  Market opportunity analysis and growth trajectory projections based on industry trends and company fundamentals.
                </p>
                <div className="mt-4 text-sm font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to learn more →
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section 1 */}
        <section className="py-10 sm:py-16 px-3 sm:px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-[#003066] to-[#00478F] text-white rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center">
              <h3 className="text-xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready for Independent IPO Intelligence?</h3>
              <p className="text-sm sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of investors who rely on our unbiased research and timely alerts to stay ahead of the market.
              </p>
              <Button
                size="lg"
                onClick={scrollToSampleAlerts}
                className="bg-white text-black hover:bg-gray-100 h-12 sm:h-16 px-6 sm:px-10 text-sm sm:text-lg font-bold animate-bounce shadow-2xl"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Don't Miss Out on Free Alerts!
              </Button>
            </div>
          </div>
        </section>

        {/* Sample Alerts Section */}
        <section className="py-12 sm:py-20 px-3 sm:px-4 bg-blue-50/30" id="sample-alerts">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8 sm:mb-12">
              <Badge variant="secondary" className="mb-3 sm:mb-4 bg-blue-100 text-blue-900 hover:bg-blue-200">
                <Bell className="w-4 h-4 mr-2" />
                Sample Alerts
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 text-slate-900">
                See the <span className="text-[#0066CC]">Alerts in Action</span>
              </h2>
              <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto">
                Curious what our alerts look like? Here are a few examples from major IPOs that showcase the clarity and timeliness you can expect when you join Investor Stream.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              {/* USDT Markets Alert */}
              <div className="backdrop-blur-md bg-blue-50/50 rounded-xl p-4 sm:p-6 shadow-sm border border-blue-200/30">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-semibold text-sm sm:text-base text-slate-900">IPO Alert</span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-600">Oct 2025</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 text-black">USDT Markets (USDT)</h3>
                    <Badge variant="secondary" className="mb-2 sm:mb-3 bg-blue-100 text-blue-900 text-xs">Digital Assets & Crypto</Badge>
                    <p className="text-sm text-slate-700 mb-3 sm:mb-4">
                      Leading digital asset exchange specializing in stablecoin trading. Platform tracks top 24h crypto gainers including SynFutures (F) +49.0%, Paparazzi Token +38.0%, and Bitlight +28.6% with advanced risk filtering.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm text-slate-600 flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Expected: $25-30/share
                      </span>
                      <Button 
                        variant="link" 
                        onClick={() => handleViewAnalysis('rivian')}
                        className="text-[#0066CC] font-semibold hover:text-[#0052A3] p-0 h-auto justify-start sm:justify-end"
                      >
                        View Analysis →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apple Alert */}
              <div className="backdrop-blur-md bg-blue-50/50 rounded-xl p-6 shadow-sm border border-blue-200/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="font-semibold text-slate-900">IPO Alert</span>
                  </div>
                  <span className="text-sm text-slate-600">Dec 1980</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 text-black">Apple Inc. (AAPL)</h3>
                    <Badge variant="secondary" className="mb-3 bg-blue-100 text-blue-900">Technology</Badge>
                    <p className="text-slate-700 mb-4">
                      Historic IPO at $22/share on Dec 12, 1980. Opened at $22, closed around $29 on first day. Current price ~$262 represents 12× return (much higher accounting for splits). Revolutionary personal computing company.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        IPO Price: $22/share
                      </span>
                      <Button 
                        variant="link" 
                        onClick={() => handleViewAnalysis('apple')}
                        className="text-[#0066CC] font-semibold hover:text-[#0052A3]"
                      >
                        View Analysis →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commodities Alert */}
              <div className="backdrop-blur-md bg-blue-50/50 rounded-xl p-6 shadow-sm border border-blue-200/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="font-semibold text-slate-900">Commodity Alert</span>
                  </div>
                  <span className="text-sm text-slate-600">Mar 2022</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1 text-black">Global Commodity Futures (GCFP)</h3>
                    <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-900">Commodities & Agriculture</Badge>
                    <p className="text-slate-700 mb-4">
                      Ukraine war disrupted wheat exports causing 40% price surge by May 2022. Cocoa prices doubled since Aug 2023 due to West African supply deficits. Platform integrates geopolitical risk signals into real-time commodity trading.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Expected: $35-42/share
                      </span>
                      <Button 
                        variant="link" 
                        onClick={() => handleViewAnalysis('commodities')}
                        className="text-[#0066CC] font-semibold hover:text-[#0052A3]"
                      >
                        View Analysis →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Snowflake Alert */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="font-semibold">IPO Alert</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Sep 2020</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Snowflake (SNOW)</h3>
                    <Badge variant="secondary" className="mb-3">Cloud Data</Badge>
                    <p className="text-muted-foreground mb-4">
                      Key updates during its roadshow phase. Cloud data platform with explosive growth and backing from Salesforce and Berkshire Hathaway.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Expected: $75-85/share
                      </span>
                      <Button 
                        variant="link" 
                        onClick={() => handleViewAnalysis('snowflake')}
                        className="text-primary font-semibold"
                      >
                        View Analysis →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What Makes Different */}
            <div className="bg-white rounded-xl p-8 shadow-sm border mb-8">
              <h3 className="text-2xl font-bold text-center mb-12">What Makes Our Alerts Different</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">Timely Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Alerts sent before major announcements and filing updates
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">Deep Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive research beyond basic filing information
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">Quality Focus</h4>
                  <p className="text-sm text-muted-foreground">
                    Only high-potential opportunities that meet our criteria
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#003066] to-[#00478F] text-white rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Want to See More Sample Alerts?</h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Explore our complete library of past IPO alerts and see the detailed analysis that helped investors stay ahead of the market.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-blue-50 h-14 px-8 text-base font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View More Sample Alerts
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowSignupModal(true)}
                  className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base font-semibold"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Get Free Alerts Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                Education Center
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Your IPO Questions, <span className="text-primary">Answered</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                New to IPO investing? We've got you covered. Get up to speed with our comprehensive FAQ section covering everything from basics to advanced strategies.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What exactly is an IPO?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  An Initial Public Offering (IPO) is when a private company first sells shares to the public on a stock exchange. This allows the company to raise capital from public investors and gives early investors and employees a way to sell their shares. IPOs are significant events that can create substantial investment opportunities for those who get in early.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How does pre-IPO investing work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Pre-IPO investing involves purchasing shares in a company before it goes public. This typically happens through private placements, secondary markets, or specialized platforms. While potentially more rewarding, pre-IPO investments usually require higher minimum investments and are often limited to accredited investors. Our alerts help you identify companies preparing for IPOs so you can research opportunities early.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  How often will I get alerts?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Alert frequency varies based on market activity, but you can typically expect 2-5 high-quality alerts per week. We prioritize quality over quantity, focusing on companies with strong fundamentals and significant market potential. During active IPO markets, you may receive more alerts, while quieter periods may see fewer but more selective opportunities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Can I unsubscribe anytime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Absolutely! You can unsubscribe from our alerts at any time with a single click. There are no long-term commitments or cancellation fees. We believe in providing value that makes you want to stay, not contracts that force you to. You can also customize your alert preferences to receive only the types of opportunities that interest you most.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  Do you provide investment advice?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No. Investor Stream does not provide investment advice or recommendations to buy or sell securities. We are an educational and informational platform that provides independent research and analysis. All investment decisions should be made based on your own research and risk tolerance, preferably in consultation with a qualified financial advisor.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-card border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  What makes your research different?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our research is completely independent—we don't have relationships with investment banks or companies going public that could influence our analysis. We focus on fundamental analysis, market trends, and risk assessment rather than hype or speculation. Our team has extensive experience in financial analysis and public markets, ensuring you get professional-grade insights.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Education Resources */}
            <div className="mt-16 bg-blue-50/50 rounded-2xl p-12">
              <h3 className="text-2xl font-bold text-center mb-4">IPO Education Resources</h3>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                Expand your knowledge with our comprehensive guides and educational content designed to help you become a more informed investor.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">IPO Guides</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Step-by-step guides covering the IPO process
                  </p>
                  <Button variant="link" className="text-primary">Learn More →</Button>
                </div>

                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">Video Tutorials</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visual learning resources and market insights
                  </p>
                  <Button variant="link" className="text-primary">Watch Now →</Button>
                </div>

                <div className="bg-white p-6 rounded-lg border text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">Market Reports</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    In-depth analysis of IPO market trends
                  </p>
                  <Button variant="link" className="text-primary">Read More →</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section 2 */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-[#003066] to-[#00478F] text-white rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Your IPO Journey?</h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of informed investors who use our alerts and research to stay ahead of the IPO market. Get started with free alerts today.
              </p>
              <Button
                size="lg"
                onClick={() => setShowSignupModal(true)}
                className="bg-white text-primary hover:bg-blue-50 h-14 px-8 text-base font-semibold"
              >
                <Bell className="w-5 h-5 mr-2" />
                Sign Up for Free Alerts
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Star className="w-4 h-4 mr-2" />
                Client Success Stories
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Trusted by <span className="text-primary">10,000+ Investors</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what our community of investors says about the value of our independent research and timely IPO alerts.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card p-6 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "Investor Stream's alerts helped me get in early on three major IPOs last year. Their independent analysis cuts through the hype and gives you the real story behind the numbers."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    MR
                  </div>
                  <div>
                    <div className="font-bold">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Portfolio Manager</div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "The quality of research is exceptional. I've been following IPOs for 15 years, and Investor Stream provides insights I can't find anywhere else. Worth every minute of my time."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    SC
                  </div>
                  <div>
                    <div className="font-bold">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Angel Investor</div>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "Finally, an IPO service that doesn't try to sell me anything! The alerts are timely, the analysis is thorough, and the team clearly knows what they're doing."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    DJ
                  </div>
                  <div>
                    <div className="font-bold">David Johnson</div>
                    <div className="text-sm text-muted-foreground">Retail Investor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-blue-50/50 rounded-2xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Active Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">IPOs Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Market Monitoring</div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 text-center">
              <p className="text-sm font-semibold text-muted-foreground mb-6">Trusted by investors worldwide</p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span>SEC Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>Data Protected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Independent Research</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Privacy First</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Info className="w-4 h-4 mr-2" />
                About Investor Stream
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Independent Research. <span className="text-primary">Unbiased Insights.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Founded by experienced financial analysts and former investment bankers, Investor Stream was created to fill a critical gap in the IPO research landscape: truly independent, conflict-free analysis.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 bg-card p-6 rounded-xl border">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">No Conflicts of Interest</h3>
                  <p className="text-muted-foreground">
                    We don't sell securities, manage funds, or have investment banking relationships. Our only focus is providing you with objective research.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 bg-card p-6 rounded-xl border">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Experienced Team</h3>
                  <p className="text-muted-foreground">
                    Our analysts have decades of combined experience in investment banking, equity research, and venture capital across major financial institutions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 bg-card p-6 rounded-xl border">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Data-Driven Approach</h3>
                  <p className="text-muted-foreground">
                    We combine fundamental analysis with proprietary data models to identify the most promising IPO opportunities and potential risks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-[#003066] to-[#00478F] text-white rounded-2xl p-16 text-center">
              <h2 className="text-4xl font-bold mb-6">Start Receiving IPO Alerts Today</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join our community of informed investors. Get instant alerts on the hottest upcoming IPOs, backed by independent research you can trust.
              </p>
              <Button
                size="lg"
                onClick={() => setShowSignupModal(true)}
                className="bg-white text-primary hover:bg-blue-50 h-16 px-12 text-lg font-bold"
              >
                <Bell className="w-6 h-6 mr-2" />
                Get Free Alerts Now
              </Button>
              <p className="text-sm text-blue-200 mt-6">
                No credit card required • Unsubscribe anytime • 100% free
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Section - Moved to Bottom */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-lg">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-2">Important Disclaimer</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Investor Stream is not a brokerage or licensed advisor.</strong> Our content is educational and informational only. We provide independent research and analysis to help you make informed decisions, but we do not provide investment advice or recommendations to buy or sell securities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <InvestorSignupWizard open={showSignupModal} onOpenChange={setShowSignupModal} />
      <IPODetailModal
        open={showIPODetail} 
        onOpenChange={setShowIPODetail} 
        ipoData={selectedIPO}
      />
      
      {/* Valuation Analysis Dialog */}
      <Dialog open={showValuationDialog} onOpenChange={setShowValuationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Valuation Analysis</DialogTitle>
            <DialogDescription className="text-base">
              Comprehensive financial evaluation methodology
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground leading-relaxed">
              Our valuation analysis provides deep insights into company financials, revenue models, and market positioning. We assess fair value through multiple frameworks including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>DCF Analysis:</strong> Discounted cash flow projections based on realistic growth assumptions</li>
              <li><strong>Comparable Companies:</strong> Peer group analysis across similar businesses and stages</li>
              <li><strong>Revenue Multiples:</strong> Industry-standard metrics and historical IPO pricing data</li>
              <li><strong>Growth Trajectory:</strong> Assessment of revenue acceleration, customer acquisition costs, and retention metrics</li>
              <li><strong>Market Positioning:</strong> Competitive advantages, moats, and differentiation factors</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Each IPO alert includes specific valuation metrics tailored to the company's sector, stage, and business model. We provide context on whether the proposed valuation appears reasonable, aggressive, or conservative relative to comparable offerings.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Risk Assessment Dialog */}
      <Dialog open={showRiskDialog} onOpenChange={setShowRiskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Risk Assessment</DialogTitle>
            <DialogDescription className="text-base">
              Comprehensive risk evaluation framework
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground leading-relaxed">
              We provide thorough risk analysis covering all material factors that could impact investment performance:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Market Risks:</strong> Economic conditions, sector trends, and timing considerations</li>
              <li><strong>Competitive Landscape:</strong> Threats from established players and emerging competitors</li>
              <li><strong>Regulatory Environment:</strong> Compliance requirements, pending legislation, and policy changes</li>
              <li><strong>Financial Risks:</strong> Profitability path, cash burn rate, and funding requirements</li>
              <li><strong>Operational Risks:</strong> Key person dependencies, technology vulnerabilities, and execution challenges</li>
              <li><strong>Customer Concentration:</strong> Revenue dependency and customer diversification analysis</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our risk assessments are designed to help you understand potential downsides and make informed decisions. We highlight both company-specific risks and broader market factors that could affect performance.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Growth Potential Dialog */}
      <Dialog open={showGrowthDialog} onOpenChange={setShowGrowthDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Growth Potential</DialogTitle>
            <DialogDescription className="text-base">
              Market opportunity and expansion analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground leading-relaxed">
              Our growth potential analysis evaluates the company's runway for expansion and value creation:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Total Addressable Market (TAM):</strong> Size and characteristics of the target market opportunity</li>
              <li><strong>Market Share Projections:</strong> Realistic capture rates based on competitive positioning</li>
              <li><strong>Revenue Growth Trajectory:</strong> Historical performance and forward-looking indicators</li>
              <li><strong>Expansion Opportunities:</strong> Geographic expansion, new products, and adjacent markets</li>
              <li><strong>Unit Economics:</strong> Customer lifetime value, acquisition costs, and scalability metrics</li>
              <li><strong>Innovation Pipeline:</strong> R&D capabilities and product roadmap assessment</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We combine industry research, company disclosures, and market trends to project realistic growth scenarios. Our analysis helps you understand whether the company's growth story is credible and sustainable.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
