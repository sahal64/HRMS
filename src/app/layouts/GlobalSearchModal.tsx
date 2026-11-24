import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, ArrowRight, LayoutDashboard, Users, Calendar, Banknote, Building2, UserPlus, FileText } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { useOrganization } from '@/app/providers/OrganizationContext';
import { MOCK_EMPLOYEES } from '@/mock-data/employees';

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onOpenChange }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  const quickLinks = [
    { label: 'HR Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { label: 'Company & Organisation Setup', href: '/organization', icon: Building2, category: 'Navigation' },
    { label: 'Recruitment & Job Postings', href: '/recruitment', icon: UserPlus, category: 'Navigation' },
    { label: 'Attendance & Time Tracker', href: '/attendance', icon: Calendar, category: 'Navigation' },
    { label: 'Leave & Holidays', href: '/leave', icon: Calendar, category: 'Navigation' },
    { label: 'Payroll & Compensation', href: '/payroll', icon: Banknote, category: 'Navigation' },
    { label: 'HR Documents & Templates', href: '/documents', icon: FileText, category: 'Navigation' },
  ];

  // Search filtered employees in current organization
  const filteredEmployees = MOCK_EMPLOYEES.filter(
    (emp) =>
      emp.organizationId === currentOrganization.id &&
      (emp.fullName.toLowerCase().includes(query.toLowerCase()) ||
        emp.designation.toLowerCase().includes(query.toLowerCase()) ||
        emp.departmentName.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredLinks = quickLinks.filter((link) =>
    link.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    navigate(href);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules, pages, or employees (e.g. Leave, Sarah, Payroll)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-4 py-1">
          {/* Quick links */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              HRMS Modules & Pages
            </p>
            <div className="space-y-1">
              {filteredLinks.length > 0 ? (
                filteredLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleSelect(link.href)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-primary-600 rounded-lg transition-colors group text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-slate-400 group-hover:text-primary-600" />
                        <span>{link.label}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic px-3 py-1">No matching pages found</p>
              )}
            </div>
          </div>

          {/* Employees in current organization */}
          {query.trim().length > 1 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Employees in {currentOrganization.name}
              </p>
              <div className="space-y-1">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <button
                      key={emp.id}
                      onClick={() => handleSelect(`/attendance`)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-primary-600 rounded-lg transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.fullName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-xs sm:text-sm text-slate-800">
                            {emp.fullName}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {emp.designation} • {emp.departmentName}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-primary-600 font-mono">
                        {emp.employeeCode}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic px-3 py-1">No employees found matching "{query}"</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
