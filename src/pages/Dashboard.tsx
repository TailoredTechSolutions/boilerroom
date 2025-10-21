import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Bell, BarChart3, Plus } from "lucide-react";
import { WatchlistTab } from "@/components/dashboard/WatchlistTab";
import { AlertsTab } from "@/components/dashboard/AlertsTab";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { PremiumPaywall } from "@/components/PremiumPaywall";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isPremium } = useAuthUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleTabChange = (value: string) => {
    // Free users can only access overview
    if (!isPremium && value !== "overview") {
      setShowPaywall(true);
      return;
    }
    setActiveTab(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">My Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile?.full_name || user.email}
                </p>
              </div>
            </div>

            {!isPremium && (
              <Button onClick={() => navigate("/premium")} size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="watchlist" disabled={!isPremium}>
              <Plus className="mr-2 h-4 w-4" />
              Watchlist
              {!isPremium && " 🔒"}
            </TabsTrigger>
            <TabsTrigger value="alerts" disabled={!isPremium}>
              <Bell className="mr-2 h-4 w-4" />
              Alerts
              {!isPremium && " 🔒"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab isPremium={isPremium} />
          </TabsContent>

          <TabsContent value="watchlist">
            <WatchlistTab />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsTab />
          </TabsContent>
        </Tabs>
      </main>

      <PremiumPaywall
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="watchlists and custom alerts"
      />
    </div>
  );
};

export default Dashboard;
