import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRightLeft
} from "lucide-react";

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
