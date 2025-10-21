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

// Dummy data normalization data
const fieldMappingData = [
  { field: "Email Address", mapped: 8234, unmapped: 156, quality: 98.1 },
  { field: "Phone Number", mapped: 6543, unmapped: 432, quality: 93.8 },
  { field: "Portfolio Size", mapped: 5678, unmapped: 234, quality: 96.0 },
  { field: "Annual Income", mapped: 4987, unmapped: 567, quality: 89.8 }
];

const duplicateRecords = [
  { name: "Sarah Chen", email: "s.chen@...", phone: "+44 20...", confidence: 95, status: "Pending Review" },
  { name: "Michael Torres", email: "m.torres@...", phone: "+1 415...", confidence: 88, status: "Auto-Merged" },
  { name: "James Park", email: "jpark@...", phone: "+852 9...", confidence: 72, status: "Flagged" }
];

const dataErrors = [
  { type: "Invalid Email Format", count: 23, severity: "Medium", lastSeen: "2 hours ago" },
  { type: "Missing Phone Verification", count: 156, severity: "Low", lastSeen: "5 hours ago" },
  { type: "Incomplete Survey Data", count: 89, severity: "Medium", lastSeen: "1 day ago" },
  { type: "Duplicate Portfolio Entry", count: 12, severity: "High", lastSeen: "3 hours ago" }
];

// Dummy communication logs data
const recentCommunications = [
  { 
    investor: "Sarah Chen", 
    type: "Email", 
    subject: "Re: Q1 2025 IPO Opportunities", 
    sentiment: "Positive", 
    date: "2 hours ago",
    preview: "Thanks for the detailed analysis on the tech IPOs. Very interested in..."
  },
  { 
    investor: "Michael Torres", 
    type: "AI Chat", 
    subject: "Portfolio diversification inquiry", 
    sentiment: "Neutral", 
    date: "5 hours ago",
    preview: "Can you explain more about the commodity futures platform..."
  },
  { 
    investor: "Lisa Wang", 
    type: "Phone Call", 
    subject: "Follow-up on USDT Markets", 
    sentiment: "Positive", 
    date: "1 day ago",
    preview: "Duration: 15 min. Discussed crypto exposure and risk tolerance..."
  },
  { 
    investor: "David Miller", 
    type: "Meeting", 
    subject: "Apple IPO Historical Analysis", 
    sentiment: "Positive", 
    date: "2 days ago",
    preview: "In-person meeting. Strong interest in tech sector opportunities..."
  }
];

const sentimentBreakdown = {
  positive: 1876,
  neutral: 987,
  negative: 234
};

// Dummy investor intelligence data
const engagementMetrics = [
  { investor: "Sarah Chen", opens: 24, clicks: 18, replies: 12, score: 94, status: "Hot" },
  { investor: "Michael Torres", opens: 18, clicks: 14, replies: 8, score: 82, status: "Warm" },
  { investor: "Lisa Wang", opens: 22, clicks: 16, replies: 10, score: 88, status: "Hot" },
  { investor: "David Miller", opens: 12, clicks: 8, replies: 5, score: 68, status: "Warm" }
];

const aiPredictions = [
  { investor: "Sarah Chen", likelihood: 92, reasoning: "High engagement, completed survey, strong portfolio", action: "Schedule call" },
  { investor: "James Park", likelihood: 85, reasoning: "Active in crypto IPOs, qualified portfolio size", action: "Send detailed prospectus" },
  { investor: "Emma Wilson", likelihood: 78, reasoning: "Consistent email opens, interested in tech sector", action: "Nurture sequence" }
];

