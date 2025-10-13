import { Database, Globe, Sliders, Download, Settings, LogOut, User, Grid, ChevronDown, Users, Bot, Megaphone, BarChart3, Briefcase, ShieldCheck, FolderLock, Target, Activity, BookOpen, GitBranch, LineChart, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import logoImage from "@/assets/ipo-firm-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Overview", icon: Grid, path: "/overview" },
  { name: "Venture Capital", icon: Database, path: "/" },
  { name: "CRM Core", icon: Briefcase, path: "/crm" },
  { name: "AI Agent Panel", icon: Bot, path: "/ai-agent" },
  { name: "Lead Generation", icon: Users, path: "/lead-generation" },
  { name: "Marketing", icon: Megaphone, path: "/marketing" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Compliance & Audit", icon: ShieldCheck, path: "/compliance" },
  { name: "Document Vault", icon: FolderLock, path: "/documents" },
  { name: "Investor Intelligence", icon: Target, path: "/investor-intelligence" },
  { name: "Performance & Maintenance", icon: Activity, path: "/performance" },
  { name: "Knowledge Hub", icon: BookOpen, path: "/knowledge" },
  { name: "Integration Logs", icon: GitBranch, path: "/integration-logs" },
  { name: "Feedback & Optimization", icon: LineChart, path: "/feedback" },
  { name: "Data Sources", icon: Globe, path: "/data-sources" },
  { name: "Rules & Scoring", icon: Sliders, path: "/rules-scoring" },
  { name: "Exports", icon: Download, path: "/exports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const NavigationSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[220px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Venture Capital Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Venture Capital</h1>
            <p className="text-xs text-muted-foreground">IPO Firm</p>
          </div>
        </div>
      </div>

      {/* User Profile Dropdown */}
      <div className="p-4 border-b border-sidebar-border">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-foreground">Administration</p>
            <p className="text-xs text-muted-foreground">admin@vc.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border/20 flex justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
