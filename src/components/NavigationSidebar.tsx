import { Database, Globe, Sliders, Download, Settings, LogOut, User, Grid, ChevronDown, Users, Bot, Megaphone, BarChart3, Briefcase, ShieldCheck, FolderLock, Target, Activity, BookOpen, GitBranch, LineChart, MoreVertical, Cog, Layers, Brain, Library, GitMerge, BarChart2, MessagesSquare, CalendarDays, Lock, Gauge, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import logoImage from "@/assets/dcg-logo.png";
import adminAvatar from "@/assets/admin-avatar.png";
import { useState } from "react";
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
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { name: "Overview", icon: Grid, path: "/overview" },
  { name: "Venture Capital", icon: Database, path: "/" },
  { 
    name: "Marketing and Analytics", 
    icon: Briefcase, 
    path: "/crm",
    children: [
      { name: "Data Normalization", icon: Layers, path: "/data-normalization" },
      { name: "Communication Logs", icon: MessagesSquare, path: "/communication-logs" },
      { name: "Investor Intelligence", icon: Target, path: "/investor-intelligence" },
      { name: "Knowledge Hub", icon: BookOpen, path: "/knowledge" },
      { name: "Integration Logs", icon: GitBranch, path: "/integration-logs" },
    ]
  },
  { name: "Lead Generation", icon: Users, path: "/lead-generation" },
  { name: "Feedback & Optimization", icon: LineChart, path: "/feedback" },
  { name: "Data Sources", icon: Globe, path: "/data-sources" },
  { name: "Rules & Scoring", icon: Sliders, path: "/rules-scoring" },
  { name: "Exports", icon: Download, path: "/exports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export const NavigationSidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

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


      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const isChildActive = hasChildren && item.children.some(child => location.pathname === child.path);

          return (
            <div key={item.name}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive || isChildActive
                        ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm flex-1 text-left">{item.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildItemActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                              isChildItemActive
                                ? "bg-sidebar-accent text-sidebar-primary font-medium"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                            }`}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span className="text-sm">{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
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
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Dropdown at Bottom */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sidebar-accent transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src={adminAvatar} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Administration</p>
                <p className="text-xs text-muted-foreground">admin@vc.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
