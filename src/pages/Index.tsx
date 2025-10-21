import { useState } from "react";
import { Bell, Play, Shield, Clock, Users, BarChart3, AlertTriangle, TrendingUp, Info, Search, Filter, FileText, Video, BookOpen, Star, Lock, Award, Menu } from "lucide-react";
import { InvestorSignupWizard } from "@/components/landing/InvestorSignupWizard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Investor Stream</h1>
              <p className="text-xs text-muted-foreground">Intelligent Investments</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#00478F] via-[#0066CC] to-[#0080E5] text-white py-20 px-4">
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

              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Never Miss the Next <span className="text-blue-100">Big IPO Opportunity</span>
              </h2>

              <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto">
                Get free, instant alerts on the hottest upcoming IPOs before they hit the market. Stay ahead with independent research, curated watchlists, and exclusive insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => setShowSignupModal(true)}
                  className="bg-white text-primary hover:bg-blue-50 text-base font-semibold h-14 px-8"
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Get Free Alerts Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 text-base font-semibold h-14 px-8"
                >
                  <Play className="w-5 h-5 mr-2" />
                  See Sample Alerts
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-200" />
                  <span>Independent Research</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span>Real-time Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-200" />
                  <span>10,000+ Investors</span>
                </div>
              </div>
            </div>

            {/* Live IPO Alert Card */}
            <div className="mt-12 bg-white text-foreground rounded-xl p-6 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold">Live IPO Alert</span>
                </div>
                <span className="text-sm text-muted-foreground">2 min ago</span>
              </div>

              <h3 className="text-xl font-bold mb-2">TechCorp Inc. (TECH)</h3>
              <p className="text-muted-foreground mb-4">
                AI-powered SaaS company files for $2B IPO. Expected pricing: $18-22/share. Roadshow begins next week.
              </p>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">High Growth</Badge>
                <Button variant="link" className="text-primary font-semibold">
                  Read Full Analysis →
                </Button>
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
              <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Valuation Analysis</h3>
                <p className="text-muted-foreground">
                  Deep-dive into company financials, revenue models, and market positioning to assess fair value and growth potential.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <AlertTriangle className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Risk Assessment</h3>
                <p className="text-muted-foreground">
                  Comprehensive risk analysis covering market conditions, competitive landscape, and regulatory challenges.
                </p>
              </div>

              <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Growth Potential</h3>
                <p className="text-muted-foreground">
                  Market opportunity analysis and growth trajectory projections based on industry trends and company fundamentals.
                </p>
              </div>
            </div>

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

        {/* CTA Section 1 */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-[#003066] to-[#00478F] text-white rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready for Independent IPO Intelligence?</h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of investors who rely on our unbiased research and timely alerts to stay ahead of the market.
              </p>
              <Button
                size="lg"
                onClick={() => setShowSignupModal(true)}
                className="bg-white text-primary hover:bg-blue-50 h-14 px-8 text-base font-semibold"
              >
                <Bell className="w-5 h-5 mr-2" />
                Start Getting Alerts
              </Button>
            </div>
          </div>
        </section>

        {/* Sample Alerts Section */}
        <section className="py-20 px-4 bg-blue-50/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Bell className="w-4 h-4 mr-2" />
                Sample Alerts
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                See the <span className="text-primary">Alerts in Action</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Curious what our alerts look like? Here are a few examples from major IPOs that showcase the clarity and timeliness you can expect when you join Investor Stream.
              </p>
            </div>

            <div className="space-y-6 mb-12">
              {/* Rivian Alert */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-semibold">IPO Alert</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Nov 2021</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Rivian (RIVN)</h3>
                    <Badge variant="secondary" className="mb-3">Electric Vehicles</Badge>
                    <p className="text-muted-foreground mb-4">
                      Early insight into the EV giant's pre-IPO valuation. Amazon-backed electric vehicle manufacturer targeting $100B+ valuation with strong order backlog.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Expected: $57-62/share
                      </span>
                      <Button variant="link" className="text-primary font-semibold">
                        View Analysis →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Airbnb Alert */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="font-semibold">IPO Alert</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Dec 2020</span>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Airbnb (ABNB)</h3>
                    <Badge variant="secondary" className="mb-3">Travel Tech</Badge>
                    <p className="text-muted-foreground mb-4">
                      Alerts ahead of its blockbuster debut. Home-sharing platform showing resilience despite pandemic challenges with strong recovery indicators.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Expected: $56-60/share
                      </span>
                      <Button variant="link" className="text-primary font-semibold">
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
                      <Button variant="link" className="text-primary font-semibold">
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
      </main>

      <InvestorSignupWizard open={showSignupModal} onOpenChange={setShowSignupModal} />
    </div>
  );
};

export default Index;
