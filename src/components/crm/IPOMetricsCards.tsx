import { KPICard } from "@/components/KPICard";
import { Briefcase, DollarSign, TrendingUp, Receipt } from "lucide-react";

export const IPOMetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Active IPO Mandates"
        value={23}
        subtitle="12 Pre-filing | 8 Filed | 3 Priced"
        icon={Briefcase}
        variant="default"
      />
      <KPICard
        title="Total Deal Pipeline"
        value="$8.4B"
        subtitle="Aggregate Offering Size"
        icon={TrendingUp}
        variant="success"
      />
      <KPICard
        title="IPOs Completed YTD"
        value={17}
        subtitle="$3.2B Total Raised | 94.4% Success"
        icon={DollarSign}
        variant="purple"
      />
      <KPICard
        title="Expected Fees (6Mo)"
        value="$32.5M"
        subtitle="$18.2M Committed | $14.3M Probable"
        icon={Receipt}
        variant="warning"
      />
    </div>
  );
};
