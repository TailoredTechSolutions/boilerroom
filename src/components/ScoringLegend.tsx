import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScoringCriteria {
  criterion: string;
  weight: number;
  scoringLogic: string;
  example: string;
}

const defaultCriteria: ScoringCriteria[] = [
  {
    criterion: "Company Active Status",
    weight: 25,
    scoringLogic: "0 if inactive, 25 if active",
    example: "Company registered & current → +25"
  },
  {
    criterion: "Negative Press / Sanctions Check",
    weight: 25,
    scoringLogic: "25 = no bad press or compliance hits; 10 = minor neutral mention; 0 = negative or flagged",
    example: "No bad press → +25"
  },
  {
    criterion: "Online Presence Weakness (Targetability)",
    weight: 25,
    scoringLogic: "25 = almost no web footprint (ideal target); 15 = moderate presence; 5 = strong, established brand",
    example: "Small online footprint → +25"
  },
  {
    criterion: "Available .com Domain",
    weight: 15,
    scoringLogic: "15 = available, 10 = alternative domain (.io, .co), 0 = unavailable",
    example: ".com free → +15"
  },
  {
    criterion: "Corporate Transparency / Registry Completeness",
    weight: 10,
    scoringLogic: "10 = all filings up-to-date, 5 = partial data, 0 = missing filings",
    example: "Fully updated registry info → +10"
  }
];

export function ScoringLegend() {
  const [weights, setWeights] = useState<number[]>(
    defaultCriteria.map(c => c.weight)
  );

  const handleWeightChange = (index: number, value: number[]) => {
    const newWeights = [...weights];
    newWeights[index] = value[0];
    setWeights(newWeights);
  };

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Scoring System Legend</h2>
          <p className="text-sm text-muted-foreground">
            Total Score: {totalWeight} points
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Criterion</TableHead>
              <TableHead className="w-[150px]">Weight</TableHead>
              <TableHead className="min-w-[300px]">Scoring Logic</TableHead>
              <TableHead className="min-w-[200px]">Example</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaultCriteria.map((criteria, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{criteria.criterion}</TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{weights[index]} pts</span>
                    </div>
                    <Slider
                      value={[weights[index]]}
                      onValueChange={(value) => handleWeightChange(index, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm">{criteria.scoringLogic}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{criteria.example}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
