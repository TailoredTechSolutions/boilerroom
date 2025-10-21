import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Workflow, 
  BarChart, 
  Layers, 
  MapPin, 
  Copy, 
  AlertCircle, 
  Edit,
  MessagesSquare,
  Smile,
  Search,
  Link as LinkIcon,
  Target,
  Brain,
  TrendingUp,
  Flame,
  BookOpen,
  FileText,
  Users,
  GitBranch,
  Clock,
  Database,
  ArrowRightLeft,
  Play,
  Pause,
  Eye
} from "lucide-react";

// Dummy campaign data
const campaigns = [
  {
    id: 1,
    name: "IPO Alert Series Q1 2025",
    type: "Email",
    status: "Active",
    sent: 15234,
    opened: 8542,
    clicked: 3421,
    converted: 287,
    budget: "$5,200",
    roi: "385%"
  },
  {
    id: 2,
    name: "LinkedIn Tech Investors",
    type: "Social",
    status: "Active",
    impressions: 45678,
    engagement: 4567,
    clicks: 1234,
    leads: 89,
    budget: "$3,800",
    roi: "245%"
  },
  {
    id: 3,
    name: "Google Ads - Crypto IPOs",
    type: "PPC",
    status: "Paused",
    impressions: 125000,
    clicks: 2450,
    conversions: 45,
    cost: "$4,500",
    budget: "$6,000",
    roi: "158%"
  }
];

// Dummy automation workflows
const workflows = [
  {
    name: "New Subscriber Onboarding",
    trigger: "Email signup",
    steps: 5,
    active: 234,
    completed: 1876,
    status: "Active"
  },
  {
    name: "Hot Lead Nurture Sequence",
    trigger: "Survey completion",
    steps: 7,
    active: 89,
    completed: 456,
    status: "Active"
  },
  {
    name: "Re-engagement Campaign",
    trigger: "30 days inactive",
    steps: 4,
    active: 145,
    completed: 678,
    status: "Active"
  }
];