const behavioralInsights = {
  avgOpenRate: 62.4,
  avgReplyTime: "4.2 hours",
  bestContactTime: "Tuesday 10-11 AM",
  preferredChannel: "Email (68%)",
  meetingFrequency: "2.3 per month"
};

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
                  <CardContent className="space-y-4">
                    {fieldMappingData.map((field, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-foreground">{field.field}</h4>
                          <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                            {field.quality}% Quality
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Mapped:</span> {field.mapped.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Unmapped:</span> {field.unmapped}
                          </div>
                        </div>
                        <Progress value={field.quality} className="h-1.5" />
                      </div>
                    ))}
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
                  <CardContent className="space-y-4">
                    {duplicateRecords.map((record, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">{record.name}</h4>
                            <p className="text-xs text-muted-foreground">{record.email}</p>
                          </div>
                          <Badge variant={record.status === "Pending Review" ? "outline" : "secondary"} className="text-xs">
                            {record.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Confidence: {record.confidence}%</span>
                          {record.status === "Pending Review" && (
                            <Button size="sm" variant="outline" className="h-6 text-xs">Review</Button>
                          )}
                        </div>
                      </div>
                    ))}
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
                  <CardContent className="space-y-3">
                    {dataErrors.map((error, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-foreground">{error.type}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{error.lastSeen}</p>
                          </div>
                          <Badge variant={error.severity === "High" ? "destructive" : error.severity === "Medium" ? "default" : "secondary"} className="text-xs">
                            {error.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{error.count} occurrences</span>
                          <Button size="sm" variant="ghost" className="h-6 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
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
                  <CardContent className="space-y-3">
                    <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Total Records</span>
                        <span className="text-sm font-bold text-foreground">8,234</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Corrected This Month</span>
                        <span className="text-sm font-semibold text-green-600">156</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pending Review</span>
                        <span className="text-sm font-semibold text-warning">43</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Open Correction Interface
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Communication Logs Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INVESTOR COMMUNICATION LOGS</h2>
              <p className="text-muted-foreground mb-6">Chronological record of every interaction with investors</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessagesSquare className="w-5 h-5" />
                      Recent Communications
                    </CardTitle>
                    <CardDescription>
                      Latest interactions across all channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentCommunications.map((comm, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm text-foreground">{comm.investor}</h4>
                              <Badge variant="outline" className="text-xs">{comm.type}</Badge>
                              <Badge variant={comm.sentiment === "Positive" ? "default" : comm.sentiment === "Neutral" ? "secondary" : "destructive"} className="text-xs">
                                {comm.sentiment}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{comm.subject}</p>
                            <p className="text-xs text-muted-foreground mt-2 italic">{comm.preview}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{comm.date}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smile className="w-5 h-5" />
                      Sentiment Breakdown
                    </CardTitle>
                    <CardDescription>
                      Overall communication sentiment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-sm">Positive</span>
                        </div>
                        <span className="text-sm font-semibold">{sentimentBreakdown.positive.toLocaleString()}</span>
                      </div>
                      <Progress value={(sentimentBreakdown.positive / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative)) * 100} className="h-2 bg-green-200" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full" />
                          <span className="text-sm">Neutral</span>
                        </div>
                        <span className="text-sm font-semibold">{sentimentBreakdown.neutral.toLocaleString()}</span>
                      </div>
                      <Progress value={(sentimentBreakdown.neutral / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative)) * 100} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-sm">Negative</span>
                        </div>
                        <span className="text-sm font-semibold">{sentimentBreakdown.negative.toLocaleString()}</span>
                      </div>
                      <Progress value={(sentimentBreakdown.negative / (sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative)) * 100} className="h-2 bg-red-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LinkIcon className="w-5 h-5" />
                      Communication Stats
                    </CardTitle>
                    <CardDescription>
                      Channel distribution and volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">3,097</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Interactions</p>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">89%</p>
                        <p className="text-xs text-muted-foreground mt-1">Response Rate</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-semibold">1,876 (61%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AI Chat</span>
                        <span className="font-semibold">987 (32%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-semibold">156 (5%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meetings</span>
                        <span className="font-semibold">78 (2%)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Investor Intelligence Section */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">INVESTOR INTELLIGENCE</h2>
              <p className="text-muted-foreground mb-6">Advanced analytics on investor behavior and engagement</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/70 border-border backdrop-blur-sm col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Top Engaged Investors
                    </CardTitle>
                    <CardDescription>
                      High-engagement prospects ranked by activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {engagementMetrics.map((investor, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                              {investor.investor.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{investor.investor}</h4>
                              <p className="text-xs text-muted-foreground">Score: {investor.score}/100</p>
                            </div>
                          </div>
                          <Badge variant={investor.status === "Hot" ? "destructive" : "default"} className="text-xs">
                            {investor.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Opens</p>
                            <p className="font-semibold text-foreground">{investor.opens}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Clicks</p>
                            <p className="font-semibold text-foreground">{investor.clicks}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Replies</p>
                            <p className="font-semibold text-foreground">{investor.replies}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Score</p>
                            <p className="font-semibold text-green-600">{investor.score}</p>
                          </div>
                        </div>
                        <Progress value={investor.score} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Predictions
                    </CardTitle>
                    <CardDescription>
                      Investment likelihood forecasts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiPredictions.map((prediction, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-foreground">{prediction.investor}</h4>
                          <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                            {prediction.likelihood}% likely
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{prediction.reasoning}</p>
                        <Button size="sm" variant="outline" className="w-full h-8 text-xs">
                          {prediction.action}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-card/70 border-border backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Behavioral Insights
                    </CardTitle>
                    <CardDescription>
                      Engagement patterns and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <p className="text-2xl font-bold text-foreground">{behavioralInsights.avgOpenRate}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Open Rate</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <p className="text-2xl font-bold text-foreground">{behavioralInsights.avgReplyTime}</p>
                        <p className="text-xs text-muted-foreground mt-1">Avg Reply Time</p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Best Contact Time</span>
                        <span className="font-semibold">{behavioralInsights.bestContactTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preferred Channel</span>
                        <span className="font-semibold">{behavioralInsights.preferredChannel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Meeting Frequency</span>
                        <span className="font-semibold">{behavioralInsights.meetingFrequency}</span>
                      </div>
                    </div>
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
