import { useState } from "react";
import { Users, Target, TrendingUp, Mail, Phone, Building2, Search, Filter } from "lucide-react";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KPICard } from "@/components/KPICard";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { ContactOptionsModal } from "@/components/ContactOptionsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const LeadGeneration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Sample lead data
  const leads = [
    {
      id: "1",
      companyName: "TechStart Inc.",
      status: "Hot",
      contactName: "John Smith",
      email: "john@techstart.com",
      phone: "+1 555-0123",
      score: 85,
      lastContact: "2025-10-10"
    },
    {
      id: "2",
      companyName: "Global Ventures Ltd.",
      status: "Warm",
      contactName: "Sarah Johnson",
      email: "sarah@globalventures.com",
      phone: "+1 555-0456",
      score: 72,
      lastContact: "2025-10-08"
    },
    {
      id: "3",
      companyName: "Innovation Partners",
      status: "Cold",
      contactName: "Mike Davis",
      email: "mike@innovation.com",
      phone: "+1 555-0789",
      score: 45,
      lastContact: "2025-10-05"
    }
  ];

  const filteredLeads = leads.filter(lead =>
    lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-4xl font-bold text-foreground">Lead Generation</h1>
            <p className="text-muted-foreground">Manage and track your IPO leads and prospects</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Leads"
              value={leads.length}
              subtitle="Active prospects"
              icon={Users}
              variant="default"
            />
            <KPICard
              title="Hot Leads"
              value={leads.filter(l => l.status === "Hot").length}
              subtitle="High priority"
              icon={Target}
              variant="success"
            />
            <KPICard
              title="Conversion Rate"
              value="24%"
              subtitle="+5% this month"
              icon={TrendingUp}
              variant="purple"
            />
            <KPICard
              title="Avg. Score"
              value={Math.round(leads.reduce((acc, l) => acc + l.score, 0) / leads.length)}
              subtitle="Lead quality"
              icon={Target}
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
                  placeholder="Search leads by company or contact name..."
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 backdrop-blur-sm">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Score
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Last Contact
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
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <p className="font-medium text-foreground">{lead.companyName}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">{lead.contactName}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </span>
                          </div>
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
