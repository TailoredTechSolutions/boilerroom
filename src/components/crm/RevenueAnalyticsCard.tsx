import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";

const quarterData = [
  { name: "Gross Spread", value: 12.3 },
  { name: "Advisory", value: 3.8 },
  { name: "Incentive", value: 1.2 },
];

const forecastData = [
  { month: "Jan", committed: 5.2, probable: 3.1, pipeline: 2.8 },
  { month: "Feb", committed: 6.1, probable: 3.8, pipeline: 3.2 },
  { month: "Mar", committed: 7.0, probable: 4.2, pipeline: 3.5 },
  { month: "Apr", committed: 8.2, probable: 4.8, pipeline: 4.1 },
  { month: "May", committed: 9.5, probable: 5.3, pipeline: 4.6 },
  { month: "Jun", committed: 10.8, probable: 6.0, pipeline: 5.2 },
];

export const RevenueAnalyticsCard = () => {
  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Revenue Analytics & Projections
        </CardTitle>
        <CardDescription>Fee breakdown and 6-month forecast</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Quarter */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            Current Quarter Performance
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-xs text-muted-foreground mb-1">Gross Underwriting</div>
              <div className="text-2xl font-bold text-primary">$12.3M</div>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="text-xs text-muted-foreground mb-1">Advisory Fees</div>
              <div className="text-2xl font-bold text-success">$3.8M</div>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="text-xs text-muted-foreground mb-1">Incentive Fees</div>
              <div className="text-2xl font-bold text-warning">$1.2M</div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-success/10 border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-3xl font-bold text-success">$17.3M</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">vs Target</div>
                <div className="text-2xl font-bold text-success">115%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Breakdown Chart */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Fee Structure</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quarterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 6-Month Forecast */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">6-Month Rolling Forecast</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="committed"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                name="Committed"
              />
              <Line
                type="monotone"
                dataKey="probable"
                stroke="hsl(var(--warning))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Probable"
              />
              <Line
                type="monotone"
                dataKey="pipeline"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={1}
                strokeDasharray="3 3"
                name="Pipeline"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
