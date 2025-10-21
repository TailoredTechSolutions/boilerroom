import { useState, useEffect } from "react";
import { Users, Target, TrendingUp, Mail, Phone, Building2, Search, Filter, X, DollarSign } from "lucide-react";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { ContactOptionsModal } from "@/components/ContactOptionsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const LeadGeneration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    let query = supabase
      .from('email_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });

    const { data, error } = await query;

    if (data) {
      setSubscribers(data);
    }
    setIsLoading(false);
  };

  // Transform subscribers into leads format
  const leads = subscribers.map(subscriber => {
    // Calculate lead quality score based on survey completion and data completeness
    let score = 50; // Base score
    if (subscriber.survey_completed) score += 30;
    if (subscriber.phone && subscriber.phone_verified) score += 10;
    if (subscriber.portfolio_size) score += 5;
    if (subscriber.annual_income) score += 5;
    
    // Calculate status based on score and survey completion
    let status = 'Cold';
    if (score >= 80 || subscriber.survey_completed) status = 'Hot';
    else if (score >= 60) status = 'Warm';

    return {
      id: subscriber.id,
      companyName: subscriber.name || 'Anonymous Investor',
      status,
      contactName: subscriber.name || 'N/A',
      email: subscriber.email,
      phone: subscriber.phone || 'N/A',
      score: Math.round(score),
      lastContact: subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toISOString().split('T')[0] : 'N/A',
      portfolioSize: subscriber.portfolio_size || 'N/A',
      experience: subscriber.experience || 'N/A',
      interestedSectors: subscriber.interested_sectors || [],
      annualIncome: subscriber.annual_income || 'N/A',
      capitalAvailable: subscriber.capital_available || 'N/A',
      surveyCompleted: subscriber.survey_completed || false,
      phoneVerified: subscriber.phone_verified || false,
      subscriptionStatus: subscriber.subscription_status || 'active',
      bestTimeToReach: subscriber.best_time_to_reach || 'N/A'
    };
  });

  const filteredLeads = leads.filter(lead =>
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate real-time KPI metrics
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === "Hot").length;
  const warmLeads = leads.filter(l => l.status === "Warm").length;
  const surveyCompleted = leads.filter(l => l.surveyCompleted).length;
  const phoneVerified = leads.filter(l => l.phoneVerified && l.phone !== 'N/A').length;
  const avgScore = totalLeads > 0 ? Math.round(leads.reduce((acc, l) => acc + l.score, 0) / totalLeads) : 0;
  const qualityLeadsPercentage = totalLeads > 0 ? Math.round((surveyCompleted / totalLeads) * 100) : 0;
  const contactableRate = totalLeads > 0 ? Math.round((phoneVerified / totalLeads) * 100) : 0;

  const getStatusColor = (status: string) => {
    if (status === "Hot") return "bg-destructive/20 text-destructive border-destructive/50";
    if (status === "Warm") return "bg-warning/20 text-warning border-warning/50";
    return "bg-info/20 text-info border-info/50";
  };

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
    setIsDetailModalOpen(true);
  };

  const handleContactLead = (lead: any) => {
    setSelectedLead(lead);
    setIsContactModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-bg">
      <NavigationSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader />

        <main className="flex-1 p-8 space-y-8">
          {/* Page Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Lead Generation</h1>
                <p className="text-muted-foreground">Manage and track your IPO investor leads from landing page signups</p>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total IPO Leads"
              value={isLoading ? "..." : totalLeads}
              subtitle={`${hotLeads} hot • ${warmLeads} warm`}
              icon={Users}
              variant="default"
            />
            <KPICard
              title="Hot Leads"
              value={isLoading ? "..." : hotLeads}
              subtitle={`${Math.round((hotLeads / totalLeads) * 100) || 0}% qualified`}
              icon={Target}
              variant="success"
            />
            <KPICard
              title="Survey Completed"
              value={isLoading ? "..." : `${qualityLeadsPercentage}%`}
              subtitle={`${surveyCompleted} full profiles`}
              icon={Mail}
              variant="purple"
            />
            <KPICard
              title="Avg. Quality"
              value={isLoading ? "..." : avgScore}
              subtitle={`${contactableRate}% phone verified`}
              icon={TrendingUp}
              variant="warning"
            />
          </div>

          {/* Search & Filter */}
          <Card className="p-6 backdrop-blur-sm bg-card border-border">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                  type="search"
                  placeholder="Search leads by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </Card>

          {/* Leads Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden backdrop-blur-sm">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>Loading leads from database...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No leads found matching your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 backdrop-blur-sm">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Investor Name
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Portfolio Size
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Score
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Subscribed
                      </th>
                      <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-muted/30 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{lead.companyName}</p>
                              {lead.surveyCompleted && (
                                <Badge variant="outline" className="mt-1 text-xs">Survey Complete</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="text-sm">{lead.email}</span>
                            </div>
                            {lead.phone !== 'N/A' && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                <span>{lead.phone}</span>
                                {lead.phoneVerified && (
                                  <Badge variant="outline" className="text-xs">Verified</Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{lead.portfolioSize}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{lead.score}</span>
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-primary"
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-muted-foreground">{lead.lastContact}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewLead(lead)}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-gradient-primary"
                              onClick={() => handleContactLead(lead)}
                            >
                              Contact
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <LeadDetailModal
        lead={selectedLead}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ContactOptionsModal
        lead={selectedLead}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default LeadGeneration;
