import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import type { Notification } from '../types';
import {
  LayoutDashboard,
  AlertCircle,
  CheckSquare,
  Users,
  Building2,
  BarChart3,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  Settings,
  UserCircle,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import rraLogo from '../../assets/e686ed0804a4cc454121e4635af36398ddb2058a.png';

export function Root() {
  const { currentUser, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead, getUnreadNotificationsCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const unreadCount = getUnreadNotificationsCount();
  const userNotifications = notifications.filter((n) => n.userId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'HOD', 'STAFF'] },
    { path: '/issues', icon: AlertCircle, label: 'Issue Management', roles: ['ADMIN', 'HOD', 'STAFF'] },
    { path: '/validation', icon: CheckSquare, label: 'Data Validation', roles: ['ADMIN', 'HOD', 'STAFF'] },
    { path: '/users', icon: Users, label: 'User Management', roles: ['ADMIN'] },
    { path: '/departments', icon: Building2, label: 'Departments', roles: ['ADMIN', 'HOD'] },
    { path: '/reports', icon: BarChart3, label: 'Reports & Analytics', roles: ['ADMIN', 'HOD', 'STAFF'] },
    { path: '/audit', icon: FileText, label: 'History', roles: ['ADMIN', 'HOD'] },
    { path: '/settings', icon: Settings, label: 'Settings', roles: ['ADMIN'] },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationAsRead(notification.id);
    if (notification.issueId) {
      const suffix = notification.type === 'COMMENT_ADDED' ? '#comments' : '';
      navigate(`/issues/${notification.issueId}${suffix}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-[#20603D] to-[#00A1DE]">
          <div className="flex items-center gap-2">
            <img 
              src={rraLogo} 
              alt="RRA Logo" 
              className="w-10 h-10 object-contain bg-white rounded p-1"
            />
            <div className="text-white">
              <h1 className="text-sm font-bold leading-tight">DQIMS</h1>
              <p className="text-xs opacity-90">Data Quality</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-[#20603D] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="px-2 py-1.5 bg-gray-50 rounded mb-2">
            <p className="text-xs font-medium text-gray-700">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.role}</p>
            <p className="text-xs text-gray-500">{currentUser.department}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-8"
            onClick={logout}
          >
            <LogOut className="w-3 h-3 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <p className="text-xs text-gray-500">Rwanda Revenue Authority</p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2 border-b">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => { void markAllNotificationsAsRead(); }}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-80">
                  {userNotifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    <div className="p-1">
                      {userNotifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left px-3 py-2 rounded text-xs hover:bg-gray-50 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                              !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 mb-0.5">{notification.title}</p>
                              <p className="text-gray-600 mb-1">{notification.message}</p>
                              <p className="text-gray-400 text-[10px]">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#20603D] to-[#00A1DE] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currentUser.name.charAt(0)}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs">
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-gray-500">{currentUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="text-xs cursor-pointer">
                  <UserCircle className="w-3 h-3 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/change-password')} className="text-xs cursor-pointer">
                  <Lock className="w-3 h-3 mr-2" />
                  Change Password
                </DropdownMenuItem>
                {currentUser.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="text-xs cursor-pointer">
                    <Settings className="w-3 h-3 mr-2" />
                    Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-xs cursor-pointer text-red-600">
                  <LogOut className="w-3 h-3 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
