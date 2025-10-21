import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const companies = [
  {
    name: "TechVenture AI",
    sector: "SaaS",
    revenueGrowth: "+145%",
    burnRate: "$2M/mo",
    runway: "18mo",
    valuationTrend: "up",
    valuationChange: "+15%",
    risk: "low",
  },
  {
    name: "HealthTech Sol",
    sector: "Med Tech",
    revenueGrowth: "+89%",
    burnRate: "$1.2M/mo",
    runway: "24mo",
    valuationTrend: "stable",
    valuationChange: "Stable",
    risk: "low",
  },
  {
    name: "GreenEnergy",
    sector: "CleanTech",
    revenueGrowth: "+203%",
    burnRate: "$3.5M/mo",
    runway: "12mo",
    valuationTrend: "up",
    valuationChange: "+8%",
    risk: "medium",
  },
  {
    name: "FinTech Innov",
    sector: "Fintech",
    revenueGrowth: "+67%",
    burnRate: "$800K/mo",
    runway: "30mo",
    valuationTrend: "down",
    valuationChange: "-5%",
    risk: "medium",
  },
];

export const CompanyHealthCard = () => {
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-success text-success-foreground">Low</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getValuationIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Portfolio Company Health Metrics
        </CardTitle>
        <CardDescription>Key financial and operational indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Sector</TableHead>
                <TableHead className="font-semibold">Revenue Growth</TableHead>
                <TableHead className="font-semibold">Burn Rate</TableHead>
                <TableHead className="font-semibold">Runway</TableHead>
                <TableHead className="font-semibold">Valuation</TableHead>
                <TableHead className="font-semibold">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.name} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{company.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-success font-medium">{company.revenueGrowth}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{company.burnRate}</TableCell>
                  <TableCell>
                    <span
                      className={
                        parseInt(company.runway) < 15
                          ? "text-warning font-medium"
                          : "text-success font-medium"
                      }
                    >
                      {company.runway}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getValuationIcon(company.valuationTrend)}
                      <span
                        className={
                          company.valuationTrend === "up"
                            ? "text-success"
                            : company.valuationTrend === "down"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }
                      >
                        {company.valuationChange}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(company.risk)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 rounded-lg bg-info/10 border border-info/20">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> Click any company to view detailed
            financials, cap table, and full due diligence reports.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
