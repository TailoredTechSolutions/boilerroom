import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, DollarSign, User } from "lucide-react";

const pipelineStages = [
  {
    stage: "Pitch/Mandate",
    color: "bg-warning",
    deals: [
      {
        company: "TechVenture AI Inc.",
        sector: "Enterprise SaaS",
        valuation: "$450M - $600M",
        offering: "$120M",
        banker: "Sarah Chen",
        probability: "60%",
        nextAction: "Board presentation - Mar 5",
      },
    ],
  },
  {
    stage: "Preparation",
    color: "bg-info",
    deals: [
      {
        company: "HealthTech Solutions",
        sector: "Med Tech",
        status: "Financial audit in progress",
        targetFiling: "Q2 2025",
        tier: "Lead Left",
        fees: "$2.8M",
        daysInStage: "34 days",
      },
    ],
  },
  {
    stage: "SEC Review",
    color: "bg-primary",
    deals: [
      {
        company: "GreenEnergy Corp",
        sector: "CleanTech",
        filing: "S-1/A (Amendment 2)",
        comment: "Received - 14 days ago",
        responseDue: "Feb 28, 2025",
        valuation: "$1.2B",
        offering: "$200M",
      },
    ],
  },
  {
    stage: "Road Show",
    color: "bg-accent",
    deals: [
      {
        company: "FinTech Innovations Ltd",
        sector: "Fintech",
        roadshow: "Day 5 of 12",
        cities: "NY ✓ | BOS ✓ | SF Today | LA Tomorrow",
        bookBuilding: "$340M (2.1x oversubscribed)",
        priceRange: "$18-$21",
        anchors: "12 confirmed",
      },
    ],
  },
  {
    stage: "Priced/Closing",
    color: "bg-success",
    deals: [
      {
        company: "DataCloud Systems",
        sector: "Cloud Infrastructure",
        priced: "$24.50 (above range)",
        raised: "$180M",
        firstDay: "+23.5%",
        lockup: "180 days",
        greenshoe: "Fully exercised",
      },
    ],
  },
];

export const DealPipelineCard = () => {
  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>IPO Deal Pipeline</CardTitle>
            <CardDescription>Active mandates by stage</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="stage">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage">By Stage</SelectItem>
                <SelectItem value="date">Target Date</SelectItem>
                <SelectItem value="size">Deal Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {pipelineStages.map((stage) => (
            <div key={stage.stage} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold text-sm">{stage.stage}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {stage.deals.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {stage.deals.map((deal, idx) => (
                  <Card key={idx} className="bg-card hover:bg-card/80 transition-colors cursor-pointer border-border/50">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-foreground">{deal.company}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{deal.sector}</p>
                        </div>
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                      </div>
                      
                      {deal.valuation && (
                        <div className="flex items-center gap-1 text-xs">
                          <DollarSign className="w-3 h-3 text-success" />
                          <span className="text-muted-foreground">{deal.valuation}</span>
                        </div>
                      )}
                      
                      {deal.offering && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Offering: </span>
                          <span className="font-medium text-foreground">{deal.offering}</span>
                        </div>
                      )}
                      
                      {deal.banker && (
                        <div className="flex items-center gap-1 text-xs">
                          <User className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">{deal.banker}</span>
                        </div>
                      )}
                      
                      {deal.nextAction && (
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-warning" />
                          <span className="text-muted-foreground">{deal.nextAction}</span>
                        </div>
                      )}
                      
                      {deal.probability && (
                        <Badge variant="outline" className="text-xs">
                          {deal.probability}
                        </Badge>
                      )}

                      {deal.status && (
                        <p className="text-xs text-muted-foreground">{deal.status}</p>
                      )}

                      {deal.filing && (
                        <p className="text-xs text-info">{deal.filing}</p>
                      )}

                      {deal.roadshow && (
                        <p className="text-xs text-accent">{deal.roadshow}</p>
                      )}

                      {deal.priced && (
                        <p className="text-xs text-success font-medium">{deal.priced}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
