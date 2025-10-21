import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Database, Bot, DollarSign, Users, Mail, Phone, Target, ArrowUp, ArrowDown, BarChart3 } from "lucide-react";

// Dummy analytics data
const conversionData = {
  totalVisits: 45678,
  signups: 8234,
  surveyCompleted: 3456,
  qualified: 1234,
  contacted: 876,
  conversionRate: 18.0,
  avgDays: 12
};

const registryPerformance = [
  { name: "Companies House UK", leads: 4567, quality: 85, cost: "$2.40", roi: "340%" },
  { name: "GLEIF", leads: 3421, quality: 78, cost: "$3.20", roi: "285%" },
  { name: "ICRIS Hong Kong", leads: 2134, quality: 72, cost: "$4.50", roi: "198%" },
  { name: "ASIC Australia", leads: 1876, quality: 68, cost: "$3.80", roi: "215%" }
];

const aiMetrics = {
  totalConversations: 12456,
  avgResponseTime: "2.3s",
  satisfaction: 4.6,
  leadQualified: 3456,
  autoResolved: 8234,
  escalated: 234
};

const marketingROI = {
  emailCampaigns: { spend: 5200, revenue: 20020, roi: 385 },
  socialMedia: { spend: 3800, revenue: 9310, roi: 245 },
  ppcAds: { spend: 4500, revenue: 7110, roi: 158 },
  contentMarketing: { spend: 2100, revenue: 6930, roi: 330 }
};

const Analytics = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">ANALYTICS & INSIGHTS</h2>
              <p className="text-muted-foreground">Performance dashboards and business intelligence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription>
                    Pipeline velocity from visitor to qualified lead
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Funnel Stages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Website Visits</span>
                      </div>
                      <span className="font-semibold">{conversionData.totalVisits.toLocaleString()}</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Email Signups</span>
                      </div>
                      <span className="font-semibold">{conversionData.signups.toLocaleString()}</span>
                    </div>
                    <Progress value={(conversionData.signups / conversionData.totalVisits) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Survey Completed</span>
                      </div>
                      <span className="font-semibold">{conversionData.surveyCompleted.toLocaleString()}</span>
                    </div>
                    <Progress value={(conversionData.surveyCompleted / conversionData.totalVisits) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Qualified Leads</span>
                      </div>
                      <span className="font-semibold">{conversionData.qualified.toLocaleString()}</span>
                    </div>
                    <Progress value={(conversionData.qualified / conversionData.totalVisits) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Overall Conversion</p>
                      <p className="text-2xl font-bold text-green-600">{conversionData.conversionRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Avg. Time to Convert</p>
                      <p className="text-2xl font-bold text-foreground">{conversionData.avgDays}d</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Registry Performance
                  </CardTitle>
                  <CardDescription>
                    Lead quality and cost by data source
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {registryPerformance.map((registry, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground text-sm">{registry.name}</h4>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {registry.roi}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Leads</p>
                          <p className="font-semibold text-foreground">{registry.leads.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quality</p>
                          <p className="font-semibold text-foreground">{registry.quality}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cost/Lead</p>
                          <p className="font-semibold text-foreground">{registry.cost}</p>
                        </div>
                      </div>
                      <Progress value={registry.quality} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    AI Agent Performance
                  </CardTitle>
                  <CardDescription>
                    Engagement and effectiveness metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">{aiMetrics.totalConversations.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Chats</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-foreground">{aiMetrics.avgResponseTime}</p>
                      <p className="text-xs text-muted-foreground mt-1">Avg Response</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{aiMetrics.satisfaction}/5</p>
                      <p className="text-xs text-muted-foreground mt-1">Satisfaction</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Leads Qualified</span>
                      <span className="text-sm font-semibold">{aiMetrics.leadQualified.toLocaleString()}</span>
                    </div>
                    <Progress value={(aiMetrics.leadQualified / aiMetrics.totalConversations) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Auto-Resolved</span>
                      <span className="text-sm font-semibold">{aiMetrics.autoResolved.toLocaleString()}</span>
                    </div>
                    <Progress value={(aiMetrics.autoResolved / aiMetrics.totalConversations) * 100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Escalated to Human</span>
                      <span className="text-sm font-semibold">{aiMetrics.escalated}</span>
                    </div>
                    <Progress value={(aiMetrics.escalated / aiMetrics.totalConversations) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/70 border-border backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Marketing ROI
                  </CardTitle>
                  <CardDescription>
                    Channel performance and budget efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(marketingROI).map(([channel, data], idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground text-sm capitalize">
                          {channel.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <Badge variant={data.roi > 250 ? "default" : "secondary"}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {data.roi}% ROI
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Spend</p>
                          <p className="font-semibold text-foreground">${data.spend.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue</p>
                          <p className="font-semibold text-green-600">${data.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Profit</p>
                          <p className="font-semibold text-green-600">${(data.revenue - data.spend).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          ${Object.values(marketingROI).reduce((sum, d) => sum + d.revenue, 0).toLocaleString()} revenue
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ${Object.values(marketingROI).reduce((sum, d) => sum + d.spend, 0).toLocaleString()} spent
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
