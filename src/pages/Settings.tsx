import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    darkMode: false,
    autoRefresh: true,
    jobNotifications: true,
    highScoreNotifications: true,
    systemUpdates: false
  });

  const saveChanges = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const saveApiKeys = () => {
    toast({
      title: "API keys saved",
      description: "Your API configuration has been updated",
    });
  };

  const inviteTeamMember = () => {
    toast({
      title: "Invitation sent",
      description: "Team member invitation has been sent via email",
    });
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Admin User" defaultValue="Admin User" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="admin@vc.com" defaultValue="admin@vc.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Company Name" />
                    </div>
                    <Button onClick={saveChanges}>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your dashboard experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                      </div>
                      <Switch checked={settings.darkMode} onCheckedChange={() => toggleSetting('darkMode')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-refresh Data</Label>
                        <p className="text-sm text-muted-foreground">Refresh dashboard every 30 seconds</p>
                      </div>
                      <Switch checked={settings.autoRefresh} onCheckedChange={() => toggleSetting('autoRefresh')} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Choose what you want to be notified about</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Scraping Job Completed</Label>
                        <p className="text-sm text-muted-foreground">Notify when scraping jobs finish</p>
                      </div>
                      <Switch checked={settings.jobNotifications} onCheckedChange={() => toggleSetting('jobNotifications')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New High-Score Entities</Label>
                        <p className="text-sm text-muted-foreground">Alert for entities with score &gt; 90</p>
                      </div>
                      <Switch checked={settings.highScoreNotifications} onCheckedChange={() => toggleSetting('highScoreNotifications')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>System Updates</Label>
                        <p className="text-sm text-muted-foreground">Important system notifications</p>
                      </div>
                      <Switch checked={settings.systemUpdates} onCheckedChange={() => toggleSetting('systemUpdates')} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Configuration</CardTitle>
                    <CardDescription>Manage external API integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="n8n">n8n Webhook URL</Label>
                      <Input id="n8n" placeholder="https://your-n8n.app/webhook/..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companieshouse">Companies House API Key</Label>
                      <Input id="companieshouse" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gleif">GLEIF API Key</Label>
                      <Input id="gleif" type="password" placeholder="••••••••" />
                    </div>
                    <Button onClick={saveApiKeys}>Save API Keys</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">AD</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Admin User</p>
                            <p className="text-sm text-muted-foreground">admin@vc.com</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Owner</Button>
                      </div>
                      <Button variant="outline" className="w-full" onClick={inviteTeamMember}>+ Invite Team Member</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
