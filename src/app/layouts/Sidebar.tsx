import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_CONFIG, NavGroup, NavItem } from '@/app/navigation/nav-config';
import { useRole } from '@/app/providers/RoleContext';
import { cn } from '@/utils/cn';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { hasAccess } = useRole();

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const renderNavItem = (item: NavItem) => {
    if (!hasAccess(item.moduleKey)) return null;

    const isActive = location.pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
      <NavLink
        key={item.id}
        to={item.href}
        onClick={() => {
          if (window.innerWidth < 1024) onClose();
        }}
        className={cn(
          'group flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-medium rounded-lg transition-all duration-150 select-none relative',
          isActive
            ? 'text-stone-900 font-semibold bg-white border border-[#e2dfd6] shadow-[0_1px_2px_rgba(0,0,0,0.025)]'
            : 'text-stone-600 hover:text-stone-900 hover:bg-[#eae7de]/60',
          isCollapsed && 'justify-center px-1.5'
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            isActive ? 'text-[#d9533f]' : 'text-stone-400 group-hover:text-stone-600'
          )}
        />
        {!isCollapsed && (
          <span className="truncate flex-1 tracking-tight">{item.label}</span>
        )}
        {!isCollapsed && item.badge && (
          <span
            className={cn(
              'ml-auto text-[10px] px-1.5 py-0.2 rounded-md font-medium',
              isActive
                ? 'bg-stone-900 text-white'
                : 'bg-stone-200/80 text-stone-700'
            )}
          >
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  const renderNavGroup = (group: NavGroup) => {
    const accessibleItems = group.items.filter((item) => hasAccess(item.moduleKey));
    if (accessibleItems.length === 0) return null;

    const isGroupCollapsed = collapsedGroups[group.id];

    return (
      <div key={group.id} className="py-2">
        {!isCollapsed && (
          <div
            onClick={() => toggleGroup(group.id)}
            className="flex items-center justify-between px-3 py-1 cursor-pointer select-none text-[11px] font-semibold text-stone-400 hover:text-stone-700 uppercase tracking-wider"
          >
            <span>{group.title}</span>
            {isGroupCollapsed ? (
              <ChevronRight className="h-3 w-3 text-stone-400" />
            ) : (
              <ChevronDown className="h-3 w-3 text-stone-400" />
            )}
          </div>
        )}
        {!isGroupCollapsed && (
          <div className="space-y-0.5 mt-1">
            {accessibleItems.map(renderNavItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-[#eeece6] text-stone-800 transition-all duration-300 ease-in-out border-r border-[#e2dfd6] select-none',
          isCollapsed ? 'w-16' : 'w-60',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-[#e2dfd6]">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-stone-900 tracking-tight">
                HRM Admin
              </span>
            </div>
          ) : (
            <div className="h-7 w-7 rounded-lg bg-[#d9533f] text-white flex items-center justify-center font-bold text-xs mx-auto">
              H
            </div>
          )}

          <button
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:text-stone-700 hover:bg-[#e4e1d7] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
          {NAVIGATION_CONFIG.map(renderNavGroup)}
        </div>

        {/* Bottom Status */}
        <div className="p-2.5 border-t border-[#e2dfd6] bg-[#eae7e0]/60">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active Session
              </span>
              <button
                onClick={onToggleCollapse}
                className="text-stone-400 hover:text-stone-800 px-1 py-0.5 rounded hover:bg-[#e2dfd6] font-medium"
                title="Collapse sidebar"
              >
                « Collapse
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={onToggleCollapse}
                className="text-stone-500 hover:text-stone-900 p-1 rounded hover:bg-[#e2dfd6]"
                title="Expand sidebar"
              >
                »
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
