import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  status: string;
  scoreRange: [number, number];
  country: string;
  filterStatus?: string;
  hasNegativePress?: boolean;
  domainAvailable?: boolean;
}

export const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [hasNegativePress, setHasNegativePress] = useState<boolean | undefined>(undefined);
  const [domainAvailable, setDomainAvailable] = useState<boolean | undefined>(undefined);

  const updateFilters = () => {
    onFilterChange({ 
      status, 
      scoreRange, 
      country,
      filterStatus: filterStatus === "all" ? undefined : filterStatus,
      hasNegativePress: hasNegativePress === undefined ? undefined : hasNegativePress,
      domainAvailable: domainAvailable === undefined ? undefined : domainAvailable
    });
  };

  const handleScoreChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setScoreRange(newRange);
    onFilterChange({ 
      status, 
      scoreRange: newRange, 
      country,
      filterStatus: filterStatus === "all" ? undefined : filterStatus,
      hasNegativePress,
      domainAvailable
    });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ 
      status: value, 
      scoreRange, 
      country,
      filterStatus: filterStatus === "all" ? undefined : filterStatus,
      hasNegativePress,
      domainAvailable
    });
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    onFilterChange({ 
      status, 
      scoreRange, 
      country: value,
      filterStatus: filterStatus === "all" ? undefined : filterStatus,
      hasNegativePress,
      domainAvailable
    });
  };

  const handleFilterStatusChange = (value: string) => {
    setFilterStatus(value);
    onFilterChange({ 
      status, 
      scoreRange, 
      country,
      filterStatus: value === "all" ? undefined : value,
      hasNegativePress,
      domainAvailable
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-foreground">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Status</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Country Filter */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Country</label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
              <SelectItem value="US">🇺🇸 United States</SelectItem>
              <SelectItem value="DE">🇩🇪 Germany</SelectItem>
              <SelectItem value="FR">🇫🇷 France</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Status */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Filter Status</label>
          <Select value={filterStatus} onValueChange={handleFilterStatusChange}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="qualified">✓ Qualified</SelectItem>
              <SelectItem value="rejected">✗ Rejected</SelectItem>
              <SelectItem value="pending">⏱ Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Score Range */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">
            Score Range: {scoreRange[0]} - {scoreRange[1]}
          </label>
          <Slider
            value={scoreRange}
            onValueChange={handleScoreChange}
            min={0}
            max={100}
            step={5}
            className="mt-3"
          />
        </div>
      </div>
    </div>
  );
};
