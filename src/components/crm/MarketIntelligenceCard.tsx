import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Calendar } from "lucide-react";

export const MarketIntelligenceCard = () => {
  const recentIPOs = [
    { ticker: "TECH", change: "+18.3%", volume: "12.4M", status: "success" },
    { ticker: "HLTH", change: "+9.2%", volume: "8.1M", status: "success" },
    { ticker: "FINX", change: "+15.7%", volume: "15.2M", status: "success" },
    { ticker: "CONS", change: "-2.4%", volume: "5.3M", status: "danger" },
  ];

  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          IPO Market Intelligence
        </CardTitle>
        <CardDescription>Real-time market conditions and trends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Health Index */}
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Market Health Index</h3>
            <Badge className="bg-success text-success-foreground">Favorable</Badge>
          </div>
          <div className="text-3xl font-bold text-success mb-3">7.2/10</div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Market Volatility (VIX)</span>
              <span className="text-success font-medium">16.4 (Low)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">IPO Pricing Success</span>
              <span className="text-warning font-medium">78% (Moderate)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">First-day Pops</span>
              <span className="text-success font-medium">Avg +12.3%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Withdrawn Filings</span>
              <span className="text-success font-medium">3 this month</span>
            </div>
          </div>
        </div>

        {/* Recent IPO Performance */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Recent IPO Performance</h3>
          <div className="space-y-2">
            {recentIPOs.map((ipo) => (
              <div key={ipo.ticker} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-foreground">{ipo.ticker}</span>
                  <div className="flex items-center gap-1">
                    {ipo.status === "success" ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className={ipo.status === "success" ? "text-success font-medium" : "text-destructive font-medium"}>
                      {ipo.change}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Vol: {ipo.volume}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Performance */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Hot Sectors</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="text-xs text-muted-foreground">Technology</div>
              <div className="text-lg font-bold text-success">+18%</div>
            </div>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <div className="text-xs text-muted-foreground">Healthcare</div>
              <div className="text-lg font-bold text-success">+9%</div>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="text-xs text-muted-foreground">Fintech</div>
              <div className="text-lg font-bold text-warning">+5%</div>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="text-xs text-muted-foreground">Consumer</div>
              <div className="text-lg font-bold text-destructive">-2%</div>
            </div>
          </div>
        </div>

        {/* Upcoming Competitor Deals */}
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-warning" />
            <h3 className="font-semibold text-foreground">Market Calendar</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            3 rival IPOs pricing this week
          </p>
          <Badge variant="outline" className="mt-2">Monitor for conflicts</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
