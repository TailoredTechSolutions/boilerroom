import { useState, useEffect } from "react";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  id: string;
  alert_type: string;
  alert_message: string;
  is_read: boolean;
  created_at: string;
  alert_data: any;
}

export const AlertsTab = () => {
  const { user } = useAuthUser();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("user_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (alertId: string) => {
    const { error } = await supabase
      .from("user_alerts")
      .update({ is_read: true })
      .eq("id", alertId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as read",
        variant: "destructive",
      });
    } else {
      fetchAlerts();
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("user_alerts")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "All alerts marked as read",
      });
      fetchAlerts();
    }
  };

  const filteredAlerts =
    filter === "unread" ? alerts.filter((a) => !a.is_read) : alerts;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Alerts</h2>
          <p className="text-muted-foreground">Stay updated on your watchlist</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            size="sm"
          >
            Unread
          </Button>
          {alerts.some((a) => !a.is_read) && (
            <Button variant="outline" onClick={markAllAsRead} size="sm">
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {filter === "unread" ? "No unread alerts" : "No alerts yet"}
          </h3>
          <p className="text-muted-foreground">
            {filter === "unread"
              ? "You're all caught up!"
              : "Alerts will appear here when your watchlist conditions are met"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-card rounded-lg border p-4 transition-all ${
                !alert.is_read ? "border-primary bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell
                      className={`h-4 w-4 ${
                        !alert.is_read ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      {alert.alert_type}
                    </span>
                    {!alert.is_read && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="font-medium mb-1">{alert.alert_message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(alert.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                {!alert.is_read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(alert.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
