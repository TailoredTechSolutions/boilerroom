import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by company name, registry ID, or country"
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Button size="icon" variant="ghost">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
