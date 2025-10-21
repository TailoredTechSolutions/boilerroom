import { useState } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { CompanyTicker } from "@/components/landing/CompanyTicker";
import { InvestorSignupWizard } from "@/components/landing/InvestorSignupWizard";
import { LandingNav } from "@/components/landing/LandingNav";

const Index = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav onGetAlertsClick={() => setShowSignupModal(true)} />
      
      <main className="pt-16">
        <HeroSection onGetAlertsClick={() => setShowSignupModal(true)} />
        
        <CompanyTicker />
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
                QUIET TOOLS. LOUD RESULTS.
              </p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Why Choose Our Platform
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Curated Alerts</h3>
                <p className="text-muted-foreground">
                  Get timely notifications about high-potential pre-IPO opportunities
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
                <p className="text-muted-foreground">
                  Expert analysis and insights on emerging market trends
                </p>
              </div>
              
              <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground">
                  Stay ahead with instant notifications on market movements
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl p-12 border border-blue-500/20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of investors getting early access to pre-IPO opportunities
              </p>
              <button
                onClick={() => setShowSignupModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Free Alerts Now
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <InvestorSignupWizard open={showSignupModal} onOpenChange={setShowSignupModal} />
    </div>
  );
};

export default Index;
