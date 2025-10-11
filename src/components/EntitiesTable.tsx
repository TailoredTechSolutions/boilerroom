import { useState } from "react";
import { ArrowUpDown, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Entity {
  id: string;
  companyName: string;
  registrySource: string;
  companyNumber: string;
  status: "Active" | "Inactive";
  score: number;
  country: string;
  countryFlag: string;
  lastUpdated: string;
}

interface EntitiesTableProps {
  entities: Entity[];
}

type SortField = "companyName" | "score" | "lastUpdated";
type SortDirection = "asc" | "desc";

export const EntitiesTable = ({ entities }: EntitiesTableProps) => {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedEntities = [...entities].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortField === "score") {
      return (a.score - b.score) * multiplier;
    }
    if (sortField === "companyName") {
      return a.companyName.localeCompare(b.companyName) * multiplier;
    }
    if (sortField === "lastUpdated") {
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime() * multiplier;
    }
    return 0;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-info";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort("companyName")}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Company Name
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Registry Source
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Company Number
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort("score")}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Score
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Country
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort("lastUpdated")}
                  className="flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  Last Updated
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedEntities.map((entity) => (
              <tr
                key={entity.id}
                onClick={() => setSelectedRow(entity.id)}
                className={`transition-all cursor-pointer ${
                  selectedRow === entity.id
                    ? "bg-primary/10 shadow-lg shadow-primary/5"
                    : "hover:bg-muted/30"
                }`}
              >
                <td className="p-4">
                  <p className="font-medium text-foreground">{entity.companyName}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-foreground">{entity.registrySource}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm font-mono text-muted-foreground">{entity.companyNumber}</p>
                </td>
                <td className="p-4">
                  <Badge
                    variant={entity.status === "Active" ? "default" : "secondary"}
                    className={
                      entity.status === "Active"
                        ? "bg-success/20 text-success border-success/50"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {entity.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getScoreColor(entity.score)}`}>
                        {entity.score}
                      </span>
                    </div>
                    <Progress value={entity.score} className="h-1.5" />
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{entity.countryFlag}</span>
                    <span className="text-sm text-muted-foreground">{entity.country}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-foreground">{entity.lastUpdated}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("View details:", entity.id);
                      }}
                      className="text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      See more
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                        <DropdownMenuItem>Flag Entity</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suppress</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
