import { NavigationSidebar } from "@/components/NavigationSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";

const RulesScoring = () => {
  const scoringRules = [
    { id: 1, name: "Data Completeness", weight: 30, enabled: true, description: "Score based on profile completion" },
    { id: 2, name: "Web Presence", weight: 25, enabled: true, description: "Active website and social media" },
    { id: 3, name: "Recent Activity", weight: 20, enabled: true, description: "Recent filings and updates" },
    { id: 4, name: "Officer Quality", weight: 15, enabled: true, description: "Number and quality of officers" },
    { id: 5, name: "Financial Health", weight: 10, enabled: false, description: "Based on filed accounts" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Rules & Scoring</h2>
                <p className="text-muted-foreground">Configure scoring algorithms and filtering rules</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scoring Algorithm</CardTitle>
                <CardDescription>
                  Adjust weights for different scoring factors. Total must equal 100%.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {scoringRules.map((rule) => (
                  <div key={rule.id} className="space-y-3 pb-6 border-b border-border last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Switch checked={rule.enabled} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{rule.name}</h4>
                            <Badge variant="secondary">{rule.weight}%</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    {rule.enabled && (
                      <Slider
                        defaultValue={[rule.weight]}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Filtering Rules</CardTitle>
                <CardDescription>
                  Automatic filters applied to incoming data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Exclude Dissolved Companies</h4>
                      <p className="text-sm text-muted-foreground">Automatically filter out dissolved entities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Minimum Score Threshold</h4>
                      <p className="text-sm text-muted-foreground">Only show entities with score ≥ 50</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">Negative Press Filter</h4>
                      <p className="text-sm text-muted-foreground">Flag entities with negative media coverage</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RulesScoring;
