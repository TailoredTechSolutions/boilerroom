import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useToast } from "@/hooks/use-toast";

const Premium = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isPremium } = useAuthUser();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const plans = {
    monthly: {
      name: "Premium Monthly",
      price: "$49",
      period: "/month",
      description: "Perfect for trying out premium features",
      priceId: "price_monthly_id", // Replace with actual Stripe price ID
    },
    annual: {
      name: "Premium Annual",
      price: "$490",
      period: "/year",
      description: "Save 16% with annual billing",
      savings: "Save $98/year",
      priceId: "price_annual_id", // Replace with actual Stripe price ID
    },
  };

  const features = [
    "Real-time IPO alerts and notifications",
    "Custom watchlists with unlimited entries",
    "Advanced analytics and market insights",
    "Priority customer support",
    "Exclusive research reports",
    "Early access to new features",
    "Historical IPO data access",
    "Portfolio tracking tools",
  ];

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to upgrade to premium.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    // TODO: Implement Stripe checkout
    // For now, just show a message
    toast({
      title: "Upgrade Coming Soon",
      description: "Premium subscriptions will be available soon. Stay tuned!",
    });

    setIsLoading(false);
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gradient-bg p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              You're a Premium Member! 🎉
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Enjoy unlimited access to all premium features
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get exclusive access to advanced IPO intelligence, real-time alerts, and comprehensive market analysis
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Monthly Plan */}
          <div
            className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all ${
              selectedPlan === "monthly"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plans.monthly.name}</h3>
              <p className="text-muted-foreground">{plans.monthly.description}</p>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-bold">{plans.monthly.price}</span>
              <span className="text-muted-foreground text-lg">{plans.monthly.period}</span>
            </div>

            {selectedPlan === "monthly" && (
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Selected
                </div>
              </div>
            )}
          </div>

          {/* Annual Plan */}
          <div
            className={`relative rounded-2xl border-2 p-8 cursor-pointer transition-all ${
              selectedPlan === "annual"
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedPlan("annual")}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Best Value
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">{plans.annual.name}</h3>
              <p className="text-muted-foreground">{plans.annual.description}</p>
            </div>

            <div className="mb-2">
              <span className="text-5xl font-bold">{plans.annual.price}</span>
              <span className="text-muted-foreground text-lg">{plans.annual.period}</span>
            </div>
            <div className="mb-6">
              <span className="text-success font-semibold">{plans.annual.savings}</span>
            </div>

            {selectedPlan === "annual" && (
              <div className="absolute top-4 right-4">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  Selected
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="bg-card rounded-2xl border p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Everything Included in Premium
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleUpgrade}
            size="lg"
            className="text-lg px-12 py-6"
            disabled={isLoading}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isLoading ? "Processing..." : `Upgrade to ${plans[selectedPlan].name}`}
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-muted/30 rounded-lg border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> Investor Stream is not a brokerage or licensed advisor. 
            All information provided is for educational purposes only. Please consult with a 
            qualified financial professional before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
