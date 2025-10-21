import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { IPOMetricsCards } from "@/components/crm/IPOMetricsCards";
import { DealPipelineCard } from "@/components/crm/DealPipelineCard";
import { MarketIntelligenceCard } from "@/components/crm/MarketIntelligenceCard";
import { CriticalTasksCard } from "@/components/crm/CriticalTasksCard";
import { ComplianceTrackerCard } from "@/components/crm/ComplianceTrackerCard";
import { RevenueAnalyticsCard } from "@/components/crm/RevenueAnalyticsCard";
import { CompanyHealthCard } from "@/components/crm/CompanyHealthCard";

const CRM = () => {
  return (
    <div className="flex min-h-screen bg-gradient-bg relative">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-[1800px] mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">IPO Firm CRM Dashboard</h2>
              <p className="text-muted-foreground">Comprehensive deal pipeline, market intelligence, and compliance tracking</p>
            </div>

            {/* Key Metrics */}
            <IPOMetricsCards />

            {/* Deal Pipeline */}
            <DealPipelineCard />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketIntelligenceCard />
              <CriticalTasksCard />
            </div>

            {/* Compliance and Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComplianceTrackerCard />
              <RevenueAnalyticsCard />
            </div>

            {/* Company Health */}
            <CompanyHealthCard />

          </div>
        </main>
      </div>
    </div>
  );
};

export default CRM;
