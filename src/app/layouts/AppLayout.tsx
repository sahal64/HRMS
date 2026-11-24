import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { useRole } from '@/app/providers/RoleContext';
import { cn } from '@/utils/cn';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f6f5f0] flex flex-col font-sans text-stone-900">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main content wrapper */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-60'
        )}
      >
        {/* Sticky Top Navigation */}
        <TopNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Page Content Body with Design 3 warm background */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
