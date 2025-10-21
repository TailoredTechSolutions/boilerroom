import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Mail, Save, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
});

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, isPremium, updateProfile } = useAuthUser();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [alertPreferences, setAlertPreferences] = useState({
    ipo_alerts: true,
    market_news: true,
    weekly_digest: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setAlertPreferences(profile.alert_preferences || {
        ipo_alerts: true,
        market_news: true,
        weekly_digest: true,
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    try {
      profileSchema.parse({ full_name: fullName });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setIsSaving(true);

    const { error } = await updateProfile({
      full_name: fullName,
      alert_preferences: alertPreferences,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }

    setIsSaving(false);
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
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Account Information</h2>
                  <p className="text-sm text-muted-foreground">
                    {isPremium ? "Premium Member" : "Free Account"}
                  </p>
                </div>
              </div>
              {!isPremium && (
                <Button onClick={() => navigate("/premium")} size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade
                </Button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          {/* Alert Preferences */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">Email Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">IPO Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new IPO filings and updates
                  </p>
                </div>
                <Switch
                  checked={alertPreferences.ipo_alerts}
                  onCheckedChange={(checked) =>
                    setAlertPreferences({ ...alertPreferences, ipo_alerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Market News</p>
                  <p className="text-sm text-muted-foreground">
                    Receive important market news and updates
                  </p>
                </div>
                <Switch
                  checked={alertPreferences.market_news}
                  onCheckedChange={(checked) =>
                    setAlertPreferences({ ...alertPreferences, market_news: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">
                    Get a weekly summary of IPO activity
                  </p>
                </div>
                <Switch
                  checked={alertPreferences.weekly_digest}
                  onCheckedChange={(checked) =>
                    setAlertPreferences({ ...alertPreferences, weekly_digest: checked })
                  }
                />
              </div>

              <Button onClick={handleSave} variant="outline" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">Password & Security</h2>
            <Button
              onClick={() => navigate("/forgot-password")}
              variant="outline"
            >
              Change Password
            </Button>
          </div>

          {/* Subscription */}
          {isPremium && (
            <div className="bg-card rounded-xl border p-6">
              <h2 className="text-lg font-bold mb-4">Subscription</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Premium {profile?.subscription_tier === 'premium_annual' ? 'Annual' : 'Monthly'}</p>
                  <p className="text-sm text-muted-foreground">Active subscription</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
