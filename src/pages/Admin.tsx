import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Users, Bell, TrendingUp, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscription_status: string;
  survey_completed: boolean;
  created_at: string;
  portfolio_size: string | null;
  experience: string | null;
}

interface Alert {
  id: string;
  title: string;
  content: string;
  alert_type: string;
  company_name: string | null;
  published_at: string;
  sent_to_subscribers: boolean;
}

const Admin = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    surveysCompleted: 0,
    alertsSent: 0
  });

  const [newAlert, setNewAlert] = useState({
    title: "",
    content: "",
    alert_type: "market_update",
    company_name: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subscribers
      const { data: subsData, error: subsError } = await supabase
        .from('email_subscribers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (subsError) throw subsError;
      setSubscribers(subsData || []);

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('market_alerts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20);

      if (alertsError) throw alertsError;
      setAlerts(alertsData || []);

      // Calculate stats
      const totalSubs = subsData?.length || 0;
      const activeSubs = subsData?.filter(s => s.subscription_status === 'active').length || 0;
      const surveysCompleted = subsData?.filter(s => s.survey_completed).length || 0;
      const alertsSent = alertsData?.filter(a => a.sent_to_subscribers).length || 0;

      setStats({
        totalSubscribers: totalSubs,
        activeSubscribers: activeSubs,
        surveysCompleted,
        alertsSent
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!newAlert.title || !newAlert.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('market_alerts')
        .insert({
          title: newAlert.title,
          content: newAlert.content,
          alert_type: newAlert.alert_type,
          company_name: newAlert.company_name || null,
          sent_to_subscribers: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Market alert created successfully"
      });

      setNewAlert({
        title: "",
        content: "",
        alert_type: "market_update",
        company_name: ""
      });

      fetchData();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create alert",
        variant: "destructive"
      });
    }
  };

  const sendAlertToSubscribers = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('market_alerts')
        .update({ sent_to_subscribers: true })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Alert Sent",
        description: "Alert marked as sent to subscribers"
      });

      fetchData();
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Error",
        description: "Failed to send alert",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
              <p className="text-muted-foreground">Manage subscribers, alerts, and platform content</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSubscribers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surveys Completed</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.surveysCompleted}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alerts Sent</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.alertsSent}</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="subscribers" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                <TabsTrigger value="alerts">Market Alerts</TabsTrigger>
                <TabsTrigger value="create-alert">Create Alert</TabsTrigger>
              </TabsList>

              <TabsContent value="subscribers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Subscribers</CardTitle>
                    <CardDescription>Manage your subscriber base</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-muted-foreground">Loading subscribers...</p>
                    ) : subscribers.length === 0 ? (
                      <p className="text-muted-foreground">No subscribers yet</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Survey</TableHead>
                            <TableHead>Portfolio</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers.map((sub) => (
                            <TableRow key={sub.id}>
                              <TableCell className="font-medium">{sub.email}</TableCell>
                              <TableCell>{sub.name || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={sub.subscription_status === 'active' ? 'default' : 'secondary'}>
                                  {sub.subscription_status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {sub.survey_completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                )}
                              </TableCell>
                              <TableCell>{sub.portfolio_size || '-'}</TableCell>
                              <TableCell>{sub.experience || '-'}</TableCell>
                              <TableCell>{new Date(sub.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Alerts</CardTitle>
                    <CardDescription>View and manage published alerts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-muted-foreground">Loading alerts...</p>
                    ) : alerts.length === 0 ? (
                      <p className="text-muted-foreground">No alerts created yet</p>
                    ) : (
                      <div className="space-y-4">
                        {alerts.map((alert) => (
                          <Card key={alert.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                                  <CardDescription className="mt-1">
                                    {alert.company_name && `${alert.company_name} • `}
                                    {new Date(alert.published_at).toLocaleString()}
                                  </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={alert.sent_to_subscribers ? 'default' : 'secondary'}>
                                    {alert.sent_to_subscribers ? 'Sent' : 'Draft'}
                                  </Badge>
                                  <Badge variant="outline">{alert.alert_type}</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4">{alert.content}</p>
                              {!alert.sent_to_subscribers && (
                                <Button 
                                  size="sm" 
                                  onClick={() => sendAlertToSubscribers(alert.id)}
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send to Subscribers
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="create-alert" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Market Alert</CardTitle>
                    <CardDescription>Create a new alert to notify subscribers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="alert-title">Title</Label>
                      <Input
                        id="alert-title"
                        placeholder="e.g., Major Tech IPO Announced"
                        value={newAlert.title}
                        onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-type">Alert Type</Label>
                      <Select 
                        value={newAlert.alert_type}
                        onValueChange={(value) => setNewAlert({ ...newAlert, alert_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="market_update">Market Update</SelectItem>
                          <SelectItem value="ipo_announcement">IPO Announcement</SelectItem>
                          <SelectItem value="filing">Filing Alert</SelectItem>
                          <SelectItem value="price_change">Price Change</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name (Optional)</Label>
                      <Input
                        id="company-name"
                        placeholder="e.g., Acme Corp"
                        value={newAlert.company_name}
                        onChange={(e) => setNewAlert({ ...newAlert, company_name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alert-content">Content</Label>
                      <Textarea
                        id="alert-content"
                        placeholder="Enter the alert message content..."
                        rows={6}
                        value={newAlert.content}
                        onChange={(e) => setNewAlert({ ...newAlert, content: e.target.value })}
                      />
                    </div>

                    <Button onClick={createAlert} className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Create Alert
                    </Button>
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

export default Admin;
