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
}

export const FilterPanel = ({ onFilterChange }: FilterPanelProps) => {
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [status, setStatus] = useState("all");
  const [country, setCountry] = useState("all");

  const handleScoreChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setScoreRange(newRange);
    onFilterChange({ status, scoreRange: newRange, country });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ status: value, scoreRange, country });
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    onFilterChange({ status, scoreRange, country: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-foreground">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