const Marketing = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Marketing Automation Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">MARKETING AUTOMATION</h2>
              <p className="text-muted-foreground mb-6">Campaign management and growth scaling</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <CardContent className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{campaign.name}</h4>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{campaign.type}</Badge>
                              <Badge variant={campaign.status === "Active" ? "default" : "secondary"} className="text-xs">
                                {campaign.status}
                              </Badge>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost">
                            {campaign.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {campaign.type === "Email" && (
                            <>
                              <div><span className="text-muted-foreground">Sent:</span> {campaign.sent?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Opened:</span> {campaign.opened?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Clicked:</span> {campaign.clicked?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Converted:</span> {campaign.converted}</div>
                            </>
                          )}
                          {campaign.type === "Social" && (
                            <>
                              <div><span className="text-muted-foreground">Impressions:</span> {campaign.impressions?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Engagement:</span> {campaign.engagement?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Clicks:</span> {campaign.clicks?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Leads:</span> {campaign.leads}</div>
                            </>
                          )}
                          {campaign.type === "PPC" && (
                            <>
                              <div><span className="text-muted-foreground">Impressions:</span> {campaign.impressions?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Clicks:</span> {campaign.clicks?.toLocaleString()}</div>
                              <div><span className="text-muted-foreground">Conversions:</span> {campaign.conversions}</div>
                              <div><span className="text-muted-foreground">Cost:</span> {campaign.cost}</div>
                            </>
                          )}
                          <div><span className="text-muted-foreground">Budget:</span> {campaign.budget}</div>
                          <div className="text-green-600 font-semibold"><span className="text-muted-foreground">ROI:</span> {campaign.roi}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="w-5 h-5" />
                      Automation Workflows
                    </CardTitle>
                    <CardDescription>
                      Trigger-based automation sequences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {workflows.map((workflow, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{workflow.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Trigger: {workflow.trigger}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-800">{workflow.status}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div><span className="text-muted-foreground">Steps:</span> {workflow.steps}</div>
                          <div><span className="text-muted-foreground">Active:</span> {workflow.active}</div>
                          <div><span className="text-muted-foreground">Completed:</span> {workflow.completed}</div>
                        </div>
                        <Progress value={(workflow.completed / (workflow.completed + workflow.active)) * 100} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="w-5 h-5" />
                      Campaign Analytics
                    </CardTitle>
                    <CardDescription>
                      Performance metrics across all channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Email Open Rate</span>
                        <span className="text-sm font-semibold">56.1%</span>
                      </div>
                      <Progress value={56.1} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Click-Through Rate</span>
                        <span className="text-sm font-semibold">22.5%</span>
                      </div>
                      <Progress value={22.5} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-semibold">8.4%</span>
                      </div>
                      <Progress value={8.4} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Spend</p>
                        <p className="text-lg font-bold text-foreground">$15,500</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Avg ROI</p>
                        <p className="text-lg font-bold text-green-600">262%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Data Normalization Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">DATA NORMALIZATION & QUALITY</h2>
              <p className="text-muted-foreground mb-6">Quality assurance for consistent data structure and integrity</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Field Mapping
                    </CardTitle>
                    <CardDescription>
                      Automated standardization of data fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Field mapping tools coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Copy className="w-5 h-5" />
                      Duplicate Detection
                    </CardTitle>
                    <CardDescription>
                      Record merging with approval flow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Duplicate management coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Error Reporting
                    </CardTitle>
                    <CardDescription>
                      Anomaly detection with exportable logs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Error tracking coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Manual Correction
                    </CardTitle>
                    <CardDescription>
                      Admin panel for fixing mis-parsed data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Correction interface coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Communication Logs Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INVESTOR COMMUNICATION LOGS</h2>
              <p className="text-muted-foreground mb-6">Chronological record of every interaction with investors</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessagesSquare className="w-5 h-5" />
                      Unified Feed
                    </CardTitle>
                    <CardDescription>
                      AI chats, emails, calls, and meeting notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Communication feed coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smile className="w-5 h-5" />
                      Sentiment Analysis
                    </CardTitle>
                    <CardDescription>
                      Positive / neutral / negative tagging
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Sentiment tagging coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Keyword Search
                    </CardTitle>
                    <CardDescription>
                      Search by topic, investor, date, or channel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Search interface coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      CRM Integration
                    </CardTitle>
                    <CardDescription>
                      Direct linkage to records and analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">CRM linking coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Investor Intelligence Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INVESTOR INTELLIGENCE</h2>
              <p className="text-muted-foreground mb-6">Advanced analytics on investor behavior and engagement</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Engagement Tracking
                    </CardTitle>
                    <CardDescription>
                      Track which leads engage with outreach and portal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Engagement metrics coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Interest Prediction
                    </CardTitle>
                    <CardDescription>
                      Predict investor interest based on sentiment and behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">AI predictions coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-5 h-5" />
                      Warm Lead Lists
                    </CardTitle>
                    <CardDescription>
                      Auto-generated lists of high-engagement prospects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Lead lists coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Behavioral Analytics
                    </CardTitle>
                    <CardDescription>
                      Open rates, reply sentiment, meeting frequency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Behavioral insights coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Knowledge Hub Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">KNOWLEDGE HUB</h2>
              <p className="text-muted-foreground mb-6">Internal documentation and team resources</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Process Documentation
                    </CardTitle>
                    <CardDescription>
                      SOPs and workflow documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Documentation editor coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Investor Profiles
                    </CardTitle>
                    <CardDescription>
                      Detailed profiles and relationship notes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Profile database coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Knowledge Search
                    </CardTitle>
                    <CardDescription>
                      Full-text search across all documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Search functionality coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Team Resources
                    </CardTitle>
                    <CardDescription>
                      Shared resources and best practices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Resource library coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Integration Logs Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INTEGRATION LOGS</h2>
              <p className="text-muted-foreground mb-6">Data flow tracking and debugging</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Activity Timeline
                    </CardTitle>
                    <CardDescription>
                      Timestamped activity logs for debugging
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Activity logs coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRightLeft className="w-5 h-5" />
                      Data Movement
                    </CardTitle>
                    <CardDescription>
                      Track data between CRM, scraper, and AI agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Data flow tracking coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      API Integration Status
                    </CardTitle>
                    <CardDescription>
                      Monitor all external API connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">API monitoring coming soon...</p>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5" />
                      Workflow Verification
                    </CardTitle>
                    <CardDescription>
                      Verify leads aren't vanishing into API purgatory
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Verification tools coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Marketing;
