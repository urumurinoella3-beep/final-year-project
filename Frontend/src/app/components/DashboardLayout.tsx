import React, { useState } from 'react';
import { User, Page } from '@/app/App';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Tags, 
  ListChecks,
  Activity,
  Users,
  BarChart3,
  ShieldCheck,
  GitBranch,
  Plug,
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import logoImage from 'figma:asset/e686ed0804a4cc454121e4635af36398ddb2058a.png';

interface DashboardLayoutProps {
  user: User;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
  allowedRoles?: ('admin' | 'hod' | 'secretary' | 'member')[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'issue-reporting', label: 'Issue Reporting', icon: <FileText className="w-5 h-5" /> },
  { id: 'data-validation', label: 'Data Validation', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'issue-classification', label: 'Issue Classification', icon: <Tags className="w-5 h-5" /> },
  { id: 'issue-tracking', label: 'Issue Tracking', icon: <ListChecks className="w-5 h-5" /> },
  { id: 'monitoring', label: 'Monitoring', icon: <Activity className="w-5 h-5" /> },
  { id: 'user-management', label: 'User Management', icon: <Users className="w-5 h-5" />, allowedRoles: ['admin', 'hod'] },
  { id: 'reporting', label: 'Reporting & Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'audit-compliance', label: 'Audit & Compliance', icon: <ShieldCheck className="w-5 h-5" /> },
  { id: 'root-cause-analysis', label: 'Root Cause Analysis', icon: <GitBranch className="w-5 h-5" /> },
  { id: 'integration', label: 'Integration & API', icon: <Plug className="w-5 h-5" />, allowedRoles: ['admin'] },
];

export function DashboardLayout({ user, currentPage, onPageChange, onLogout, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'hod': return 'bg-blue-500';
      case 'secretary': return 'bg-purple-500';
      case 'member': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <img src={logoImage} alt="RRA Logo" className="w-10 h-10" />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-[#20603D]">DQIMS</h1>
              <p className="text-xs text-gray-600">Internal Data Quality Management</p>
            </div>
            {/* Role Badge */}
            <Badge className={`${getRoleBadgeColor(user.role)} text-white hidden lg:flex ml-3`}>
              {user.role.toUpperCase()} - {user.department}
            </Badge>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search issues, reports, users..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto py-2">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.department}</p>
                  </div>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className={`${getRoleBadgeColor(user.role)} text-white text-sm`}>
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge variant="outline" className={`${getRoleBadgeColor(user.role)} text-white border-0 text-xs uppercase`}>
                    {user.role}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 text-sm">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.role.toUpperCase()} - {user.department}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Standalone Logout Button */}
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
              size="sm"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 overflow-y-auto`}
      >
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start gap-3 ${
                currentPage === item.id 
                  ? 'bg-[#20603D] text-white hover:bg-[#20603D]/90' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onPageChange(item.id)}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'pl-0'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className={`fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 py-2 text-center text-xs text-gray-600 transition-all duration-300 ${
        sidebarOpen ? 'lg:pl-64' : 'pl-0'
      }`}>
        <p className="font-semibold text-red-600">⚠️ Internal Use Only – Confidential RRA Data</p>
        <p className="mt-0.5">© 2025-2026 AUCA Final Project – DQIMS for RRA</p>
      </footer>
    </div>
  );
}