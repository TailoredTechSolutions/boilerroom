import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onGetAlertsClick: () => void;
}

export const HeroSection = ({ onGetAlertsClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20" />
      
      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Tagline */}
          <p className="text-muted-foreground text-lg md:text-xl animate-fade-in">
            Early Access to High-Growth Private Companies. Expert Insights + Transparent Pricing.
          </p>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
            Discover Major IPO Opportunities{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Before They Go Public
            </span>
          </h1>
          
          {/* CTA Button */}
          <div className="flex justify-center animate-fade-in-up delay-200">
            <Button
              onClick={onGetAlertsClick}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Get Free Alerts
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Sub-tagline */}
          <p className="text-muted-foreground text-base md:text-lg animate-fade-in delay-300">
            Stay ahead with curated alerts on pre-IPO giants like Starlink & Stripe.
          </p>
        </div>
      </div>
    </section>
  );
};
