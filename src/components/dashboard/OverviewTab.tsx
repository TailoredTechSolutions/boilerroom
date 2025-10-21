import { useEffect, useState } from "react";
import { KPICard } from "@/components/KPICard";
import { TrendingUp, Bell, Star, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OverviewTabProps {
  isPremium: boolean;
}

export const OverviewTab = ({ isPremium }: OverviewTabProps) => {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [stats, setStats] = useState({
    watchlistCount: 0,
    alertsCount: 0,
    unreadAlerts: 0,
  });

  useEffect(() => {
    if (!user || !isPremium) return;

    const fetchStats = async () => {
      const [watchlistRes, alertsRes] = await Promise.all([
        supabase.from("watchlist").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("user_alerts").select("*", { count: "exact" }).eq("user_id", user.id),
      ]);

      const unreadCount = alertsRes.data?.filter((alert) => !alert.is_read).length || 0;

      setStats({
        watchlistCount: watchlistRes.count || 0,
        alertsCount: alertsRes.count || 0,
        unreadAlerts: unreadCount,
      });
    };

    fetchStats();
  }, [user, isPremium]);

  if (!isPremium) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upgrade to Premium to unlock custom watchlists, real-time alerts, and advanced analytics
          </p>
          <Button onClick={() => navigate("/premium")} size="lg">
            Upgrade to Premium
          </Button>
        </div>

        {/* Recent IPO Alerts Preview */}
        <div>
          <h3 className="text-xl font-bold mb-4">Recent IPO Activity</h3>
          <div className="space-y-4">
            {[
              { company: "TechCorp Inc.", status: "Filed S-1", date: "2 hours ago" },
              { company: "BioMed Solutions", status: "Priced", date: "1 day ago" },
              { company: "GreenEnergy Corp", status: "Roadshow", date: "2 days ago" },
            ].map((item) => (
              <div
                key={item.company}
                className="bg-card rounded-lg border p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{item.company}</p>
                  <p className="text-sm text-muted-foreground">{item.status}</p>
                </div>
                <p className="text-sm text-muted-foreground">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Watchlist Items"
          value={stats.watchlistCount}
          subtitle="Active tracking"
          icon={Star}
          variant="default"
        />
        <KPICard
          title="Total Alerts"
          value={stats.alertsCount}
          subtitle="All time"
          icon={Bell}
          variant="success"
        />
        <KPICard
          title="Unread Alerts"
          value={stats.unreadAlerts}
          subtitle="Needs attention"
          icon={Activity}
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate("/dashboard")}>
            <div className="text-left">
              <p className="font-semibold">Add to Watchlist</p>
              <p className="text-xs text-muted-foreground">Track new IPOs and stocks</p>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4">
            <div className="text-left">
              <p className="font-semibold">Configure Alerts</p>
              <p className="text-xs text-muted-foreground">Set up price and volume alerts</p>
            </div>
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="bg-card rounded-xl border p-6">
          <p className="text-muted-foreground text-center py-8">
            Your watchlist activity will appear here
          </p>
        </div>
      </div>
    </div>
  );
};
