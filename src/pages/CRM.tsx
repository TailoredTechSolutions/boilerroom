import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Kanban, ListTodo, MessageSquare, Mail, Workflow, BarChart, TrendingUp, Database, Bot, DollarSign, Trello, Percent, BarChart2, Megaphone, BarChart3 } from "lucide-react";

const CRM = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">CRM CORE</h2>
              <p className="text-muted-foreground">Manage relationships, pipelines, and communications</p>
            </div>

            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
                <TabsTrigger value="tasks">Tasks & Notes</TabsTrigger>
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="pipeline-performance">Pipeline Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="space-y-6 mt-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Contacts Management
                    </CardTitle>
                    <CardDescription>
                      Manage investors, founders, and firms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Contact management interface coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pipelines" className="space-y-6 mt-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Kanban className="w-5 h-5" />
                      Sales Pipelines
                    </CardTitle>
                    <CardDescription>
                      Visual Kanban: Lead → Qualified → Negotiation → Onboarded
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Pipeline view coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6 mt-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ListTodo className="w-5 h-5" />
                      Tasks & Notes
                    </CardTitle>
                    <CardDescription>
                      Activity logging, reminders, and notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Task management interface coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communications" className="space-y-6 mt-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Communication Logs
                    </CardTitle>
                    <CardDescription>
                      Emails, calls, and AI agent interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Communication history coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="marketing" className="space-y-6 mt-6">
                <div className="space-y-6">
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        Campaign Management
                      </CardTitle>
                      <CardDescription>
                        Email, social media, and PPC campaigns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Campaign builder coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Workflow className="w-5 h-5" />
                        Automation Workflows
                      </CardTitle>
                      <CardDescription>
                        Trigger-based automation: "New lead from ASIC → nurture sequence"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Workflow builder coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart className="w-5 h-5" />
                        Campaign Analytics
                      </CardTitle>
                      <CardDescription>
                        CTR, conversions, and lead sources
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Campaign analytics coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Conversion Trends
                      </CardTitle>
                      <CardDescription>
                        Pipeline velocity and conversion analytics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Conversion analytics coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Registry Performance
                      </CardTitle>
                      <CardDescription>
                        Which registry yields the best leads
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Registry analytics coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        AI Agent Performance
                      </CardTitle>
                      <CardDescription>
                        AI engagement and effectiveness metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">AI performance metrics coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Marketing ROI
                      </CardTitle>
                      <CardDescription>
                        Integrated CRM and campaign data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">ROI analytics coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pipeline-performance" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trello className="w-5 h-5" />
                        Pipeline Visualization
                      </CardTitle>
                      <CardDescription>
                        Kanban and chart views of stages
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Pipeline views coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Percent className="w-5 h-5" />
                        Conversion Metrics
                      </CardTitle>
                      <CardDescription>
                        Conversion rates and deal velocity
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Conversion analytics coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Value Projections
                      </CardTitle>
                      <CardDescription>
                        Revenue forecasts and projections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Projections coming soon...</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/70 border-border backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Trend Analysis
                      </CardTitle>
                      <CardDescription>
                        Performance over custom date ranges
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Trend charts coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CRM;
