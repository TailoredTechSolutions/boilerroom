import { Database, Globe, Sliders, Download, Settings, LogOut, User, Grid, ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import logoImage from "@/assets/ipo-firm-logo.png";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Overview", icon: Grid, path: "/overview" },
  { name: "Venture Capital", icon: Database, path: "/" },
  { name: "Data Sources", icon: Globe, path: "/data-sources" },
  { name: "Lead Generation", icon: Users, path: "/lead-generation" },
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
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm">
          <User className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
