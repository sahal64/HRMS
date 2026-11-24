import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCheck,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { useRole } from '@/app/providers/RoleContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { GlobalSearchModal } from './GlobalSearchModal';
import { MOCK_NOTIFICATIONS } from '@/mock-data/notifications';
import { useNavigate } from 'react-router-dom';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { currentOrganization } = useOrganization();
  const { currentUser, logout } = useRole();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const navigate = useNavigate();

  const tenantNotifications = notifications.filter(
    (n) => n.organizationId === currentOrganization.id
  );
  const unreadCount = tenantNotifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.organizationId === currentOrganization.id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#e6e3da] bg-[#fbfaf7]/90 px-4 sm:px-6 backdrop-blur-md select-none">
        {/* Left: Mobile Toggle + Page Title + Active Company Display */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-md p-1.5 text-stone-600 hover:bg-[#eae7df] lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <span className="text-[15px] font-semibold text-stone-900 tracking-tight hidden sm:inline-block mr-1">
            Dashboard
          </span>

          {/* Clean Company Badge (Clicking takes her directly to edit company setup) */}
          <button
            onClick={() => navigate('/organization')}
            className="flex items-center gap-2 rounded-lg border border-[#e2dfd6] bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-stone-400 hover:text-stone-900 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
            title="Click to configure company settings"
          >
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded bg-[#fbe8e5] text-[#d9533f] font-semibold text-[10px]">
              {currentOrganization.code.slice(0, 2)}
            </span>
            <span className="truncate max-w-[150px] sm:max-w-[220px] text-xs font-medium">
              {currentOrganization.name}
            </span>
          </button>
        </div>

        {/* Right: Search, Notifications, User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Pill */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#e2dfd6] bg-white px-3 py-1 text-xs text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors w-32 sm:w-48 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <Search className="h-3.5 w-3.5 text-stone-400" />
            <span className="flex-1 text-left truncate text-xs">Search...</span>
            <kbd className="hidden sm:inline-block text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
              ⌘K
            </kbd>
          </button>

          {/* Notification Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button
                className="relative rounded-lg border border-[#e2dfd6] bg-white p-1.5 text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#d9533f] px-1 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" width="w-80">
              <div className="flex items-center justify-between p-3 border-b border-[#f0ede6]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-[#d9533f] font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="h-3 w-3" /> Mark read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#f0ede6]">
                {tenantNotifications.map((n) => (
                  <div key={n.id} className="p-2.5 text-xs hover:bg-[#f6f5f0] cursor-pointer">
                    <p className="font-semibold text-stone-900">{n.title}</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Pill */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 rounded-lg border border-[#e2dfd6] bg-white p-1 pr-2.5 hover:border-stone-400 transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="h-6 w-6 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-stone-900 leading-tight">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-stone-400 leading-tight font-medium">
                    HR Manager
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" width="w-56">
              <div className="p-3 border-b border-[#f0ede6]">
                <p className="font-bold text-xs text-stone-900">{currentUser.name}</p>
                <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
              </div>
              <div className="p-1">
                <DropdownMenuItem onClick={() => navigate('/self-service')}>
                  <User className="mr-2 h-3.5 w-3.5 text-stone-400" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/organization')}>
                  <Settings className="mr-2 h-3.5 w-3.5 text-stone-400" />
                  <span>Company Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }} destructive>
                  <LogOut className="mr-2 h-3.5 w-3.5 text-rose-500" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
