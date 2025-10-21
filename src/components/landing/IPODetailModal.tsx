import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, AlertTriangle, DollarSign, Calendar, Users, Building, BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface IPODetail {
  id: string;
  company: string;
  ticker: string;
  sector: string;
  date: string;
  expectedPrice: string;
  valuation: string;
  description: string;
  highlights: string[];
  risks: string[];
  financials: {
    revenue: string;
    growth: string;
    margins: string;
  };
  marketOpportunity: string;
  competitivePosition: string;
  investmentThesis: string;
}

interface IPODetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ipoData: IPODetail | null;
}

export const IPODetailModal = ({ open, onOpenChange, ipoData }: IPODetailModalProps) => {
  if (!ipoData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-3xl font-bold mb-2">
                {ipoData.company} ({ipoData.ticker})
              </DialogTitle>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary">{ipoData.sector}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {ipoData.date}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                Expected Price
              </div>
              <div className="text-2xl font-bold text-primary">{ipoData.expectedPrice}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Building className="w-4 h-4" />
                Valuation
              </div>
              <div className="text-2xl font-bold text-primary">{ipoData.valuation}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                Revenue Growth
              </div>
              <div className="text-2xl font-bold text-primary">{ipoData.financials.growth}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-bold mb-3">Company Overview</h3>
            <p className="text-muted-foreground leading-relaxed">{ipoData.description}</p>
          </div>

          <Separator />

          {/* Investment Thesis */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Investment Thesis
            </h3>
            <p className="text-muted-foreground leading-relaxed">{ipoData.investmentThesis}</p>
          </div>

          <Separator />

          {/* Key Highlights */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Key Highlights
            </h3>
            <ul className="space-y-2">
              {ipoData.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Risk Factors */}
          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Risk Factors
            </h3>
            <ul className="space-y-2">
              {ipoData.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Financial Metrics */}
          <div>
            <h3 className="text-xl font-bold mb-3">Financial Metrics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Revenue (TTM)</div>
                <div className="text-xl font-bold">{ipoData.financials.revenue}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">YoY Growth</div>
                <div className="text-xl font-bold text-green-600">{ipoData.financials.growth}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Gross Margins</div>
                <div className="text-xl font-bold">{ipoData.financials.margins}</div>
              </div>
            </div>
          </div>

          {/* Market Opportunity */}
          <div>
            <h3 className="text-xl font-bold mb-3">Market Opportunity</h3>
            <p className="text-muted-foreground leading-relaxed">{ipoData.marketOpportunity}</p>
          </div>

          {/* Competitive Position */}
          <div>
            <h3 className="text-xl font-bold mb-3">Competitive Position</h3>
            <p className="text-muted-foreground leading-relaxed">{ipoData.competitivePosition}</p>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> This analysis is for educational and informational purposes only. 
              It does not constitute investment advice or a recommendation to buy or sell securities. 
              All investment decisions should be made based on your own research and risk tolerance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
